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

  return {
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    title: site.title[locale],
    description: site.description[locale],
    robots: { index: true, follow: true },
    /*
     * `alternates` le dice a un buscador que las dos versiones son la misma
     * página en distinto idioma, en vez de contenido duplicado.
     */
    alternates: {
      canonical: localeHref(locale),
      languages: Object.fromEntries(
        LOCALES.map((candidate) => [HTML_LANG[candidate], localeHref(candidate)])
      ),
    },
    openGraph: {
      title: site.title[locale],
      description: site.description[locale],
      locale: HTML_LANG[locale],
      type: 'website',
      ...(siteUrl ? { url: siteUrl } : {}),
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
