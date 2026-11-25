import Image from 'next/image'
import type { CSSProperties } from 'react'

import {
  CASE_NAMES,
  casesSection,
  resolved,
  projectCases,
  type Locale,
  type ProjectCase,
} from '@/content'
import { caseHref } from '@/lib/locale'
import { PendingNote } from '@/components/pending'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading, TONE_TEXT, toneVar, type Tone } from '@/components/section'
import { BrushStroke, Tape } from '@/components/zine'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { ProjectFilter } from '@/components/project-filter'
import { FILTER_VALUES, type FilterValue } from '@/lib/project-filter-values'

/** RF-110 v5: un tono de material por caso, en el orden de `projectCases`. */
export const CASE_TONES: readonly Tone[] = ['magenta', 'cyan', 'pink', 'ochre', 'lilac', 'cyan', 'magenta']

/**
 * Estado del proyecto: "en producción" es un sello de goma; el resto, una
 * etiqueta Dymo (demo en magenta, preproducción con borde, repositorio en
 * tinta). Todo va sobre cartulina negra.
 */
export function StatusBadge({ item, locale }: { item: ProjectCase; locale: Locale }) {
  const label = (
    <>
      <span className="sr-only">{casesSection.labels.status[locale]}: </span>
      {casesSection.labels.statuses[item.status][locale]}
    </>
  )
  if (item.status === 'produccion') {
    return <span className="m-stamp text-xs [--stamp-r:-5deg]">{label}</span>
  }
  const variant =
    item.status === 'demo' ? 'm-dymo--magenta' : item.status === 'preproduccion' ? 'm-dymo--edge' : ''
  return <span className={`m-dymo text-[0.65rem] ${variant}`}>{label}</span>
}

/**
 * Captura del caso, o su pendiente si no hay archivo confirmado. Un caso sin
 * captura (repos privados, datos sensibles) no pinta nada aquí: la ficha usa
 * su diagrama de arquitectura. El marco de foto lo pone quien la usa.
 */
