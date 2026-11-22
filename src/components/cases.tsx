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
import {
  Section,
  SectionHeading,
  TONE_BG,
  TONE_BORDER,
  TONE_HOVER_BORDER,
  TONE_TEXT,
  toneVar,
  type Tone,
} from '@/components/section'
import { ProjectsIcon } from '@/components/icons'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { ProjectFilter } from '@/components/project-filter'
import { FILTER_VALUES, type FilterValue } from '@/lib/project-filter-values'

/** RF-110: un tono por caso, en el orden de `projectCases`. */
export const CASE_TONES: readonly Tone[] = ['violet', 'green', 'mint', 'lilac', 'silver', 'mint', 'green']

/** Insignia de estado: en producción, demo en vivo o repositorio. */
export function StatusBadge({ item, locale }: { item: ProjectCase; locale: Locale }) {
  const tone =
    item.status === 'produccion'
      ? 'text-surface [--slant-bg:#a6f13c]'
      : item.status === 'demo'
        ? 'text-surface [--slant-bg:#5ef0a8]'
        : item.status === 'preproduccion'
          ? 'text-surface [--slant-bg:#d7c4ff]'
          : 'text-surface [--slant-bg:#f5f3fa]'
  return (
    <span
      className={`p-slant inline-block px-3 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-widest2 ${tone}`}
    >
      <span className="sr-only">{casesSection.labels.status[locale]}: </span>
      {casesSection.labels.statuses[item.status][locale]}
    </span>
  )
}

/**
 * Captura del caso, o su pendiente si no hay archivo confirmado. Un caso sin
 * captura (repos privados, datos sensibles) no pinta nada aquí: la ficha usa
 * su diagrama de arquitectura.
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
      <div className="flex aspect-[16/10] w-full items-center justify-center border border-dashed border-warn-border bg-warn-surface p-4 text-center">
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
      className="w-full border-2 border-ink"
      sizes={sizes}
    />
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
      <article
        aria-labelledby={headingId}
        className="p-notch flex h-full flex-col border-t-4 border-ink bg-surface-card p-5 sm:p-7"
      >
        {item.screenshot ? (
          <div className="group/shot relative">
            <span
              aria-hidden="true"
              className={`absolute inset-0 translate-x-2 translate-y-2 -skew-x-3 ${TONE_BG[tone]}`}
            />
            <div className="relative -rotate-1 transition-transform duration-300 ease-out group-hover/shot:rotate-0">
              <CaseScreenshot item={item} locale={locale} sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
          </div>
        ) : item.architecture ? (
          <ArchitectureDiagram
            layers={item.architecture}
            locale={locale}
            tone={tone}
            label={casesSection.labels.architecture[locale]}
            compact
          />
        ) : null}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span aria-hidden="true" className={`p-display p-outline text-3xl leading-none ${TONE_TEXT[tone]}`}>
            {ref}
          </span>
          <StatusBadge item={item} locale={locale} />
        </div>

        <p className={`mt-3 font-mono text-[0.7rem] uppercase tracking-spec ${TONE_TEXT[tone]}`}>
          {item.kicker[locale]}
        </p>
        <h3 id={headingId} className="p-display p-glitch mt-2 text-3xl leading-none sm:text-4xl">
          {CASE_NAMES[item.slug]}
        </h3>
        <ul aria-label={casesSection.labels.categories[locale]} className="mt-3 flex flex-wrap gap-2">
          {item.categories.map((category) => (
            <li
              key={category}
              className={`border-b-2 pb-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-widest2 text-ink ${TONE_BORDER[tone]}`}
            >
              {casesSection.categoryLabels[category][locale]}
            </li>
          ))}
        </ul>

        <p className="mt-5 font-mono text-[0.65rem] font-bold uppercase tracking-spec text-ink-muted">
          {casesSection.labels.outcome[locale]}
        </p>
        <p className="mt-1 text-base leading-relaxed text-ink">{item.outcome[locale]}</p>

        <ul aria-label={casesSection.labels.stack[locale]} className="mt-5 flex flex-wrap gap-2">
          {item.stack.map((tech, techIndex) => (
            <li
              key={tech}
              style={{ '--i': techIndex } as CSSProperties}
              className={`p-chip border border-hairline-strong bg-surface px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-widest2 text-ink-muted ${TONE_HOVER_BORDER[tone]}`}
            >
              {tech}
            </li>
          ))}
        </ul>

        <h4 className="mt-6 font-mono text-[0.65rem] font-bold uppercase tracking-spec text-ink">
          {casesSection.labels.controls[locale]}
        </h4>
        <ul className="mt-3 space-y-2">
          {controls.map((control) => (
            <li key={control.title.es} className="relative pl-5 text-sm leading-relaxed text-ink">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[0.55em] h-2 w-2 -skew-x-[20deg] ${TONE_BG[tone]}`}
              />
              {control.title[locale]}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-7">
          <a
            href={caseHref(item.slug, locale)}
            className="p-slant p-btn p-btn--primary p-display inline-flex min-h-[48px] items-center px-6 py-2.5 text-sm tracking-wide text-ink"
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
        tone="mint"
        icon={<ProjectsIcon />}
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
