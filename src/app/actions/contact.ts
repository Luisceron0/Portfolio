'use server'

/**
 * Server action del formulario de contacto — la única entrada de datos del sitio.
 *
 * Orden de comprobaciones, y por qué es ese (ver tasks/plan.md §2):
 *   1. Rate limit  — antes que nada, para que nadie pueda forzar llamadas a
 *                    Cloudflare ni a Resend simplemente insistiendo.
 *   2. Validación  — antes de Turnstile, porque es local y gratis; un mensaje
 *                    de 50.000 caracteres se rechaza sin salir a la red.
 *   3. Turnstile   — antes de Resend, para no gastar cuota con un bot.
 *   4. Envío       — lo último, cuando ya se sabe que la petición es legítima.
 *
 * Invariantes:
 *   - Nunca se devuelve al cliente nada que el visitante haya escrito (T-103).
 *     La respuesta son códigos; el texto lo pone content.ts en el cliente.
 *   - Nunca se registra el contenido del formulario ni el correo del visitante.
 *     Los logs llevan endpoint + código, nada más.
 *   - No se persiste nada en ningún sitio.
 */

import { headers } from 'next/headers'

import type { ContactState } from '@/lib/contact-state'
import { sendContactEmail } from '@/lib/mailer'
import { checkRateLimit, hashClientKey, RATE_LIMIT, rateLimitStore } from '@/lib/rate-limit'
import { rateLimitMaxOverride } from '@/lib/test-mode'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { validateContact } from '@/lib/validation'

/**
 * Identificador del cliente para el rate limit.
 *
 * Lee `x-forwarded-for` (la IP del visitante detrás del proxy de Vercel). Ojo:
 * esto NO contradice T-104 — T-104 prohíbe derivar URLs del header `Host`. Aquí
 * no se construye ninguna URL; el valor solo se hashea para contar peticiones,
 * y nunca se guarda ni se registra en claro.
 */
function clientKey(): string {
  const forwarded = headers().get('x-forwarded-for')
  const realIp = headers().get('x-real-ip')
  const raw = forwarded?.split(',')[0]?.trim() || realIp || 'desconocido'
  return hashClientKey(raw)
}

/** Log de error: endpoint + código. Jamás el contenido ni el correo. */
function logFailure(code: string): void {
  console.error(`[contact-action] ${code}`)
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // 1. Rate limit.
  const verdict = checkRateLimit(
    clientKey(),
    Date.now(),
    rateLimitStore,
    rateLimitMaxOverride() ?? RATE_LIMIT.maxRequests
  )
  if (!verdict.allowed) {
    logFailure('RATE_LIMITED')
    return {
      status: 'error',
      code: 'RATE_LIMITED',
      retryAfterSeconds: verdict.retryAfterSeconds,
    }
  }

  // 2. Validación de servidor. Se ejecuta siempre, exista o no la del cliente.
  const validation = validateContact({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })
  if (!validation.ok) {
    logFailure('VALIDATION')
    return { status: 'error', code: 'VALIDATION', fieldErrors: validation.errors }
  }

  // 3. Turnstile, fail-closed. Una petición fabricada que salte el botón
  //    deshabilitado del cliente muere aquí.
  const captcha = await verifyTurnstileToken(formData.get('cf-turnstile-response'))
  if (!captcha.ok) {
    logFailure(`CAPTCHA:${captcha.reason}`)
    // El motivo concreto se queda en el log del servidor: al cliente le llega
    // un código genérico. No se le explica a un bot por qué falló.
    return { status: 'error', code: 'CAPTCHA' }
  }

  // 4. Envío.
  const sent = await sendContactEmail(validation.value)
  if (!sent.ok) {
    logFailure(`SEND_FAILED:${sent.reason}`)
    return { status: 'error', code: 'SEND_FAILED' }
  }

  return { status: 'success' }
}
