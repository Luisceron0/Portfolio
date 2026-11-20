import {
  education,
  hero,
  resolved,
  site,
  type Locale,
} from '@/content'

/**
 * RF-112 — utilidades de descubrimiento compartidas por la home y las páginas
 * de caso.
 *
 * T-104: toda URL absoluta sale de `site.url`, JAMÁS del header `Host`. Sin
 * origen declarado se devuelve la ruta tal cual: una URL relativa es correcta y
 * no miente, un dominio inventado acabaría desplegado.
 */
export function absoluteUrl(path: string): string {
  const origin = resolved(site.url)
  return origin ? new URL(path, origin).toString() : path
}

/** Ruta de la imagen de previsualización generada con next/og (src/app/og). */
export const OG_IMAGE_PATH = '/og'
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

/** Imagen de Open Graph y de Twitter Card: solo nombre y titular. */
export function previewImages(locale: Locale) {
  return [
    {
      url: absoluteUrl(OG_IMAGE_PATH),
      ...OG_IMAGE_SIZE,
      alt: `${hero.name}, ${hero.role[locale]}`,
    },
  ]
}

/**
 * JSON-LD de tipo Person. Por decisión del dueño (2026-11-14) solo lleva
 * nombre, titular, ciudad, URLs públicas, knowsAbout y alumniOf: nada de
 * teléfono, correo personal, edad ni dirección.
 */
export function personJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: hero.name,
    jobTitle: hero.role[locale],
    url: absoluteUrl('/'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pasto',
      addressCountry: 'CO',
    },
    sameAs: [hero.githubLink.href, hero.linkedinLink.href],
    knowsAbout: [
      'Application Security',
      'Secure Software Architecture',
      'DevSecOps',
      'Threat Modeling',
      'OWASP Top 10',
      'Role-Based Access Control',
      'Row Level Security',
      'AES-256-GCM',
      'Secrets Management',
      'SAST',
      'SCA',
      'Multi-tenant Architecture',
      'Architecture Decision Records',
      'Java',
      'Spring Boot',
      'Python',
      'Django',
      'Web Application Firewall',
      'OWASP ASVS',
      'React',
      'Next.js',
      'TypeScript',
      'PostgreSQL',
    ],
    alumniOf: education.entries.map((entry) => ({
      '@type': 'CollegeOrUniversity',
      name: entry.organization,
    })),
  }
}

/**
 * Serializa JSON para un `<script type="application/ld+json">`. Se escapa `<`
 * para que ningún valor pueda cerrar la etiqueta con un `</script>`.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
