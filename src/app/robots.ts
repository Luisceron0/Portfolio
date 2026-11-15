import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'

/** RF-112 — robots.txt: todo indexable, con el sitemap declarado. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
