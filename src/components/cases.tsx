import Image from 'next/image'
import type { CSSProperties } from 'react'

import {
  CASE_NAMES,
  casesSection,
  resolved,
  securityCases,
  type Locale,
  type SecurityCase,
} from '@/content'
import { caseHref } from '@/lib/locale'
import { PendingNote } from '@/components/pending'
import { Reveal } from '@/components/reveal'
import {
  Section,
  SectionHeading,
  TONE_BG,
  TONE_HOVER_BORDER,
  TONE_TEXT,
  toneVar,
  type Tone,
} from '@/components/section'
import { ProjectsIcon } from '@/components/icons'

/** RF-110: un tono por caso, en el orden de `securityCases`. */
export const CASE_TONES: readonly Tone[] = ['violet', 'mint', 'green', 'lilac']

/** Insignia de estado: en producción, demo en vivo o repositorio. */
export function StatusBadge({ item, locale }: { item: SecurityCase; locale: Locale }) {
  const tone =
    item.status === 'produccion'
      ? 'text-surface [--slant-bg:#a6f13c]'
      : item.status === 'demo'
        ? 'text-surface [--slant-bg:#5ef0a8]'
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

/** Captura del caso, o su pendiente si no hay archivo confirmado. */
export function CaseScreenshot({
  item,
  locale,
  sizes,
}: {
  item: SecurityCase
  locale: Locale
  sizes: string
}) {
  const src = resolved(item.screenshot.src)
  if (!src) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center border border-dashed border-warn-border bg-warn-surface p-4 text-center">
        <PendingNote value={item.screenshot.src} />
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={item.screenshot.alt[locale]}
      width={item.screenshot.width ?? 1280}
      height={item.screenshot.height ?? 577}
      className="w-full border-2 border-ink"
      sizes={sizes}
    />
  )
}

function CaseCard({ item, index, locale }: { item: SecurityCase; index: number; locale: Locale }) {
  const tone = CASE_TONES[index % CASE_TONES.length]
  const headingId = `caso-${item.slug}`
  const ref = `CASO-${String(index + 1).padStart(2, '0')}`
  // En la tarjeta, solo los títulos de los controles: el porqué y el código
  // están en la página del caso.
  const controls = item.controlGroups.flatMap((group) => group.controls)

  return (
    <div className="p-lift group h-full" style={toneVar(tone)}>
      <article
        aria-labelledby={headingId}
        className="p-notch flex h-full flex-col border-t-4 border-ink bg-surface-card p-5 sm:p-7"
      >
        <div className="group/shot relative">
          <span
            aria-hidden="true"
            className={`absolute inset-0 translate-x-2 translate-y-2 -skew-x-3 ${TONE_BG[tone]}`}
          />
          <div className="relative -rotate-1 transition-transform duration-300 ease-out group-hover/shot:rotate-0">
            <CaseScreenshot item={item} locale={locale} sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>

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
        <p className="mt-4 text-base leading-relaxed text-ink-muted">{item.summary[locale]}</p>

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

/**
 * RF-102 — los cuatro casos de seguridad, en resumen.
 *
 * La tarjeta muestra problema, estado, stack y los controles por nombre; el
 * detalle completo de la plantilla (flujo de datos, amenazas, porqué de cada
 * control con su código, verificación) vive en `/casos/<slug>` (RF-111).
 */
export function Cases({ locale }: { locale: Locale }) {
  return (
    <Section id="casos" labelledBy="casos-title">
      <SectionHeading
        id="casos-title"
        number="02"
        title={casesSection.heading[locale]}
        intro={casesSection.intro[locale]}
        tone="mint"
        icon={<ProjectsIcon />}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {securityCases.map((item, index) => (
          <Reveal key={item.slug} delayMs={(index % 2) * 80} className="h-full">
            <CaseCard item={item} index={index} locale={locale} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
