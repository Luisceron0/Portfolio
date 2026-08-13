import { profile, resolved, linkHref, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { projectsSection } from '@/content'
import { ProfileIcon } from '@/components/icons'

/**
 * RF-106 — perfil profesional.
 *
 * Los datos de la ficha salen del CV del dueño; el resumen ya no es su copia
 * literal (ver la nota en `profile.summary`). Lo que no puede pasar es que la
 * página y el CV se CONTRADIGAN, que es un criterio de aceptación explícito
 * (§9 de la SRS).
 *
 * La ficha de datos es una `<dl>` de verdad, y aquí sí corresponde: cada par
 * es literalmente término y definición ("Ubicación" / "Pasto, Colombia"). Se
 * presenta como tabla de especificaciones, en monoespaciada y con una regla
 * entre filas.
 *
 * El perfil son TRES párrafos (desarrollo/arquitectura/seguridad, la estructura
 * antes del código, y la seguridad desde el diseño). Pasó por varias formas
 * antes: el resumen del CV a secas, el resumen más un bloque DEV/ARCH/SEC, el
 * resumen más prosa, y un único párrafo largo. El número de párrafos lo manda
 * `profile.summary`, no este componente: si el dueño añade o quita uno, aquí no
 * hay nada que tocar. La regla vertical del acento envuelve el bloque entero
 * para que no se corte entre párrafo y párrafo.
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
          <div className="space-y-5 border-l-2 border-accent pl-5">
            {profile.summary[locale].map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-ink">
                {paragraph}
              </p>
            ))}
          </div>

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
