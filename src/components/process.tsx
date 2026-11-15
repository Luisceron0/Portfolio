import Image from 'next/image'

import { resolved, workProcess, type Locale } from '@/content'
import { EvidenceLink } from '@/components/evidence-link'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading, TONE_BG, TONE_TEXT, type Tone } from '@/components/section'
import { TimelineIcon } from '@/components/icons'

const STEP_TONES: readonly Tone[] = ['violet', 'green', 'mint', 'lilac']

/**
 * "Cómo trabajo" (SRS v1.4): modelar amenazas → decidir y registrar en ADR →
 * implementar → bloquear en CI. Cada paso enlaza a dónde se ve en los casos.
 *
 * La captura de un gate bloqueando un despliegue solo se pinta cuando existe
 * (`workProcess.gateScreenshot`); mientras tanto no hay hueco vacío en la página.
 */
export function Process({ locale }: { locale: Locale }) {
  const shot = workProcess.gateScreenshot
  const shotSrc = shot ? resolved(shot.src) : null

  return (
    <Section id="proceso" labelledBy="proceso-title" band="abyss">
      <SectionHeading
        id="proceso-title"
        number="03"
        title={workProcess.heading[locale]}
        intro={workProcess.intro[locale]}
        tone="green"
        icon={<TimelineIcon />}
      />

      <ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {workProcess.steps.map((step, index) => {
          const tone = STEP_TONES[index % STEP_TONES.length]
          return (
            <li key={step.id}>
              <Reveal delayMs={index * 70} className="h-full">
                <div className="h-full bg-abyss-card/80 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`p-display p-outline text-4xl leading-none ${TONE_TEXT[tone]}`}
                    >
                      {index + 1}
                    </span>
                    <span aria-hidden="true" className={`h-1.5 w-10 -skew-x-[30deg] ${TONE_BG[tone]}`} />
                  </div>
                  <h3 className={`p-display mt-4 text-lg sm:text-xl ${TONE_TEXT[tone]}`}>
                    {step.title[locale]}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-ink">{step.text[locale]}</p>
                  <p className="mt-4 font-mono text-[0.65rem] font-bold uppercase tracking-spec text-ink-muted">
                    {workProcess.evidenceLabel[locale]}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {step.evidence.map((link) => (
                      <li key={link.label.es}>
                        <EvidenceLink link={link} locale={locale} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          )
        })}
      </ol>

      {shot && shotSrc && (
        <Reveal delayMs={120}>
          <Image
            src={shotSrc}
            alt={shot.alt[locale]}
            width={shot.width ?? 1280}
            height={shot.height ?? 577}
            className="mt-12 w-full border-2 border-ink"
            sizes="100vw"
          />
        </Reveal>
      )}
    </Section>
  )
}
