/**
 * Cabeceras de seguridad.
 *
 * Reparto deliberado entre este archivo y `src/middleware.ts`:
 *
 *   - middleware.ts  -> CSP con nonce por petición, para todo salvo
 *                       `/_next/static` y `/_next/image`.
 *   - next.config.mjs -> CSP estática para EXACTAMENTE esas dos rutas que el
 *                       middleware no cubre, más el resto de cabeceras de
 *                       seguridad, que sí aplican a todas las rutas.
 *
 * Los dos conjuntos de rutas con CSP son disjuntos a propósito: dos cabeceras
 * `Content-Security-Policy` en la misma respuesta se intersecan y producen
 * bloqueos difíciles de depurar.
 *
 * Resultado: CSP presente en TODA respuesta (criterio de Fase 4 en tasks/todo.md).
 * Verificado por `e2e/security-headers.spec.ts`, no asumido.
 */

/** CSP para respuestas de assets estáticos: no son documentos, no ejecutan nada. */
const STATIC_ASSET_CSP = [
  "default-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')

/** Cabeceras de seguridad que no dependen del nonce y aplican a todas las rutas. */
const BASELINE_SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Sin cabecera `X-Powered-By: Next.js`: no regalamos la versión del framework.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: BASELINE_SECURITY_HEADERS,
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Content-Security-Policy', value: STATIC_ASSET_CSP }],
      },
      {
        source: '/_next/image',
        headers: [{ key: 'Content-Security-Policy', value: STATIC_ASSET_CSP }],
      },
    ]
  },
}

export default nextConfig
