import { timeline, type Locale, type TimelineEntry } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { TimelineIcon } from '@/components/icons'

/**
 * RF-106 — trayectoria.
 *
 * Una lista ordenada (`<ol>`) y no una serie de `<div>`: para un lector de
 * pantalla, "elemento 2 de 4" es información real sobre una cronología. La
 * línea vertical y los rombos son decorativos y van con `aria-hidden`.
 *
 * Vive sobre la banda abismo: el periodo va arriba, en una pestaña
 * inclinada, como la fecha del calendario del juego, que es lo que marca el
 * paso del tiempo. Trabajo y estudio se distinguen por color Y por la
 * etiqueta escrita, nunca solo por color.
 *
 * Todas las entradas salen del YAML del CV. Ninguna fecha, cargo ni empleador
 * se escribe aquí a mano.
 */
function Entry({ entry, locale }: { entry: TimelineEntry; locale: Locale }) {
  const isWork = entry.kind === 'trabajo'

  return (
    <li className="group relative pl-8 sm:pl-12">
      {/* Rombo sobre la línea vertical: se rellena y gira al pasar el ratón. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-3 h-4 w-4 -translate-x-1/2 rotate-45 border-2 border-tone-green bg-abyss transition-all duration-300 group-hover:rotate-[135deg] group-hover:bg-tone-green"
      />

      {/* Sin retardo escalonado: las entradas están apiladas en vertical y
          cada una aparece sola al llegar a ella. Un retardo por índice solo
          hacía esperar más a las de abajo (la 8ª, 420ms sin motivo). */}
      <Reveal>
        {/*
          Al pasar el ratón, la entrada se INVIERTE a blanco, como el slot
          elegido en la pantalla LOAD DATA de P3R: un panel blanco entra desde
          la izquierda por detrás del texto y cada color pasa a su par oscuro
          (medidos en `check:contrast` como "sobre ink").
        */}
        <article className="relative isolate border-l-4 border-tone-green/0 bg-abyss-card/70 p-5 transition-all duration-300 ease-out group-hover:translate-x-2 group-hover:border-violet sm:p-7">
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 origin-left scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100"
          />
          <div className="flex flex-wrap items-center gap-3">
            <span className="p-slant p-display px-3.5 py-1 text-sm text-surface [--slant-bg:#a6f13c] sm:text-base">
              {entry.period[locale]}
            </span>
            <span
              className={`p-slant px-2.5 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-widest2 ${
                isWork ? 'text-ink [--slant-bg:#7a1fff]' : 'text-surface [--slant-bg:#d7c4ff]'
              }`}
            >
              {timeline.kinds[entry.kind][locale]}
            </span>
          </div>

          <h3 className="p-display mt-4 text-2xl leading-tight transition-colors duration-200 group-hover:text-surface sm:text-3xl">
            {entry.title[locale]}
          </h3>

          <p className="mt-1.5 text-base font-bold text-tone-green transition-colors duration-200 group-hover:text-violet">
            {entry.organization}
            <span className="font-normal text-ink-muted transition-colors duration-200 group-hover:text-ink-dim">
              {' '}
              · {entry.location[locale]}
            </span>
          </p>

          <ul className="mt-4 space-y-2">
            {entry.highlights[locale].map((highlight) => (
              <li
                key={highlight}
                className="relative pl-5 text-base leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink-dim"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.55em] h-2 w-2 -skew-x-[20deg] bg-tone-green transition-colors duration-200 group-hover:bg-violet"
                />
                {highlight}
              </li>
            ))}
          </ul>
        </article>
      </Reveal>
    </li>
  )
}

export function Timeline({ locale }: { locale: Locale }) {
  return (
    <Section
      id="trayectoria"
      labelledBy="trayectoria-title"
      band="abyss"
      watermark={timeline.heading[locale]}
    >
      <SectionHeading
        id="trayectoria-title"
        number="02"
        title={timeline.heading[locale]}
        intro={timeline.intro[locale]}
        tone="green"
        icon={<TimelineIcon />}
      />

      <ol className="relative mt-12 space-y-8 border-l-2 border-tone-green/40">
        {timeline.entries.map((entry) => (
          <Entry key={entry.id} entry={entry} locale={locale} />
        ))}
      </ol>
    </Section>
  )
}
