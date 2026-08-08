/**
 * FIXTURE VULNERABLE A PROPÓSITO — no forma parte de la aplicación.
 *
 * Archivo de test de `semgrep-rules/security.yaml`. Las anotaciones `ruleid:` marcan
 * la línea que DEBE dar hallazgo; las `ok:` marcan casos parecidos que NO deben
 * darlo (falsos positivos que la regla tiene prohibido producir).
 *
 * Se valida con: npm run verify:semgrep  (semgrep --test)
 *
 * Sin este archivo, "Semgrep: 0 hallazgos" no significa nada: no distingue
 * "el código está limpio" de "la regla no funciona".
 */

import { headers } from 'next/headers'

// ---------------------------------------------------------------------------
// no-host-header-url
// ---------------------------------------------------------------------------

export function badCanonical(path: string) {
  // ruleid: no-host-header-url
  const host = headers().get('host')
  return `https://${host}${path}`
}

export function badForwarded(request: Request) {
  // ruleid: no-host-header-url
  return request.headers.get('x-forwarded-host')
}

export function goodCanonical(path: string) {
  // ok: no-host-header-url
  const host = 'ejemplo-fijo.test'
  return `https://${host}${path}`
}

export function goodOtherHeader(request: Request) {
  // ok: no-host-header-url
  return request.headers.get('content-type')
}

// ---------------------------------------------------------------------------
// no-pii-in-logs
// ---------------------------------------------------------------------------

export function badLogEmail(payload: { email: string }) {
  // ruleid: no-pii-in-logs
  console.error('fallo al enviar', payload.email)
}

export function badLogFormData(form: FormData) {
  // ruleid: no-pii-in-logs
  console.log('contacto recibido', form.get('message'))
}

export function badLogPayload(payload: unknown) {
  // ruleid: no-pii-in-logs
  console.error('payload', JSON.stringify(payload))
}

export function goodLog() {
  // ok: no-pii-in-logs
  console.error('[contact-action] fallo de envío')
}

// ---------------------------------------------------------------------------
// no-secret-in-public-env
// ---------------------------------------------------------------------------

export function badPublicSecret() {
  // ruleid: no-secret-in-public-env
  return process.env.NEXT_PUBLIC_TURNSTILE_SECRET_KEY
}

export function badPublicApiKey() {
  // ruleid: no-secret-in-public-env
  return process.env.NEXT_PUBLIC_RESEND_API_KEY
}

export function goodPublicSiteKey() {
  // La site key de Turnstile es pública por diseño: la regla NO debe marcarla.
  // ok: no-secret-in-public-env
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
}

export function goodServerSecret() {
  // ok: no-secret-in-public-env
  return process.env.TURNSTILE_SECRET_KEY
}

// ---------------------------------------------------------------------------
// no-internal-error-to-client
// ---------------------------------------------------------------------------

export function badErrorLeak(error: Error) {
  // ruleid: no-internal-error-to-client
  return { ok: false, error: error.message }
}

export function goodStaticError() {
  // ok: no-internal-error-to-client
  return { ok: false, error: 'GENERIC_FAILURE' as const }
}
