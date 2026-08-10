import { hero, type Locale } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'
import { AsciiField } from '@/components/ascii'

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
 * por encima de los botones consume ese presupuesto. Es intencionado, y es la
 * razón de que el ASCII art solo aparezca a partir de `lg`: en móvil ocuparía
 * espacio que pertenece al contenido que el requisito exige ver.
 */
export function Hero({ locale }: { locale: Locale }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto max-w-content px-5 pb-12 pt-8 sm:px-8 sm:pb-24 sm:pt-16"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="inline-block border border-hairline-strong px-3 py-1 font-mono text-[0.7rem] uppercase tracking-spec text-ink-muted">
            {hero.role[locale]}
          </p>

          <h1
            id="hero-title"
            className="mt-5 text-5xl font-bold leading-[0.92] tracking-tighter sm:mt-6 sm:text-7xl md:text-8xl"
          >
            {hero.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            {hero.pitch[locale]}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ExternalLinkButton link={hero.contactCta} locale={locale} variant="primary" />
            <ExternalLinkButton link={hero.githubLink} locale={locale} variant="secondary" />
          </div>

          {/* Debajo de los CTA a propósito: no compite por el espacio que
              RF-101 reserva para el titular, la propuesta y los botones.
              Presentado como línea de datos, en monoespaciada. */}
          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline pt-5 font-mono text-xs uppercase tracking-widest2 text-ink-muted">
            <span>{hero.location[locale]}</span>
            <span aria-hidden="true" className="text-deco">
              /
            </span>
            <span>{hero.availability[locale]}</span>
          </p>
        </div>

        <AsciiField />
      </div>
    </section>
  )
}
