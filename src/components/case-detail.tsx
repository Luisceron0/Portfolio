import type { ReactNode } from 'react'

import {
  CASE_NAMES,
  casesSection,
  type CaseControl,
  type CaseControlGroup,
  type Locale,
  type ProjectCase,
} from '@/content'

/** Controles a la vista en la página del caso; el resto va plegado. */
const VISIBLE_CONTROLS = 5
import { homeAnchor } from '@/lib/locale'
import { CASE_TONES, CasePhoto, StatusBadge } from '@/components/cases'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { EvidenceLink } from '@/components/evidence-link'
import { TONE_TEXT, type Tone } from '@/components/section'
import { ArrowDoodle, BrushStroke } from '@/components/zine'

/** Bloque de la plantilla: un H2 a rotulador con su brochazo y el contenido. */
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
    <section aria-labelledby={id} className="mt-16">
      <h2 id={id} className="flex items-center gap-3">
        <BrushStroke className={`h-3 w-12 shrink-0 ${TONE_TEXT[tone]}`} color="currentColor" />
        <span className="p-display text-2xl leading-none text-paper sm:text-3xl">{title}</span>
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
  links: ProjectCase['verification'][number]['evidence']
  locale: Locale
  label: string
}) {
  // Repos privados: un control sin enlaces no pinta una lista vacía.
  if (links.length === 0) return null
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
  item: ProjectCase
  index: number
  locale: Locale
}) {
  const tone = CASE_TONES[index % CASE_TONES.length]
  const labels = casesSection.labels
  const name = CASE_NAMES[item.slug]

  // Reparte los controles: los VISIBLE_CONTROLS primeros (en orden, por grupo)
  // quedan a la vista y el resto pasa al <details>.
  let shown = 0
  const visibleGroups: { heading?: CaseControlGroup['heading']; controls: CaseControl[] }[] = []
  const hiddenControls: { control: CaseControl; heading: 'h3' | 'h4' }[] = []
  for (const group of item.controlGroups) {
    const visible: CaseControl[] = []
    for (const control of group.controls) {
      if (shown < VISIBLE_CONTROLS) {
        visible.push(control)
        shown += 1
      } else {
        hiddenControls.push({ control, heading: group.heading ? 'h4' : 'h3' })
      }
    }
    if (visible.length > 0) visibleGroups.push({ heading: group.heading, controls: visible })
  }

  function ControlCard({ control, heading: Heading }: { control: CaseControl; heading: 'h3' | 'h4' }) {
    return (
      <li className="m-card p-5 sm:p-6">
        <Heading className="text-lg font-bold leading-snug text-ink">{control.title[locale]}</Heading>
        <p className="mt-2 text-base leading-relaxed text-ink-muted">{control.why[locale]}</p>
        <EvidenceList links={control.evidence} locale={locale} label={labels.evidence[locale]} />
      </li>
    )
  }

  return (
    <article aria-labelledby="caso-title" className="mx-auto max-w-content px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
      <a
        href={homeAnchor('#casos', locale, false)}
        className="p-type group inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-ink"
      >
        <ArrowDoodle direction="left" className="h-6 w-5 text-magenta-text" />
        <span className="p-link px-0.5">{labels.backToCases[locale]}</span>
      </a>

      <header className="mt-6 grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="p-type text-sm text-ink-muted">{item.kicker[locale]}</p>
          <h1 id="caso-title" className="p-display mt-3 text-5xl leading-none text-paper sm:text-7xl">
            {name}
          </h1>

          {/* Hoja de cuaderno: margen magenta, dt mecanografiado, dd en cuerpo. */}
          <dl className="m-sheet mt-8 space-y-4 px-5 py-5 sm:px-6">
            {/*
              Bloque inicial de tres líneas (portafolio v2): problema, qué
              construí y resultado. La plantilla completa va debajo para quien
              quiera profundidad.
            */}
            {(
              [
                [labels.problem, item.problem],
                [labels.built, item.built],
                [labels.outcome, item.outcome],
              ] as const
            ).map(([label, text]) => (
              <div key={label.es}>
                <dt className="p-type text-xs font-bold text-tinta-muted">{label[locale]}</dt>
                <dd className="mt-1 text-lg leading-relaxed text-tinta">{text[locale]}</dd>
              </div>
            ))}
          </dl>

          {/* Stack y estado, sobre la cartulina: el sello magenta no llega al
              contraste sobre papel. */}
          <dl className="mt-8 space-y-5">
            <div>
              <dt className="p-type text-xs font-bold text-ink-muted">{labels.stack[locale]}</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <li key={tech} className="m-dymo m-dymo--edge text-[0.62rem]">
                      {tech}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="p-type text-xs font-bold text-ink-muted">{labels.status[locale]}</dt>
              <dd className="mt-2">
                <StatusBadge item={item} locale={locale} />
              </dd>
            </div>
          </dl>
        </div>

        {item.screenshot ? (
          <CasePhoto item={item} locale={locale} sizes="(min-width: 1024px) 40vw, 100vw" tilt={1.4} />
        ) : item.architecture ? (
          <ArchitectureDiagram
            layers={item.architecture}
            locale={locale}
            tone={tone}
            label={labels.architecture[locale]}
            compact
          />
        ) : null}
      </header>

      {item.privateRepo && (
        <p role="note" className="m-panel mt-10 max-w-3xl px-4 py-3 text-sm font-medium leading-relaxed">
          {labels.privateRepo[locale]}
        </p>
      )}

      <Block id="flujo" title={labels.dataFlow[locale]} tone={tone}>
        <p className="p-type m-sheet max-w-4xl -rotate-[0.4deg] px-5 py-4 text-sm leading-relaxed">{item.dataFlow[locale]}</p>
        <h3 className="p-type mt-10 text-xs font-bold text-ink-muted">{labels.assets[locale]}</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {item.assets[locale].map((asset) => (
            <li key={asset} className={`p-bullet text-base leading-relaxed ${TONE_TEXT[tone]}`}>
              <span className="text-ink">{asset}</span>
            </li>
          ))}
        </ul>
      </Block>

      {item.architecture && (
        <Block id="arquitectura" title={labels.architecture[locale]} tone={tone}>
          <p className="mb-4 text-sm text-ink-muted">{labels.architectureNote[locale]}</p>
          <div className="max-w-3xl">
            <ArchitectureDiagram
              layers={item.architecture}
              locale={locale}
              tone={tone}
              label={labels.architecture[locale]}
            />
          </div>
        </Block>
      )}

      <Block id="amenazas" title={(item.threatsHeading ?? labels.threats)[locale]} tone={tone}>
        <ol className="space-y-4">
          {item.threats.map((threat) => (
            <li
              key={threat.text.es}
              className="flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              {threat.ref && <span className="m-stamp text-xs [--stamp-r:-4deg]">{threat.ref}</span>}
              <span className="text-base leading-relaxed text-ink">{threat.text[locale]}</span>
              {threat.stride && <span className="m-dymo m-dymo--edge text-[0.6rem]">STRIDE: {threat.stride}</span>}
            </li>
          ))}
        </ol>
        <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <span>{labels.threatModelSource[locale]}:</span>
          {item.threatModel ? (
            <EvidenceLink link={item.threatModel} locale={locale} />
          ) : (
            <span>{item.threatNote?.[locale]}</span>
          )}
        </p>
      </Block>

      <Block id="controles" title={labels.controls[locale]} tone={tone}>
        {/*
          Máximo VISIBLE_CONTROLS a la vista; el resto, plegado en un
          <details> nativo (sin JavaScript, accesible con teclado).
        */}
        <div className="space-y-10">
          {visibleGroups.map((group) => {
            const ControlHeading = group.heading ? 'h4' : 'h3'
            return (
              <div key={group.heading?.es ?? 'controles'}>
                {group.heading && (
                  <h3 className="p-display text-xl text-magenta-text sm:text-2xl">
                    {group.heading[locale]}
                  </h3>
                )}
                <ul className={`grid gap-7 md:grid-cols-2 ${group.heading ? 'mt-5' : ''}`}>
                  {group.controls.map((control) => (
                    <ControlCard key={control.title.es} control={control} heading={ControlHeading} />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        {hiddenControls.length > 0 && (
          <details className="mt-8">
            <summary className="p-type inline-flex min-h-[44px] cursor-pointer items-center text-sm font-bold text-ink">
              <span className="p-link px-0.5">{labels.moreControls[locale](hiddenControls.length)}</span>
            </summary>
            <ul className="mt-6 grid gap-7 md:grid-cols-2">
              {hiddenControls.map(({ control, heading }) => (
                <ControlCard key={control.title.es} control={control} heading={heading} />
              ))}
            </ul>
          </details>
        )}
      </Block>

      <Block id="verificacion" title={labels.verification[locale]} tone={tone}>
        <ul className="space-y-6">
          {item.verification.map((check) => (
            <li key={check.text.es} className={`p-bullet p-bullet--check ${TONE_TEXT[tone]}`}>
              <p className="text-base leading-relaxed text-ink">{check.text[locale]}</p>
              <EvidenceList links={check.evidence} locale={locale} label={labels.evidence[locale]} />
            </li>
          ))}
        </ul>
      </Block>

      {item.openItems && (
        <Block id="abierto" title={labels.openItems[locale]} tone={tone}>
          <ul className="space-y-3">
            {item.openItems[locale].map((entry) => (
              <li key={entry} className={`p-bullet text-base leading-relaxed ${TONE_TEXT[tone]}`}>
                <span className="text-ink">{entry}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {item.role && (
        <Block id="rol" title={labels.role[locale]} tone={tone}>
          <p className="max-w-4xl text-lg leading-relaxed text-ink">{item.role[locale]}</p>
        </Block>
      )}

      {item.links.length > 0 && (
        <Block id="enlaces" title={labels.links[locale]} tone={tone}>
          <EvidenceList links={item.links} locale={locale} label={labels.links[locale]} />
        </Block>
      )}
    </article>
  )
}
