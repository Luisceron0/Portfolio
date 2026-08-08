/**
 * Envío del mensaje de contacto.
 *
 * Se llama a la API REST de Resend con `fetch` en vez de usar su paquete npm
 * (D-06 de tasks/plan.md): una dependencia menos en el único archivo que toca
 * un secreto.
 *
 * Selección de transporte, en este orden:
 *   1. RESEND_API_KEY configurada  → envío real.
 *   2. CONTACT_DRY_RUN=1           → registro en memoria, cero correos.
 *   3. Nada de lo anterior         → NOT_CONFIGURED, que el usuario ve como
 *                                    error explícito.
 *
 * El caso 3 es intencionado y es la mitad del protocolo de neutralización de
 * efectos: sin credencial, el fallo ocurre en el punto de integración, antes de
 * gastar cuota o de enviar nada a una bandeja real.
 */

import { isDryRun } from '@/lib/test-mode'
import type { ContactPayload } from '@/lib/validation'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const TIMEOUT_MS = 8000

export type MailFailure = 'NOT_CONFIGURED' | 'PROVIDER_REJECTED' | 'UNREACHABLE'
export type MailResult = { ok: true } | { ok: false; reason: MailFailure }

export type Transport = 'resend' | 'dry-run' | 'none'

/** Solo las variables que importan aquí, para que los tests puedan inyectarlas. */
export interface MailEnv {
  RESEND_API_KEY?: string
  CONTACT_FROM_EMAIL?: string
  CONTACT_TO_EMAIL?: string
}

export function selectTransport(
  env: MailEnv = process.env as MailEnv,
  dryRun: boolean = isDryRun
): Transport {
  if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && env.CONTACT_TO_EMAIL) return 'resend'
  if (dryRun) return 'dry-run'
  return 'none'
}

/**
 * Buzón en memoria del modo dry-run. Solo lo usan los tests; se vacía con el
 * proceso. Nunca se escribe a disco: seguiría siendo PII.
 */
export const dryRunOutbox: Array<{ subject: string; sentAt: number }> = []

/**
 * El asunto y el cuerpo se construyen aquí, no en el server action, para que la
 * defensa contra inyección de cabeceras (CWE-93) esté junto al envío.
 * `name` y `email` ya vienen sin CR/LF desde la validación; esto es el segundo
 * cinturón, no el primero.
 */
function buildEmail(payload: ContactPayload) {
  const subject = `Contacto desde el sitio — ${payload.name.replace(/[\r\n]/g, ' ')}`
  const text = [
    `Nombre: ${payload.name}`,
    `Correo: ${payload.email}`,
    '',
    payload.message,
  ].join('\n')
  return { subject, text }
}

export async function sendContactEmail(payload: ContactPayload): Promise<MailResult> {
  const transport = selectTransport()
  const { subject, text } = buildEmail(payload)

  if (transport === 'none') {
    return { ok: false, reason: 'NOT_CONFIGURED' }
  }

  if (transport === 'dry-run') {
    // Se guarda el asunto y la hora, nunca el cuerpo ni el correo del visitante.
    dryRunOutbox.push({ subject, sentAt: Date.now() })
    return { ok: true }
  }

  let response: Response
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        // reply_to permite responder al visitante sin exponer su correo en el
        // remitente ni permitirle suplantarlo.
        reply_to: payload.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
  } catch {
    return { ok: false, reason: 'UNREACHABLE' }
  }

  if (!response.ok) return { ok: false, reason: 'PROVIDER_REJECTED' }

  return { ok: true }
}
