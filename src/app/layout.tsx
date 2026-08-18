import type { Metadata, Viewport } from 'next'

import './globals.css'
import { footer, HTML_LANG, LOCALES, resolved, site } from '@/content'
import { getLocale, localeHref } from '@/lib/locale'

/**
 * T-104: `metadataBase` sale del dominio declarado en content.ts, nunca del
 * header `Host`. Mientras el dominio siga [PENDIENTE] se omite: Next emitirá
 * URLs relativas, que es correcto, en lugar de un dominio inventado que
 * acabaría desplegado.
 */
const siteUrl = resolved(site.url)

/**
 * Una ruta del sitio como URL absoluta, cuando hay origen declarado.
 *
 * Sin origen devuelve la ruta tal cual: una URL relativa es correcta y no
 * miente, mientras que un dominio inventado acabaría desplegado. Con origen,
 * la resolución se hace AQUÍ con `new URL`, que conserva el `?lang=`.
 */
function absolute(path: string): string {
  return siteUrl ? new URL(path, siteUrl).toString() : path
}

/**
 * El sitio es oscuro sin conmutador, así que el navegador debe pintar sus
 * propios cromos (barra de direcciones en móvil, fondo de sobre-scroll) del
 * mismo color que el lienzo. Sin esto aparece una franja blanca al rebotar el
 * scroll, que delata que la página "no es" oscura de verdad.
 *
 * Va en el export `viewport` y no en `metadata`: en Next 14 `themeColor` dentro
 * de `metadata` está deprecado y se ignora con un aviso en build.
 */
export const viewport: Viewport = {
  themeColor: '#0b0b0c',
}

/**
 * Los metadatos también son bilingües (RF-109). `generateMetadata` es una
 * función y no un objeto constante justamente porque necesita leer el idioma
 * de la petición.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale()

  /*
   * `metadataBase` NO se declara, y es deliberado. Con él puesto, Next resuelve
   * cada URL de metadatos por `resolveAbsoluteUrlWithPathname`, que termina en
   * esta línea (node_modules/next/dist/lib/metadata/resolvers/resolve-url.js):
   *
   *     resolvedUrl = result.pathname === "/" ? result.origin : result.href
   *
   * Este sitio es UNA sola página, así que el pathname siempre es "/", y esa
   * rama devuelve el origen pelado: el `?lang=en` desaparece. Los dos idiomas
   * acababan declarando la MISMA canónica y el MISMO hreflang, que es
   * exactamente lo contrario de lo que esas etiquetas sirven para decir.
   *
   * Sin `metadataBase`, Next deja pasar la cadena tal cual, así que las URLs se
   * resuelven aquí con `absolute()` y el parámetro sobrevive. `metadataBase`
   * solo hace falta para resolver imágenes relativas de Open Graph, y hoy no
   * hay ninguna; si algún día se añade una, va absoluta, desde `site.url`.
   */
  return {
    title: site.title[locale],
    description: site.description[locale],
    robots: { index: true, follow: true },
    /*
     * `alternates` le dice a un buscador que las dos versiones son la misma
     * página en distinto idioma, en vez de contenido duplicado.
     *
     * Los enlaces van ABSOLUTOS, resueltos aquí y no por Next. Con
     * `metadataBase` puesto y una ruta relativa, Next resuelve `/?lang=en`
     * contra la base y se come el parámetro: los dos idiomas acababan
     * declarando la MISMA canónica, que es justo lo contrario de lo que estas
     * etiquetas existen para decir. Se vio al declarar el origen, no antes,
     * porque sin `metadataBase` las rutas salían relativas y correctas.
     */
    alternates: {
      canonical: absolute(localeHref(locale)),
      languages: Object.fromEntries(
        LOCALES.map((candidate) => [HTML_LANG[candidate], absolute(localeHref(candidate))])
      ),
    },
    openGraph: {
      title: site.title[locale],
      description: site.description[locale],
      locale: HTML_LANG[locale],
      type: 'website',
      url: absolute(localeHref(locale)),
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = getLocale()

  return (
    // El `lang` refleja el idioma realmente renderizado, resuelto en servidor.
    <html lang={HTML_LANG[locale]}>
      <body>
        {/* Salto al contenido: primer elemento tabulable de la página (WCAG 2.4.1). */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-surface"
        >
          {footer.skipToContent[locale]}
        </a>
        {children}
      </body>
    </html>
  )
}
