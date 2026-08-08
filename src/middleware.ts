import { NextResponse, type NextRequest } from 'next/server'

import { buildContentSecurityPolicy, generateNonce } from '@/lib/csp'

export function middleware(request: NextRequest) {
  const nonce = generateNonce()
  const isDev = process.env.NODE_ENV !== 'production'
  const csp = buildContentSecurityPolicy(nonce, isDev)

  // Next lee la CSP de las cabeceras de PETICIÓN para inyectar el nonce en sus
  // propios <script>. Sin este paso, 'strict-dynamic' bloquea la hidratación.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    /*
     * Todas las rutas salvo `/_next/static` y `/_next/image`, que llevan su
     * propia CSP estática desde next.config.mjs. Los dos conjuntos son
     * disjuntos: nunca se emiten dos cabeceras CSP en una misma respuesta.
     *
     * Los archivos de /public (CVs en PDF, capturas) SÍ pasan por aquí, para
     * que no quede ninguna respuesta sin CSP.
     */
    '/((?!_next/static|_next/image).*)',
  ],
}
