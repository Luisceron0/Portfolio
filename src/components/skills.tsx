import { skills, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import {
  Section,
  SectionHeading,
  TONE_HOVER_BORDER,
  TONE_TEXT,
  type Tone,
} from '@/components/section'

/** RF-110: un tono por grupo, para que cinco tarjetas no se lean como una sola. */
const GROUP_TONES: readonly Tone[] = ['indigo', 'teal', 'rust', 'ochre', 'plum']

/**
 * RF-107 — habilidades y certificaciones.
 *
 * Grupos y elementos salen del YAML del CV, exactamente como están ahí. Se
 * renderizan como chips escaneables y no como prosa, que es el criterio de
 * aceptación literal.
 */
export function Skills({ locale }: { locale: Locale }) {
  return (
    <Section id="habilidades" labelledBy="habilidades-title">
      <SectionHeading
        id="habilidades-title"
        number="04"
        title={skills.heading[locale]}
        intro={skills.intro[locale]}
        tone="plum"
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {skills.groups.map((group, index) => (
          <Reveal key={group.label.es} delayMs={index * 70}>
            <div
              className={`card-surface h-full rounded-2xl border border-hairline p-5 transition-colors duration-300 sm:p-6 ${
                TONE_HOVER_BORDER[GROUP_TONES[index % GROUP_TONES.length]]
              }`}
            >
              <h3
                className={`text-xs font-semibold uppercase tracking-widest2 ${
                  TONE_TEXT[GROUP_TONES[index % GROUP_TONES.length]]
                }`}
              >
                {group.label[locale]}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items[locale].map((item) => (
                  <li
                    key={item}
                    className={`rounded-full border border-hairline-strong bg-surface px-3 py-1.5 text-sm font-medium text-ink transition-colors duration-200 ${TONE_HOVER_BORDER[GROUP_TONES[index % GROUP_TONES.length]]}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={140}>
        <h3 className="mt-12 text-xs font-semibold uppercase tracking-widest2 text-ink-muted">
          {skills.certificationsHeading[locale]}
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {skills.certifications[locale].map((certification) => (
            <li
              key={certification}
              className="card-surface rounded-xl border border-hairline px-4 py-3 text-base leading-relaxed text-ink transition-colors duration-200 hover:border-hairline-strong"
            >
              {certification}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
