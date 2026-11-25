import type { CSSProperties } from 'react'

import { skills, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { SkillsIcon } from '@/components/icons'
import { Staple } from '@/components/zine'

/** Giro leve de cada ficha: una pila de fichas, no una rejilla de UI. */
const TILT = [-1, 0.8, -0.6, 1.2, -1.2, 0.6] as const

/**
 * RF-107 — habilidades, con Seguridad primero, sobre la banda de fotocopia
 * lila (RF-110 v5). Cada grupo es una ficha de archivo rayada como un
 * cuaderno, con margen magenta, el número como sello y los elementos como
 * etiquetas Dymo. Se renderizan como chips escaneables y no como prosa, que es
 * el criterio de aceptación literal.
 */
export function Skills({ locale }: { locale: Locale }) {
  return (
    <Section id="habilidades" labelledBy="habilidades-title" band="lilac">
      <SectionHeading
        id="habilidades-title"
        number="05"
        title={skills.heading[locale]}
        intro={skills.intro[locale]}
        tone="lilac"
        icon={<SkillsIcon />}
        onPaper
      />

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {skills.groups.map((group, index) => (
          <Reveal key={group.label.es} delayMs={index * 70}>
            <div
              className="m-sheet m-ruled h-full py-5 pl-12 pr-5 transition-transform duration-300 ease-out hover:-translate-y-1 sm:pr-6"
              // `rotate` y no `transform`: así no pisa el `hover:-translate-y-1`.
              style={{ rotate: `${TILT[index % TILT.length]}deg` } as CSSProperties}
            >
              <Staple className="-top-1 left-6" />
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
