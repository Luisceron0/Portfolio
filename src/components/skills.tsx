import type { CSSProperties } from 'react'

import { skills, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import {
  Section,
  SectionHeading,
  TONE_BG,
  TONE_BORDER,
  TONE_HOVER_BORDER,
  TONE_TEXT,
  type Tone,
} from '@/components/section'
import { SkillsIcon } from '@/components/icons'

/** RF-110: un tono por grupo, para que cinco tarjetas no se lean como una sola. */
const GROUP_TONES: readonly Tone[] = ['green', 'violet', 'mint', 'lilac', 'silver']

/**
 * RF-107 — habilidades y certificaciones.
 *
 * Grupos y elementos salen del YAML del CV, exactamente como están ahí. Se
 * renderizan como chips escaneables y no como prosa, que es el criterio de
 * aceptación literal.
 */
export function Skills({ locale }: { locale: Locale }) {
  return (
    <Section
      id="habilidades"
      labelledBy="habilidades-title"
      band="abyss"
      watermark={skills.heading[locale]}
    >
      <SectionHeading
        id="habilidades-title"
        number="04"
        title={skills.heading[locale]}
        intro={skills.intro[locale]}
        tone="lilac"
        icon={<SkillsIcon />}
      />

      {/*
        Cada grupo es un panel de menú de P3R: borde superior del tono, número
        de entrada hueco y chips inclinados. Rejilla con `gap` normal, no la
        tabla continua de la v2: con fondo abismo, las celdas sueltas respiran
        mejor y un número impar de grupos ya no deja un hueco que tapar.
      */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {skills.groups.map((group, index) => {
          const tone = GROUP_TONES[index % GROUP_TONES.length]
          return (
            <Reveal key={group.label.es} delayMs={index * 70}>
              <div
                className={`group h-full border-t-4 bg-abyss-card/80 p-5 transition-transform duration-300 ease-out hover:-translate-y-1 sm:p-6 ${TONE_BORDER[tone]}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`p-display p-outline text-3xl leading-none ${TONE_TEXT[tone]}`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`p-display text-base sm:text-lg ${TONE_TEXT[tone]}`}>
                    {group.label[locale]}
                  </h3>
                  <span
                    aria-hidden="true"
                    className={`ml-auto h-1.5 w-10 -skew-x-[30deg] transition-all duration-300 group-hover:w-16 ${TONE_BG[tone]}`}
                  />
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items[locale].map((item, itemIndex) => (
                    <li
                      key={item}
                      style={{ '--i': itemIndex } as CSSProperties}
                      className={`p-chip border border-hairline-strong bg-surface px-3 py-1.5 font-mono text-xs text-ink ${TONE_HOVER_BORDER[tone]}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>

      <Reveal delayMs={140}>
        <h3 className="mt-14">
          <span className="p-slant p-display inline-block px-4 py-1 text-base text-surface [--slant-bg:#a6f13c]">
            {skills.certificationsHeading[locale]}
          </span>
        </h3>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
          {skills.certifications[locale].map((certification) => (
            <li
              key={certification}
              className="flex gap-3 border-b border-tone-green/25 py-3 text-base leading-relaxed text-ink"
            >
              <span aria-hidden="true" className="shrink-0 text-tone-mint">
                ★
              </span>
              {certification}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
