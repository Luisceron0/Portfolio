import type { ReactNode } from 'react'

import { CASE_NAMES, casesSection, type Locale, type SecurityCase } from '@/content'
import { homeAnchor } from '@/lib/locale'
import { CASE_TONES, CaseScreenshot, StatusBadge } from '@/components/cases'
import { EvidenceLink } from '@/components/evidence-link'
import { PendingNote } from '@/components/pending'
import { TONE_BG, TONE_BORDER, TONE_TEXT, type Tone } from '@/components/section'

/** Bloque de la plantilla: un H2 con su regla de color y el contenido. */
function Block({
  id,
  title,
  tone,
  children,
}: {
  id: string
  title: string
  tone: Tone
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="flex items-center gap-3">
        <span aria-hidden="true" className={`h-1.5 w-10 -skew-x-[30deg] ${TONE_BG[tone]}`} />
        <span className="p-display text-2xl leading-none sm:text-3xl">{title}</span>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/** Lista de enlaces de evidencia bajo un control o una verificación. */
function EvidenceList({
  links,
  locale,
  label,
}: {
  links: SecurityCase['verification'][number]['evidence']
  locale: Locale
  label: string
}) {
  return (
    <ul aria-label={label} className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => (
        <li key={`${link.label.es}-${typeof link.href === 'string' ? link.href : link.href.es}`}>
          <EvidenceLink link={link} locale={locale} />
        </li>
      ))}
    </ul>
  )
}

/**
 * RF-111 — detalle de un caso de seguridad, con la plantilla fija de la SRS
 * v1.4: problema, stack y estado; flujo de datos y activos; amenazas; controles
 * y porqué, con su código; cómo se verificó; enlaces.
 *
 * Un único H1 (el nombre del caso) y un H2 por bloque de la plantilla. En KOA
 * los controles van en dos grupos con H3 propio; en los demás, cada control es
 * un H3.
 */
export function CaseDetail({
  item,
  index,
  locale,
}: {
  item: SecurityCase
  index: number
  locale: Locale
}) {
  const tone = CASE_TONES[index % CASE_TONES.length]
  const labels = casesSection.labels
  const name = CASE_NAMES[item.slug]

  return (
    <article aria-labelledby="caso-title" className="mx-auto max-w-content px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
      <a
        href={homeAnchor('#casos', locale, false)}
        className="inline-flex min-h-[44px] items-center font-mono text-xs font-bold uppercase tracking-widest2 text-ink underline decoration-2 underline-offset-4 hover:text-tone-green"
      >
        ← {labels.backToCases[locale]}
      </a>

      <header className="mt-6 grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className={`font-mono text-[0.72rem] uppercase tracking-spec ${TONE_TEXT[tone]}`}>
            {item.kicker[locale]}
          </p>
          <h1 id="caso-title" className="p-display mt-3 text-5xl leading-none sm:text-7xl">
            {name}
          </h1>

          <dl className="mt-8 space-y-5">
            <div className={`border-l-4 pl-4 ${TONE_BORDER[tone]}`}>
              <dt className="font-mono text-[0.65rem] font-bold uppercase tracking-spec text-ink-muted">
                {labels.problem[locale]}
              </dt>
              <dd className="mt-1 text-lg leading-relaxed text-ink">{item.problem[locale]}</dd>
            </div>
            <div className={`border-l-4 pl-4 ${TONE_BORDER[tone]}`}>
              <dt className="font-mono text-[0.65rem] font-bold uppercase tracking-spec text-ink-muted">
                {labels.stack[locale]}
              </dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <li
                      key={tech}
                      className="border border-hairline-strong bg-surface px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-widest2 text-ink-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className={`border-l-4 pl-4 ${TONE_BORDER[tone]}`}>
              <dt className="font-mono text-[0.65rem] font-bold uppercase tracking-spec text-ink-muted">
                {labels.status[locale]}
              </dt>
              <dd className="mt-2">
                <StatusBadge item={item} locale={locale} />
              </dd>
            </div>
          </dl>
        </div>

        <CaseScreenshot item={item} locale={locale} sizes="(min-width: 1024px) 40vw, 100vw" />
      </header>

      <Block id="flujo" title={labels.dataFlow[locale]} tone={tone}>
        <p className="max-w-4xl font-mono text-sm leading-relaxed text-ink">{item.dataFlow[locale]}</p>
        <h3 className="mt-8 font-mono text-[0.7rem] font-bold uppercase tracking-spec text-ink-muted">
          {labels.assets[locale]}
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {item.assets[locale].map((asset) => (
            <li key={asset} className="relative pl-5 text-base leading-relaxed text-ink">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[0.55em] h-2 w-2 -skew-x-[20deg] ${TONE_BG[tone]}`}
              />
              {asset}
            </li>
          ))}
        </ul>
      </Block>

      <Block id="amenazas" title={labels.threats[locale]} tone={tone}>
        <ol className="space-y-3">
          {item.threats.map((threat) => (
            <li
              key={threat.text.es}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-hairline pb-3"
            >
              {threat.ref && (
                <span className={`font-mono text-xs font-bold ${TONE_TEXT[tone]}`}>{threat.ref}</span>
              )}
              <span className="text-base leading-relaxed text-ink">{threat.text[locale]}</span>
              {threat.stride && (
                <span className="border border-hairline-strong px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest2 text-ink-muted">
                  STRIDE: {threat.stride}
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <span>{labels.threatModelSource[locale]}:</span>
          <EvidenceLink link={item.threatModel} locale={locale} />
        </p>
        {item.strideNote && (
          <p className="mt-3">
            <PendingNote value={item.strideNote} />
          </p>
        )}
      </Block>

      <Block id="controles" title={labels.controls[locale]} tone={tone}>
        <div className="space-y-10">
          {item.controlGroups.map((group) => {
            const ControlHeading = group.heading ? 'h4' : 'h3'
            return (
              <div key={group.heading?.es ?? 'controles'}>
                {group.heading && (
                  <h3 className={`p-display text-xl sm:text-2xl ${TONE_TEXT[tone]}`}>
                    {group.heading[locale]}
                  </h3>
                )}
                <ul className={`grid gap-5 md:grid-cols-2 ${group.heading ? 'mt-5' : ''}`}>
                  {group.controls.map((control) => (
                    <li key={control.title.es} className={`border-t-4 bg-surface-card/90 p-5 ${TONE_BORDER[tone]}`}>
                      <ControlHeading className="text-lg font-bold leading-snug text-ink">
                        {control.title[locale]}
                      </ControlHeading>
                      <p className="mt-2 text-base leading-relaxed text-ink-muted">{control.why[locale]}</p>
                      <EvidenceList links={control.evidence} locale={locale} label={labels.evidence[locale]} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Block>

      <Block id="verificacion" title={labels.verification[locale]} tone={tone}>
        <ul className="space-y-6">
          {item.verification.map((check) => (
            <li key={check.text.es} className={`border-l-4 pl-4 ${TONE_BORDER[tone]}`}>
              <p className="text-base leading-relaxed text-ink">{check.text[locale]}</p>
              <EvidenceList links={check.evidence} locale={locale} label={labels.evidence[locale]} />
            </li>
          ))}
        </ul>
      </Block>

      <Block id="enlaces" title={labels.links[locale]} tone={tone}>
        <EvidenceList links={item.links} locale={locale} label={labels.links[locale]} />
      </Block>
    </article>
  )
}
