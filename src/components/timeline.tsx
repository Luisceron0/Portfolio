import { timeline, type Locale, type TimelineEntry } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { TimelineIcon } from '@/components/icons'

/**
 * RF-106 — trayectoria.
 *
 * Una lista ordenada (`<ol>`) y no una serie de `<div>`: para un lector de
 * pantalla, "elemento 2 de 4" es información real sobre una cronología. La
 * línea vertical y los puntos son decorativos y van con `aria-hidden`.
 *
 * Todas las entradas salen del YAML del CV. Ninguna fecha, cargo ni empleador
 * se escribe aquí a mano.
 */
function Entry({
  entry,
  index,
  locale,
}: {
  entry: TimelineEntry
  index: number
  locale: Locale
}) {
  return (
    <li className="group relative pl-8 sm:pl-10">
      {/* Marca cuadrada sobre la línea vertical. Decorativa. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 border border-tone-teal bg-surface transition-colors duration-300 group-hover:bg-tone-teal"
      />

      <Reveal delayMs={index * 70}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest2">
          <span className="border border-hairline-strong px-2.5 py-0.5 font-bold text-ink-muted">
            {timeline.kinds[entry.kind][locale]}
          </span>
          <span className="text-ink-muted">{entry.period[locale]}</span>
        </div>

        <h3 className="mt-3 text-2xl font-bold tracking-tighter sm:text-3xl">
          {entry.title[locale]}
        </h3>

        <p className="mt-1 text-base font-medium text-tone-teal">
          {entry.organization}
          <span className="font-normal text-ink-muted"> · {entry.location[locale]}</span>
        </p>

        <ul className="mt-4 space-y-2">
          {entry.highlights[locale].map((highlight) => (
            <li
              key={highlight}
              className="relative pl-5 text-base leading-relaxed text-ink-muted"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.6em] h-1.5 w-1.5 bg-hairline-strong"
              />
              {highlight}
            </li>
          ))}
        </ul>
      </Reveal>
    </li>
  )
}

export function Timeline({ locale }: { locale: Locale }) {
  return (
    <Section id="trayectoria" labelledBy="trayectoria-title">
      <SectionHeading
        id="trayectoria-title"
        number="02"
        title={timeline.heading[locale]}
        intro={timeline.intro[locale]}
        tone="teal"
        icon={<TimelineIcon />}
      />

      <ol className="relative mt-12 space-y-12 border-l border-hairline">
        {timeline.entries.map((entry, index) => (
          <Entry key={entry.id} entry={entry} index={index} locale={locale} />
        ))}
      </ol>
    </Section>
  )
}
