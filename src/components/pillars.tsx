import { CASE_NAMES, pillars, profile, type Locale, type Pillar } from '@/content'
import { caseHref } from '@/lib/locale'
import { PendingNote } from '@/components/pending'
import { Reveal } from '@/components/reveal'
import {
  Section,
  SectionHeading,
  TONE_BG,
  TONE_BORDER,
  TONE_TEXT,
  type Tone,
} from '@/components/section'
import { ProfileIcon } from '@/components/icons'

/** Un tono por pilar: tres frentes de igual peso, tres colores distintos. */
const PILLAR_TONES: readonly Tone[] = ['violet', 'green', 'mint']

/**
 * "Qué hago" (SRS v1.4): el perfil y los tres pilares de igual peso.
 *
 * Abre con el resumen del perfil (ver la nota de TONO en `profile.summary`) y
 * sigue con los pilares. Cada punto enlaza a los proyectos que lo
 * demuestran: así el desarrollo queda como evidencia de la seguridad y no
 * como una lista de habilidades suelta. Un punto sin caso que lo respalde
 * muestra su `[PENDIENTE]`, nunca un enlace vacío.
 *
 * Las tres tarjetas tienen la misma anchura y la misma estructura a propósito:
 * ninguno de los tres frentes va por encima de los otros.
 */
export function Pillars({ locale }: { locale: Locale }) {
  // Tipo ancho: `satisfies` en content.ts conserva el literal de cada punto, y
  // solo algunos llevan `pending`.
  const items: readonly Pillar[] = pillars.items

  return (
    <Section id="seguridad" labelledBy="seguridad-title">
      <SectionHeading
        id="seguridad-title"
        number="01"
        title={pillars.heading[locale]}
        tone="violet"
        icon={<ProfileIcon />}
      />

      <Reveal>
        {/* Panel de diálogo de P5R: el perfil, en primera persona implícita. */}
        <div className="relative mt-12 max-w-4xl border-2 border-ink bg-surface p-6 shadow-[8px_8px_0_#7a1fff] sm:p-8">
          <span
            aria-hidden="true"
            className="absolute -left-3 -top-3 h-6 w-14 -skew-x-[20deg] bg-violet"
          />
          <div className="space-y-4">
            {profile.summary[locale].map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-ink">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {items.map((pillar, index) => {
          const tone = PILLAR_TONES[index % PILLAR_TONES.length]
          const headingId = `pilar-${pillar.id}`
          return (
            <Reveal key={pillar.id} delayMs={index * 80}>
              <article
                aria-labelledby={headingId}
                className={`h-full border-t-4 bg-surface-card/90 p-5 sm:p-6 ${TONE_BORDER[tone]}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`p-display p-outline text-3xl leading-none ${TONE_TEXT[tone]}`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 id={headingId} className={`p-display text-lg sm:text-xl ${TONE_TEXT[tone]}`}>
                    {pillar.title[locale]}
                  </h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">{pillar.lead[locale]}</p>

                <ul className="mt-5 space-y-4">
                  {pillar.points.map((point) => (
                    <li key={point.label.es} className="relative pl-5">
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-[0.55em] h-2 w-2 -skew-x-[20deg] ${TONE_BG[tone]}`}
                      />
                      <span className="text-base leading-relaxed text-ink">{point.label[locale]}</span>
                      {point.cases.length > 0 && (
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest2 text-ink-muted">
                          <span>{pillars.evidenceLabel[locale]}:</span>
                          {point.cases.map((slug) => (
                            <a
                              key={slug}
                              href={caseHref(slug, locale)}
                              className="inline-flex min-h-[24px] items-center text-ink underline decoration-2 underline-offset-4 hover:text-tone-green"
                            >
                              {CASE_NAMES[slug]}
                            </a>
                          ))}
                        </span>
                      )}
                      {point.pending && (
                        <span className="mt-2 block">
                          <PendingNote value={point.pending} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