export function CaseScreenshot({
  item,
  locale,
  sizes,
}: {
  item: ProjectCase
  locale: Locale
  sizes: string
}) {
  const shot = item.screenshot
  if (!shot) return null
  const src = resolved(shot.src)
  if (!src) {
    return (
      <div className="m-panel flex aspect-[16/10] w-full items-center justify-center p-4 text-center">
        <PendingNote value={shot.src} />
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={shot.alt[locale]}
      width={shot.width ?? 1280}
      height={shot.height ?? 577}
      className="w-full"
      sizes={sizes}
    />
  )
}

/** Foto pegada con dos cintas; se endereza al pasar por la tarjeta. */
export function CasePhoto({
  item,
  locale,
  sizes,
  tilt = -1.2,
}: {
  item: ProjectCase
  locale: Locale
  sizes: string
  tilt?: number
}) {
  return (
    <div className="relative" style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
      <div className="m-photo">
        <div className="p-wipe">
          <CaseScreenshot item={item} locale={locale} sizes={sizes} />
        </div>
      </div>
      <Tape className="-top-3 left-6" rotate={-8} />
      <Tape className="-top-3 right-6" rotate={7} />
    </div>
  )
}

function CaseCard({ item, index, locale }: { item: ProjectCase; index: number; locale: Locale }) {
  const tone = CASE_TONES[index % CASE_TONES.length]
  const headingId = `caso-${item.slug}`
  const ref = `PRY-${String(index + 1).padStart(2, '0')}`
  // En la tarjeta, solo los títulos de los tres primeros controles: el resto,
  // el porqué y el código están en la página del caso.
  const controls = item.controlGroups.flatMap((group) => group.controls).slice(0, 3)

  return (
    <div className="p-lift group h-full" style={toneVar(tone)}>
      <article aria-labelledby={headingId} className="m-card flex h-full flex-col p-5 sm:p-7">
        {item.screenshot ? (
          <CasePhoto item={item} locale={locale} sizes="(min-width: 1024px) 45vw, 100vw" tilt={index % 2 ? 1.2 : -1.2} />
        ) : item.architecture ? (
          <ArchitectureDiagram
            layers={item.architecture}
            locale={locale}
            tone={tone}
            label={casesSection.labels.architecture[locale]}
            compact
          />
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span aria-hidden="true" className="m-stamp text-xl">
            {ref}
          </span>
          <StatusBadge item={item} locale={locale} />
        </div>

        <p className="p-type mt-4 text-xs text-ink-muted">{item.kicker[locale]}</p>
        <h3 id={headingId} className="p-display relative mt-2 inline-block self-start text-3xl leading-none text-paper sm:text-4xl">
          <span className="relative">{CASE_NAMES[item.slug]}</span>
          <BrushStroke className="p-swipe-under absolute -bottom-2 left-0 h-3 w-full" color="#D903D5" />
        </h3>
        <ul aria-label={casesSection.labels.categories[locale]} className="mt-4 flex flex-wrap gap-2">
          {item.categories.map((category) => (
            <li key={category} className="m-dymo m-dymo--magenta text-[0.62rem]">
              {casesSection.categoryLabels[category][locale]}
            </li>
          ))}
        </ul>

        <p className="p-type mt-5 text-xs text-ink-muted">{casesSection.labels.outcome[locale]}</p>
        <p className="mt-1 text-base leading-relaxed text-ink">{item.outcome[locale]}</p>

        <ul aria-label={casesSection.labels.stack[locale]} className="mt-5 flex flex-wrap gap-2">
          {item.stack.map((tech, techIndex) => (
            <li
              key={tech}
              style={{ '--i': techIndex } as CSSProperties}
              className="p-chip m-dymo m-dymo--edge text-[0.62rem]"
            >
              {tech}
            </li>
          ))}
        </ul>

        <h4 className="p-type mt-6 text-xs font-bold text-ink">{casesSection.labels.controls[locale]}</h4>
        <ul className="mt-3 space-y-2">
          {controls.map((control) => (
            <li key={control.title.es} className={`p-bullet p-bullet--check text-sm leading-relaxed ${TONE_TEXT[tone]}`}>
              <span className="text-ink">{control.title[locale]}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <a
            href={caseHref(item.slug, locale)}
            className="p-btn inline-flex min-h-[48px] items-center px-6 py-2.5 text-sm font-extrabold uppercase tracking-dymo"
          >
            {casesSection.labels.readCase[locale]}
            <span className="sr-only">: {CASE_NAMES[item.slug]}</span>
          </a>
        </div>
      </article>
    </div>
  )
}

/** Orden de los estados dentro de cada filtro, después de los destacados. */
const STATUS_ORDER: Record<ProjectCase['status'], number> = {
  produccion: 0,
  preproduccion: 1,
  repositorio: 2,
  demo: 3,
}

/**
 * Orden de la lista: destacados primero (en el orden de content.ts) y luego por
 * estado. Como cada filtro solo oculta tarjetas, todos conservan este orden.
 */
export function orderedProjects(): readonly ProjectCase[] {
  return [...projectCases].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
    if (a.featured) return 0
    return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
  })
}

/**
 * RF-102 — Proyectos (portafolio v2): todos en resumen, con filtros por
 * categoría. La tarjeta muestra estado, categorías, "qué logra", stack y los
 * primeros controles; la plantilla completa vive en `/casos/<slug>` (RF-111).
 *
 * El conteo de la intro sale de `projectCases.length`, nunca de un texto fijo.
 */
export function Cases({ locale }: { locale: Locale }) {
  const items = orderedProjects()
  const labels = casesSection.filters
  const counts: Record<FilterValue, number> = {
    destacados: items.filter((item) => item.featured).length,
    seguridad: items.filter((item) => item.categories.includes('seguridad')).length,
    desarrollo: items.filter((item) => item.categories.includes('desarrollo')).length,
    pruebas: items.filter((item) => item.categories.includes('pruebas')).length,
  }

  return (
    <Section id="casos" labelledBy="casos-title">
      <SectionHeading
        id="casos-title"
        number="02"
        title={casesSection.heading[locale]}
        intro={`${casesSection.count[locale](projectCases.length)} ${casesSection.intro[locale]}`}
        tone="cyan"
      />

      <ProjectFilter
        label={labels.label[locale]}
        options={FILTER_VALUES.map((value) => ({ value, label: labels[value][locale] }))}
        counts={counts}
        announce={labels.announce[locale]}
      >
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={item.slug}
              data-project={item.slug}
              data-categories={item.categories.join(' ')}
              data-featured={item.featured ? 'true' : 'false'}
              className="h-full"
            >
              <Reveal delayMs={(index % 2) * 80} className="h-full">
                <CaseCard item={item} index={index} locale={locale} />
              </Reveal>
            </div>
          ))}
        </div>
      </ProjectFilter>
    </Section>
  )
}
