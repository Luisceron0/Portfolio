import {
  linkHref,
  projectsSection,
  resolved,
  type ExternalLink as ExternalLinkContent,
  type Locale,
} from '@/content'
import { PendingNote } from '@/components/pending'

type Variant = 'primary' | 'secondary'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-surface-card hover:bg-accent-hover border border-transparent hover:-translate-y-0.5',
  secondary:
    'bg-surface-card text-accent hover:bg-surface-subtle border border-accent hover:-translate-y-0.5',
}

/**
 * Enlace externo.
 *
 * Si el href sigue [PENDIENTE], NO renderiza un <a> roto: muestra el aviso.
 * Regla 3: ninguna afirmación, ni un botón que promete un recurso, sin enlace
 * real detrás.
 */
export function ExternalLinkButton({
  link,
  locale,
  variant = 'primary',
  download,
}: {
  link: ExternalLinkContent
  locale: Locale
  variant?: Variant
  download?: string
}) {
  const href = resolved(linkHref(link, locale))

  if (!href) {
    return <PendingNote value={linkHref(link, locale)} />
  }

  const isInternalAnchor = href.startsWith('#')
  const isDownload = typeof download === 'string'

  return (
    <a
      href={href}
      // rel completo en enlaces a otra pestaña: sin acceso a window.opener.
      {...(isInternalAnchor || isDownload
        ? {}
        : { target: '_blank', rel: 'noopener noreferrer' })}
      {...(isDownload ? { download } : {})}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5 text-base font-semibold transition-all duration-200 ${VARIANTS[variant]}`}
    >
      {link.label[locale]}
      {!isInternalAnchor && !isDownload && (
        // Aviso de "abre en pestaña nueva" solo para lectores de pantalla.
        <span className="sr-only">{projectsSection.labels.newTab[locale]}</span>
      )}
    </a>
  )
}
