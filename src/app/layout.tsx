import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { headers } from 'next/headers'

import './globals.css'
import { footer, HTML_LANG, LOCALES, resolved, site } from '@/content'
import { getLocale, localeHref } from '@/lib/locale'
import { personJsonLd, previewImages, serializeJsonLd } from '@/lib/seo'

/**
 * RF-110 v5 (D-05): la ÚNICA fuente autoalojada, la voz de rótulo a marcador.
 * Permanent Marker (Apache 2.0, licencia junto al archivo), subset Latin +
 * Latin-1 en `.woff2` de 28 KB. `next/font/local` la sirve desde el mismo
 * origen con `font-display: swap`, así que la CSP (`font-src 'self'`) no cambia.
 */
const marker = localFont({
  src: './fonts/permanent-marker-latin.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
  fallback: ['Arial Black', 'sans-serif'],
})

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
  themeColor: '#121014',
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
      languages: {
        ...Object.fromEntries(
          LOCALES.map((candidate) => [HTML_LANG[candidate], absolute(localeHref(candidate))])
        ),
        'x-default': absolute(localeHref('es')),
      },
    },
    openGraph: {
      title: site.title[locale],
      description: site.description[locale],
      locale: HTML_LANG[locale],
      type: 'website',
      url: absolute(localeHref(locale)),
      images: previewImages(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: site.title[locale],
      description: site.description[locale],
      images: previewImages(locale),
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = getLocale()
  // Nonce de la CSP de esta petición (src/middleware.ts). Un bloque JSON-LD no
  // se ejecuta, pero llevarlo con nonce mantiene la regla: ningún <script> sin él.
  const nonce = headers().get('x-nonce') ?? undefined

  return (
    // El `lang` refleja el idioma realmente renderizado, resuelto en servidor.
    <html lang={HTML_LANG[locale]} className={marker.variable}>
      {/* `p-curtain`: barrido de papeles de entrada, una vez (ver globals.css). */}
      <body className="p-curtain">
        {/* Salto al contenido: primer elemento tabulable de la página (WCAG 2.4.1). */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-magenta-deep focus:px-4 focus:py-2 focus:font-bold focus:text-paper"
        >
          {footer.skipToContent[locale]}
        </a>
        {children}
        {/* RF-112: JSON-LD Person. Solo datos públicos (ver src/lib/seo.ts). */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd(locale)) }}
        />
      </body>
    </html>
  )
}
