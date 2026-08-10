import { profile, resolved, linkHref, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading, TONE_TEXT, type Tone } from '@/components/section'
import { projectsSection } from '@/content'
import { ProfileIcon } from '@/components/icons'

/** Un tono por disciplina, en el mismo sistema que el resto de la página. */
const PRACTICE_TONES: readonly Tone[] = ['indigo', 'teal', 'rust']

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
          <p className="text-lg leading-relaxed text-ink-muted sm:text-xl">
            {profile.summary[locale]}
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
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

          {/*
            Las tres disciplinas, como filas de una ficha. Un tono por fila:
            reutiliza el mismo sistema de orientación por color del resto de la
            página en vez de introducir uno nuevo.
          */}
          <h3 className="mt-12 border-b border-hairline pb-3 font-mono text-[0.65rem] font-bold uppercase tracking-spec text-ink-muted">
            {profile.practicesHeading[locale]}
          </h3>

          <dl className="mt-2">
            {profile.practices.map((practice, index) => {
              const tone = PRACTICE_TONES[index % PRACTICE_TONES.length]
              return (
                <div key={practice.code} className="border-b border-hairline py-5">
                  <dt className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className={`font-mono text-[0.65rem] uppercase tracking-spec ${TONE_TEXT[tone]}`}
                    >
                      {practice.code}
                    </span>
                    <span className="text-lg font-bold tracking-tight text-ink">
                      {practice.label[locale]}
                    </span>
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-ink-muted">
                    {practice.body[locale]}
                  </dd>
                </div>
              )
            })}
          </dl>
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
