import type { CSSProperties } from 'react'

import { skills, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { FanWords } from '@/components/zine'

/** Giro leve de cada ficha: una pila de fichas, no una rejilla de UI. */
const TILT = [-1, 0.8, -0.6, 1.2, -1.2, 0.6] as const

/**
 * RF-107 — habilidades, con Seguridad primero, sobre la banda violeta del menú
 * P3R, con los nombres de los grupos en abanico gigante de fondo. Cada grupo es
 * una hoja de fotocopia con el número como sello y los elementos como
 * etiquetas Dymo. Se renderizan como chips escaneables y no como prosa, que es
 * el criterio de aceptación literal.
 */
export function Skills({ locale }: { locale: Locale }) {
  return (
    <Section id="habilidades" labelledBy="habilidades-title" band="violet">
      <SectionHeading
        id="habilidades-title"
        number="05"
        title={skills.heading[locale]}
        intro={skills.intro[locale]}
        tone="lilac"
        onColor
      />

      <FanWords
        words={skills.groups.map((group) => group.label[locale])}
        className="left-[46%] top-0 hidden md:block"
      />

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {skills.groups.map((group, index) => (
          <Reveal key={group.label.es} delayMs={index * 70}>
            <div
              className="m-sheet h-full px-5 py-5 transition-transform duration-300 ease-out hover:-translate-y-1 sm:pr-6"
              // `rotate` y no `transform`: así no pisa el `hover:-translate-y-1`.
              style={{ rotate: `${TILT[index % TILT.length]}deg` } as CSSProperties}
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="m-stamp m-stamp--paper text-base [--stamp-r:-6deg]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="p-display text-base text-tinta sm:text-lg">{group.label[locale]}</h3>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items[locale].map((item, itemIndex) => (
                  <li
                    key={item}
                    style={{ '--i': itemIndex } as CSSProperties}
                    className="p-chip m-dymo text-[0.68rem]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
