import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CASE_NAMES, HTML_LANG, LOCALES, resolved, securityCases, site } from '@/content'
import { CaseDetail } from '@/components/case-detail'
import { Footer } from '@/components/footer'
import { SiteNav } from '@/components/nav'
import { casePath, getLocale, localeHref } from '@/lib/locale'

/**
 * RF-111 — página de detalle de un caso de seguridad: `/casos/<slug>`.
 *
 * `force-dynamic` por el mismo motivo que la home: la CSP lleva un nonce por
 * petición (src/middleware.ts) y el idioma se resuelve por petición. Un slug
 * que no está en `securityCases` responde 404, nunca una página vacía.
 */
export const dynamic = 'force-dynamic'

function findCase(slug: string) {
  const index = securityCases.findIndex((item) => item.slug === slug)
  return index === -1 ? null : { item: securityCases[index], index }
}

/** Misma regla que el layout: URLs absolutas desde `site.url`, nunca desde `Host`. */
function absolute(path: string): string {
  const origin = resolved(site.url)
  return origin ? new URL(path, origin).toString() : path
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const found = findCase(params.slug)
  if (!found) return {}

  const locale = getLocale()
  const path = casePath(found.item.slug)
  const name = CASE_NAMES[found.item.slug]
  const title =
    locale === 'es' ? `${name}: caso de seguridad | Luis Cerón` : `${name}: security case | Luis Cerón`
  const description = found.item.summary[locale]

  return {
    title,
    description,
    alternates: {
      canonical: absolute(localeHref(locale, path)),
      languages: Object.fromEntries(
        LOCALES.map((candidate) => [HTML_LANG[candidate], absolute(localeHref(candidate, path))])
      ),
    },
    openGraph: {
      title,
      description,
      locale: HTML_LANG[locale],
      type: 'article',
      url: absolute(localeHref(locale, path)),
    },
  }
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const found = findCase(params.slug)
  if (!found) notFound()

  const locale = getLocale()

  return (
    <>
      <SiteNav locale={locale} path={casePath(found.item.slug)} />
      <main id="contenido">
        <CaseDetail item={found.item} index={found.index} locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  )
}
