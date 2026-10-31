import {
  linkHref,
  projectsSection,
  resolved,
  type ExternalLink as ExternalLinkContent,
  type Locale,
} from '@/content'
import { PendingNote } from '@/components/pending'

type Variant = 'primary' | 'secondary' | 'dark'

/*
 * Botones de P5R: un paralelogramo inclinado que se desplaza y deja ver una
 * sombra sólida al pasar el ratón. La forma vive en `::before` (ver `.p-slant`
 * en globals.css) y el enlace queda rectangular, así el anillo de foco no se
 * recorta.
 *
 * Toda la letra es `ink` sobre violeta, negro o blanco: pares medidos en
 * `check:contrast`. `dark` es para fondos violeta, donde el violeta no se vería.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'p-btn--primary text-ink',
  secondary: 'p-btn--secondary text-ink',
  dark: 'p-btn--dark text-ink',
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
      className={`p-slant p-btn p-display inline-flex min-h-[48px] items-center justify-center px-7 py-2.5 text-sm tracking-wide ${VARIANTS[variant]}`}
    >
      {link.label[locale]}
      {!isInternalAnchor && !isDownload && (
        // Aviso de "abre en pestaña nueva" solo para lectores de pantalla.
        <span className="sr-only">{projectsSection.labels.newTab[locale]}</span>
      )}
    </a>
  )
}
