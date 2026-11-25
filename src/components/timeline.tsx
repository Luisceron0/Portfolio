import { timeline, type Locale, type TimelineEntry } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { Pushpin } from '@/components/zine'

/**
 * RF-106 — experiencia (solo trabajo; la formación tiene su propia sección),
 * en fichas de cartulina clavadas con chincheta (RF-110 v5).
 *
 * Una lista ordenada (`<ol>`) y no una serie de `<div>`: para un lector de
 * pantalla, "elemento 2 de 4" es información real sobre una cronología. La
 * línea de rotulador y las chinchetas son decorativas (`aria-hidden`).
 *
 * Todas las entradas salen del CV. Ninguna fecha, cargo ni empleador se
 * escribe aquí a mano.
 */
function Entry({ entry, locale }: { entry: TimelineEntry; locale: Locale }) {
  return (
    <li className="group relative pl-10 sm:pl-14">
      {/* Chincheta sobre la línea: gira al pasar el ratón (mismo gesto). */}
      <Pushpin className="absolute left-0 top-4 h-7 w-7 -translate-x-1/2 transition-transform duration-300 group-hover:rotate-[135deg]" />

      <Reveal>
        {/*
          LOAD DATA de P3R, en papel: al pasar el ratón, una fotocopia entra
          desde la izquierda (`scaleX`) por detrás del texto y cada color pasa a
          su par sobre papel: tinta, tinta.muted y magenta.deep (check:contrast).
        */}
        <article className="m-card relative p-5 transition-transform duration-300 ease-out group-hover:translate-x-2 sm:p-7">
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-paper transition-transform duration-300 ease-out [clip-path:var(--cut)] group-hover:scale-x-100"
          />
          <div className="relative">
            <span className="m-stamp text-sm group-hover:text-magenta-deep sm:text-base">{entry.period[locale]}</span>

            <h3 className="mt-4 text-xl font-extrabold leading-snug tracking-tight transition-colors duration-200 group-hover:text-tinta sm:text-2xl">
              {entry.title[locale]}
            </h3>

            <p className="mt-1.5 text-base font-bold text-magenta-text transition-colors duration-200 group-hover:text-magenta-deep">
              {entry.organization}
              <span className="font-normal text-ink-muted transition-colors duration-200 group-hover:text-tinta-muted">
                {' '}
                · {entry.location[locale]}
              </span>
            </p>

            <ul className="mt-4 space-y-2">
              {entry.highlights[locale].map((highlight) => (
                <li
                  key={highlight}
                  className="p-bullet text-base leading-relaxed text-ink-muted transition-colors duration-200 [--bullet:#F25CEB] group-hover:text-tinta-muted group-hover:[--bullet:#A8009F]"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </Reveal>
    </li>
  )
}

export function Timeline({ locale }: { locale: Locale }) {
  return (
    <Section id="experiencia" labelledBy="experiencia-title">
      <SectionHeading
        id="experiencia-title"
        number="04"
        title={timeline.heading[locale]}
        intro={timeline.intro[locale]}
        tone="pink"
      />

      <div className="relative mt-12">
        <span aria-hidden="true" className="p-timeline-line pointer-events-none absolute inset-y-0 left-0 w-2 -translate-x-1/2" />
        <ol className="space-y-10">
          {timeline.entries.map((entry) => (
            <Entry key={entry.id} entry={entry} locale={locale} />
          ))}
        </ol>
      </div>
    </Section>
  )
}
