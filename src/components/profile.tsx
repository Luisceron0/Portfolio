import { profile, resolved, linkHref, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { projectsSection } from '@/content'
import { ProfileIcon } from '@/components/icons'

/**
 * RF-106 — perfil profesional.
 *
 * El resumen y los datos salen del YAML del CV del dueño, sin reescribir: si
 * el CV cambia, este bloque cambia. Es lo que impide que la página y el CV se
 * contradigan, que es un criterio de aceptación explícito (§9 de la SRS).
 *
 * La ficha de datos es una `<dl>` de verdad, y aquí sí corresponde: cada par
 * es literalmente término y definición ("Ubicación" / "Pasto, Colombia"). Se
 * presenta como tabla de especificaciones, en monoespaciada y con una regla
 * entre filas.
 *
 * El perfil es UN solo párrafo. Pasó por tres formas antes de esta: el resumen
 * del CV a secas, luego el resumen más un bloque etiquetado DEV/ARCH/SEC, y
 * luego el resumen más tres párrafos de prosa. Se unificó a petición del dueño.
 */
export function Profile({ locale }: { locale: Locale }) {
  return (
    <Section id="perfil" labelledBy="perfil-title">
      <SectionHeading
        id="perfil-title"
        number="01"
        title={profile.heading[locale]}
        tone="indigo"
        icon={<ProfileIcon />}
      />

      <div className="mt-12 grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <p className="border-l-2 border-accent pl-5 text-lg leading-relaxed text-ink">
            {profile.summary[locale]}
          </p>

          <ul className="mt-10 flex flex-wrap gap-3">
            {profile.links.map((link) => {
              const href = resolved(linkHref(link, locale))
              if (!href) return null
              return (
                <li key={link.label[locale]}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center border border-hairline-strong px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest2 text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    {link.label[locale]}
                    <span className="sr-only">{projectsSection.labels.newTab[locale]}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </Reveal>

        <Reveal delayMs={90}>
          <dl className="crop-marks border border-hairline">
            {profile.facts.map((fact, index) => (
              <div
                key={fact.label[locale]}
                className={`px-5 py-4 ${index > 0 ? 'border-t border-hairline' : ''}`}
              >
                <dt className="font-mono text-[0.65rem] uppercase tracking-spec text-ink-muted">
                  {fact.label[locale]}
                </dt>
                <dd className="mt-2 text-base leading-relaxed text-ink">
                  {fact.value[locale]}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
