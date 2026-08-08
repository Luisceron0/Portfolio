/**
 * Verificación del token de Cloudflare Turnstile — fail-closed.
 *
 * "Fail-closed" significa que TODO camino que no termine en una confirmación
 * explícita de Cloudflare devuelve rechazo: token ausente, secreto sin
 * configurar, Cloudflare caído, respuesta ininteligible. Nunca hay un `return
 * ok` por defecto ni un catch que deje pasar.
 *
 * Esto es la mitad servidor del control. La otra mitad (botón deshabilitado
 * hasta que llega el token) está en components/contact-form.tsx. Las dos son
 * necesarias: la del cliente evita el 400 que ya ocurrió en koa-landing, la del
 * servidor es la que de verdad protege, porque el cliente no es de fiar.
 */

import { isTestMode, TURNSTILE_TEST_KEYS } from '@/lib/test-mode'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TIMEOUT_MS = 5000

export type TurnstileRejection =
  | 'MISSING_TOKEN'
  | 'MISSING_SECRET'
  | 'REJECTED_BY_CLOUDFLARE'
  | 'UNREACHABLE'

export type TurnstileVerdict = { ok: true } | { ok: false; reason: TurnstileRejection }

export function getTurnstileSecret(): string | null {
  const configured = process.env.TURNSTILE_SECRET_KEY
  if (configured && configured.length > 0) return configured
  // El secreto de prueba solo entra en juego con CONTACT_TEST_MODE=1 explícito.
  if (isTestMode) return TURNSTILE_TEST_KEYS.secretAlwaysPasses
  return null
}

export async function verifyTurnstileToken(
  token: unknown,
  remoteIp?: string
): Promise<TurnstileVerdict> {
  if (typeof token !== 'string' || token.length === 0) {
    return { ok: false, reason: 'MISSING_TOKEN' }
  }

  const secret = getTurnstileSecret()
  if (!secret) {
    // Sin secreto no se puede verificar nada. Se rechaza, no se deja pasar.
    return { ok: false, reason: 'MISSING_SECRET' }
  }

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  let response: Response
  try {
    response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
  } catch {
    // Cloudflare inalcanzable o timeout. Fail-closed: se rechaza.
    return { ok: false, reason: 'UNREACHABLE' }
  }

  if (!response.ok) return { ok: false, reason: 'UNREACHABLE' }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    return { ok: false, reason: 'UNREACHABLE' }
  }

  const succeeded =
    typeof payload === 'object' &&
    payload !== null &&
    (payload as { success?: unknown }).success === true

  return succeeded ? { ok: true } : { ok: false, reason: 'REJECTED_BY_CLOUDFLARE' }
}
