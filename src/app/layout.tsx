import type { Metadata } from 'next'

import './globals.css'
import { resolved, site } from '@/content'

/**
 * T-104: `metadataBase` sale del dominio declarado en content.ts, nunca del
 * header `Host`. Mientras el dominio siga [PENDIENTE] se omite: Next emitirá
 * URLs relativas, que es correcto, en lugar de un dominio inventado que
 * acabaría desplegado.
 */
const siteUrl = resolved(site.url)

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: site.title,
  description: site.description,
  robots: { index: true, follow: true },
  openGraph: {
    title: site.title,
    description: site.description,
    locale: site.locale,
    type: 'website',
    ...(siteUrl ? { url: siteUrl } : {}),
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        {/* Salto al contenido: primer elemento tabulable de la página (WCAG 2.4.1). */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  )
}
