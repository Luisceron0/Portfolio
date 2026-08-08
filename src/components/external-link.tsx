import { resolved, type ExternalLink as ExternalLinkContent } from '@/content'
import { PendingNote } from '@/components/pending'

type Variant = 'primary' | 'secondary'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-surface-card hover:bg-accent-hover border border-transparent',
  secondary:
    'bg-surface-card text-accent hover:bg-surface-subtle border border-accent',
}

/**
 * Enlace externo.
 *
 * Si el href sigue [PENDIENTE], NO renderiza un <a> roto: muestra el aviso.
 * Regla 3: ninguna afirmación —ni un botón que promete un recurso— sin enlace
 * real detrás.
 */
export function ExternalLinkButton({
  link,
  variant = 'primary',
  download,
}: {
  link: ExternalLinkContent
  variant?: Variant
  download?: string
}) {
  const href = resolved(link.href)

  if (!href) {
    return <PendingNote value={link.href} />
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
      className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5 text-base font-semibold transition-colors ${VARIANTS[variant]}`}
    >
      {link.label}
      {!isInternalAnchor && !isDownload && (
        // Aviso de "abre en pestaña nueva" solo para lectores de pantalla.
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      )}
    </a>
  )
}
