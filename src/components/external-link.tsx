import {
  linkHref,
  projectsSection,
  resolved,
  type ExternalLink as ExternalLinkContent,
  type Locale,
} from '@/content'
import { PendingNote } from '@/components/pending'

type Variant = 'primary' | 'secondary'

/*
 * Botones rectangulares, no píldoras: el ángulo recto es parte del lenguaje
 * suizo y `tailwind.config.ts` fuerza radio 0 en todo el sistema.
 *
 * El primario va INVERTIDO respecto a la versión clara: sobre lienzo oscuro el
 * relleno es el color claro y la letra es el propio lienzo (`text-surface`).
 * Medido en `check:contrast` como "surface sobre accent".
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-surface hover:bg-accent-hover border border-accent',
  secondary: 'bg-transparent text-ink hover:bg-surface-subtle border border-hairline-strong hover:border-accent',
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
      className={`inline-flex min-h-[44px] items-center justify-center px-6 py-2.5 text-sm font-bold uppercase tracking-widest2 transition-colors duration-200 ${VARIANTS[variant]}`}
    >
      {link.label[locale]}
      {!isInternalAnchor && !isDownload && (
        // Aviso de "abre en pestaña nueva" solo para lectores de pantalla.
        <span className="sr-only">{projectsSection.labels.newTab[locale]}</span>
      )}
    </a>
  )
}
