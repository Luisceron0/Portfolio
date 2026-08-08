import { hero } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'

/**
 * RF-101 (propuesta de valor) + RF-105 (enlace a GitHub).
 *
 * Los dos criterios que condicionan el maquetado:
 *  - RF-101: legible y comprensible SIN hacer scroll en un viewport de 375 px.
 *  - RF-105: el enlace al perfil de GitHub visible sin pasar del hero.
 * Por eso ambos CTA van dentro de esta sección, no más abajo.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto max-w-content px-5 pb-12 pt-10 sm:px-8 sm:pb-20 sm:pt-20"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
        {hero.role}
      </p>

      <h1
        id="hero-title"
        className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:mt-3 sm:text-5xl"
      >
        {hero.name}
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted sm:mt-5 sm:text-xl">
        {hero.pitch}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
        <ExternalLinkButton link={hero.contactCta} variant="primary" />
        <ExternalLinkButton link={hero.githubLink} variant="secondary" />
      </div>
    </section>
  )
}
