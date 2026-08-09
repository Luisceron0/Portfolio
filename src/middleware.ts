import { NextResponse, type NextRequest } from 'next/server'

import { toLocale } from '@/content'
import { buildContentSecurityPolicy, generateNonce } from '@/lib/csp'

/** Nombre del parámetro de idioma en la URL. RF-109: una sola ruta. */
export const LOCALE_PARAM = 'lang'
/** Cabecera interna con el idioma ya normalizado, para que la lea el layout. */
export const LOCALE_HEADER = 'x-site-locale'

export function middleware(request: NextRequest) {
  const nonce = generateNonce()
  const isDev = process.env.NODE_ENV !== 'production'
  const csp = buildContentSecurityPolicy(nonce, isDev)

  // Next lee la CSP de las cabeceras de PETICIÓN para inyectar el nonce en sus
  // propios <script>. Sin este paso, 'strict-dynamic' bloquea la hidratación.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  /*
   * RF-109: el idioma viaja en la query, no en la ruta, y se resuelve aquí para
   * que el layout pueda poner el `lang` correcto en el <html> desde la primera
   * respuesta. Un layout de Next 14 no recibe searchParams, y este es el camino
   * limpio para hacérselo llegar.
   *
   * `toLocale` normaliza: un valor desconocido o manipulado cae al idioma por
   * defecto, nunca produce una página en blanco.
   *
   * Esto NO contradice T-104: no se construye ninguna URL a partir de una
   * cabecera que controle el cliente. Solo se lee un parámetro de nuestra
   * propia URL y se reduce a uno de dos valores conocidos.
   */
  const locale = toLocale(request.nextUrl.searchParams.get(LOCALE_PARAM))
  requestHeaders.set(LOCALE_HEADER, locale)

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
