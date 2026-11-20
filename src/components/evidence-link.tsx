import { casesSection, linkHref, resolved, type ExternalLink, type Locale } from '@/content'
import { PendingNote } from '@/components/pending'

/**
 * Enlace a la evidencia de un caso: un archivo, una línea, un documento.
 *
 * Si el destino sigue `[PENDIENTE]`, no se pinta un enlace roto: se muestra el
 * aviso con la pregunta para el dueño (regla 3 de copilot-instructions).
 */
export function EvidenceLink({ link, locale }: { link: ExternalLink; locale: Locale }) {
  const target = linkHref(link, locale)
  const href = resolved(target)

  if (!href) {
    return <PendingNote value={target} />
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[24px] items-center break-all font-mono text-xs text-ink underline decoration-tone-green decoration-2 underline-offset-4 hover:text-tone-green"
    >
      {link.label[locale]}
      <span className="sr-only">{casesSection.labels.newTab[locale]}</span>
    </a>
  )
}
