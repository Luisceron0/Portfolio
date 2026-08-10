import { hero, type Locale } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'

/**
 * RF-101 (propuesta de valor) + RF-105 (enlace a GitHub).
 *
 * Los dos criterios que condicionan el maquetado:
 *  - RF-101: legible y comprensible SIN hacer scroll en un viewport de 375 px.
 *  - RF-105: el enlace al perfil de GitHub visible sin pasar del hero.
 * Por eso ambos CTA van dentro de esta sección, no más abajo.
 *
 * OJO al añadir cosas aquí: `e2e/landing.spec.ts` mide que el titular, la
 * propuesta de valor y los dos CTA entren en 375x667. Cualquier elemento nuevo
 * por encima de los botones consume ese presupuesto. Es intencionado.
 */
export function Hero({ locale }: { locale: Locale }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto max-w-content px-5 pb-12 pt-8 sm:px-8 sm:pb-24 sm:pt-16"
    >
      <p className="inline-block rounded-full border border-hairline-strong bg-surface-card/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest2 text-ink-muted">
        {hero.role[locale]}
      </p>

      <h1
        id="hero-title"
        className="mt-4 text-4xl font-bold leading-[0.95] tracking-tight sm:mt-5 sm:text-6xl sm:tracking-tighter md:text-7xl lg:text-8xl"
      >
        {hero.name}
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted sm:mt-5 sm:text-xl">
        {hero.pitch[locale]}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
        <ExternalLinkButton link={hero.contactCta} locale={locale} variant="primary" />
        <ExternalLinkButton link={hero.githubLink} locale={locale} variant="secondary" />
      </div>

      {/* Debajo de los CTA a propósito: no compite por el espacio que RF-101
          reserva para el titular, la propuesta de valor y los botones. */}
      <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted sm:mt-8">
        <span>{hero.location[locale]}</span>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent/50" />
        <span>{hero.availability[locale]}</span>
      </p>
    </section>
  )
}
