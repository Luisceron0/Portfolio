import type { MetadataRoute } from 'next'

import { HTML_LANG, LOCALES, projectCases } from '@/content'
import { casePath, localeHref } from '@/lib/locale'
import { absoluteUrl } from '@/lib/seo'

/**
 * RF-112 — sitemap.xml: la home y una URL por caso de seguridad, cada una con
 * su alternativa en el otro idioma. Las URLs salen de `site.url` (T-104).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...projectCases.map((item) => casePath(item.slug))]

  return paths.map((path) => ({
    url: absoluteUrl(localeHref('es', path)),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [HTML_LANG[locale], absoluteUrl(localeHref(locale, path))])
      ),
    },
  }))
}
