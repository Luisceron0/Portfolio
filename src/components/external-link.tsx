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
 * Botones del zine (RF-110 v5): etiquetas recortadas. La forma irregular vive
 * en `::before` y la sombra sólida en `::after` (`.p-btn` en globals.css); el
 * enlace queda rectangular, así el anillo de foco no se recorta. El hover es
 * el de P3R: se desplaza y estira con `--ease-snap`.
 *
 *  - primary: relleno magenta.deep con letra papel (5.78:1).
 *  - secondary: recorte de fotocopia con letra tinta; sombra magenta en hover.
 *  - dark: cartulina tinta con letra papel, para fondos de papel magenta.
 */
const VARIANTS: Record<Variant, string> = {
  primary: '',
  secondary: 'p-btn--secondary',
  dark: 'p-btn--dark',
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
      className={`p-btn inline-flex min-h-[48px] items-center justify-center px-7 py-2.5 text-sm font-extrabold uppercase tracking-dymo ${VARIANTS[variant]}`}
    >
      {link.label[locale]}
      {!isInternalAnchor && !isDownload && (
        // Aviso de "abre en pestaña nueva" solo para lectores de pantalla.
        <span className="sr-only">{projectsSection.labels.newTab[locale]}</span>
      )}
    </a>
  )
}
