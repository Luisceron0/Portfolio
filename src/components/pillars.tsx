import { CASE_NAMES, pillars, profile, type Locale, type Pillar } from '@/content'
import { caseHref } from '@/lib/locale'
import { PendingNote } from '@/components/pending'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading, TONE_BG, TONE_TEXT, type Tone } from '@/components/section'
import { Scribble, Staple } from '@/components/zine'
import { ProfileIcon } from '@/components/icons'

/** Un tono por pilar: tres frentes de igual peso, tres colores distintos. */
const PILLAR_TONES: readonly Tone[] = ['magenta', 'cyan', 'ochre']

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
 *
 * En papel (RF-110 v5): el perfil es una carta fotocopiada, grapada, con un
 * garabato en el margen; los pilares son fichas de archivo de cartulina con
 * una franja de cinta del tono arriba y el número sellado.
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
        tone="magenta"
        icon={<ProfileIcon />}
      />

      <Reveal>
        {/* Carta fotocopiada: el perfil, en primera persona implícita. */}
        <div className="relative mt-12 max-w-4xl">
          <div className="m-sheet -rotate-[0.6deg] p-6 sm:p-8">
            <Staple className="-top-1 left-5" />
            <Staple className="-top-1 left-9" />
            <div className="space-y-4">
              {profile.summary[locale].map((paragraph) => (
                <p key={paragraph} className="text-lg leading-relaxed text-tinta">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <Scribble className="absolute -right-6 -top-10 hidden h-16 w-20 md:block" color="#F25CEB" />
        </div>
      </Reveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {items.map((pillar, index) => {
          const tone = PILLAR_TONES[index % PILLAR_TONES.length]
          const headingId = `pilar-${pillar.id}`
          return (
            <Reveal key={pillar.id} delayMs={index * 80}>
              <article aria-labelledby={headingId} className="m-card h-full p-5 pt-7 sm:p-6 sm:pt-8">
                {/* Franja de cinta de color arriba: la pestaña de la ficha. */}
                <span
                  aria-hidden="true"
                  className={`absolute -top-2 left-6 h-4 w-24 -rotate-2 opacity-90 [clip-path:polygon(0_15%,6%_0,94%_10%,100%_0,98%_100%,4%_88%)] ${TONE_BG[tone]}`}
                />
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="m-stamp text-xl [--stamp-r:-6deg]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 id={headingId} className={`p-display text-lg sm:text-xl ${TONE_TEXT[tone]}`}>
                    {pillar.title[locale]}
                  </h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">{pillar.lead[locale]}</p>

                <ul className="mt-5 space-y-4">
                  {pillar.points.map((point) => (
                    <li key={point.label.es} className={`p-bullet ${TONE_TEXT[tone]}`}>
                      <span className="text-base leading-relaxed text-ink">{point.label[locale]}</span>
                      {point.cases.length > 0 && (
                        <span className="p-type mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                          <span>{pillars.evidenceLabel[locale]}:</span>
                          {point.cases.map((slug) => (
                            <a
                              key={slug}
                              href={caseHref(slug, locale)}
                              className="p-link inline-flex min-h-[24px] items-center px-0.5 text-ink"
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
