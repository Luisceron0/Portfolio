/**
 * Content Security Policy — directivas explícitas.
 *
 * Regla no negociable de .github/copilot-instructions.md: nada de "CSP
 * habilitada" sin enumerar directivas. Cada una de las de abajo está aquí por
 * un motivo concreto, comentado. Si añades una fuente, escribe por qué.
 */

/** Origen único de Cloudflare Turnstile (script + iframe del widget). */
export const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com'

/**
 * Genera un nonce criptográfico por petición.
 * Usa Web Crypto porque el middleware corre en el runtime Edge (sin `node:crypto`).
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
}

export function buildContentSecurityPolicy(nonce: string, isDev: boolean): string {
  const directives: Record<string, string[]> = {
    // Todo lo no cubierto por una directiva específica: solo mismo origen.
    'default-src': ["'self'"],

    // 'strict-dynamic' hace que los navegadores CSP3 ignoren la lista de hosts
    // y confíen solo en lo que cargue un script con nonce válido. El origen de
    // Turnstile se mantiene explícito para navegadores CSP2 y porque la SRS
    // exige que script-src nombre a Turnstile.
    // 'unsafe-eval' solo en dev: lo necesita React Fast Refresh.
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      TURNSTILE_ORIGIN,
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],

    // Tailwind compila a un .css servido desde 'self'. 'unsafe-inline' sigue
    // siendo necesario porque Next inyecta <style> inline en el streaming de
    // App Router; un nonce en style-src rompe ese inline en producción.
    // El riesgo residual es bajo: no renderizamos jamás input del usuario (T-103).
    'style-src': ["'self'", "'unsafe-inline'"],

    // data: por los iconos SVG inline codificados. Sin hosts externos: las
    // capturas de proyecto se sirven desde /public.
    'img-src': ["'self'", 'data:'],

    // Fuentes autoalojadas por next/font. Sin Google Fonts: ni petición externa
    // ni fuga de IP del visitante.
    'font-src': ["'self'"],

    // 'self' cubre la server action del formulario. Turnstile hace fetch a
    // Cloudflare para resolver el desafío.
    // Resend NO va aquí: se llama desde el servidor, el navegador nunca lo toca.
    // ws: solo en dev, para el HMR de Next.
    'connect-src': ["'self'", TURNSTILE_ORIGIN, ...(isDev ? ['ws:'] : [])],

    // El widget de Turnstile se renderiza en un iframe suyo. Es el único
    // iframe permitido en todo el sitio.
    'frame-src': [TURNSTILE_ORIGIN],

    // El formulario solo puede postear a nuestro propio origen.
    'form-action': ["'self'"],

    // Nadie puede embeber este sitio: anti-clickjacking.
    'frame-ancestors': ["'none'"],

    // Impide que un <base> inyectado reescriba las URLs relativas.
    'base-uri': ["'self'"],

    // Sin Flash, applets ni <object>.
    'object-src': ["'none'"],

    'manifest-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
  }

  const serialized = Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')

  // Directiva sin valor. En dev estorba: localhost es http.
  return isDev ? serialized : `${serialized}; upgrade-insecure-requests`
}
