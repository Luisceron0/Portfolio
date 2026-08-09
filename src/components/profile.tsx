import { profile } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'

/**
 * RF-106 — perfil profesional.
 *
 * El resumen y los datos salen del YAML del CV del dueño, sin reescribir: si
 * el CV cambia, este bloque cambia. Es lo que impide que la página y el CV se
 * contradigan, que es un criterio de aceptación explícito (§9 de la SRS).
 */
export function Profile() {
  return (
    <Section id="perfil" labelledBy="perfil-title">
      <SectionHeading id="perfil-title" number="01" title={profile.heading} />

      <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <p className="text-lg leading-relaxed text-ink-muted sm:text-xl">
            {profile.summary}
          </p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {profile.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-surface-subtle"
                >
                  {link.label}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delayMs={90}>
          <dl className="rounded-2xl border border-hairline bg-surface-card p-5 sm:p-6">
            {profile.facts.map((fact, index) => (
              <div
                key={fact.label}
                className={index > 0 ? 'mt-4 border-t border-hairline pt-4' : undefined}
              >
                <dt className="text-xs font-semibold uppercase tracking-widest2 text-ink-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-base leading-relaxed text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
