import Image from 'next/image'
import type { CSSProperties } from 'react'

import { resolved, workProcess, type Locale } from '@/content'
import { EvidenceLink } from '@/components/evidence-link'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { TimelineIcon } from '@/components/icons'
import { Tape } from '@/components/zine'

/**
 * Notas adhesivas en colores alternos, todos con tinta encima (check:contrast).
 * Sobre la lila solo vale tinta: por eso ningún texto de la nota es muted.
 */
const NOTE_COLORS = ['#ffd23f', '#FF9CF5', '#46C3D8', '#B6A6B6'] as const
const NOTE_TILT = [-2, 1.5, -1, 2] as const

/**
 * "Cómo trabajo" (SRS v1.4), en papel (RF-110 v5): cuatro notas adhesivas en
 * fila sobre la banda magenta. Modelar amenazas → decidir y registrar en ADR →
 * implementar → bloquear en CI, y cada paso enlaza a dónde se ve en los casos.
 *
 * La captura del gate solo se pinta cuando existe (`workProcess.gateScreenshot`),
 * como foto pegada; mientras tanto no hay hueco vacío en la página.
 */
export function Process({ locale }: { locale: Locale }) {
  const shot = workProcess.gateScreenshot
  const shotSrc = shot ? resolved(shot.src) : null

  return (
    <Section id="proceso" labelledBy="proceso-title" band="magenta">
      <SectionHeading
        id="proceso-title"
        number="03"
        title={workProcess.heading[locale]}
        intro={workProcess.intro[locale]}
        tone="ochre"
        icon={<TimelineIcon />}
        onPaper
      />

      <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {workProcess.steps.map((step, index) => (
          <li key={step.id}>
            <Reveal delayMs={index * 70} className="h-full">
              <div
                className="m-postit h-full p-5 pt-6 sm:p-6 sm:pt-7"
                style={
                  {
                    '--postit-bg': NOTE_COLORS[index % NOTE_COLORS.length],
                    '--postit-r': `${NOTE_TILT[index % NOTE_TILT.length]}deg`,
                  } as CSSProperties
                }
              >
                <span aria-hidden="true" className="p-display block text-4xl leading-none text-tinta">
                  {index + 1}
                </span>
                <h3 className="p-display mt-3 text-lg text-tinta sm:text-xl">{step.title[locale]}</h3>
                <p className="mt-3 text-base leading-relaxed text-tinta">{step.text[locale]}</p>
                <p className="p-type mt-4 text-xs font-bold text-tinta">{workProcess.evidenceLabel[locale]}</p>
                <ul className="mt-2 space-y-1.5">
                  {step.evidence.map((link) => (
                    <li key={link.label.es}>
                      <EvidenceLink link={link} locale={locale} onPaper />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      {shot && shotSrc && (
        <Reveal delayMs={120}>
          <div className="relative mt-14 [--tilt:-1.2deg]">
            <div className="m-photo">
              <Image
                src={shotSrc}
                alt={shot.alt[locale]}
                width={shot.width ?? 1280}
                height={shot.height ?? 577}
                className="w-full"
                sizes="100vw"
              />
            </div>
            <Tape className="-top-3 left-10" rotate={-7} />
            <Tape className="-top-3 right-10" rotate={6} />
          </div>
        </Reveal>
      )}
    </Section>
  )
}
