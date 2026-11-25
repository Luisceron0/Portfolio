import type { CSSProperties } from 'react'

import { cv, hero, linkHref, navItems, projectsSection, resolved, type Locale } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'
import { PauseMenu } from '@/components/pause-menu'
import { PointerParallax } from '@/components/pointer-parallax'
import { BrushStroke, SplatStar, Tape } from '@/components/zine'

/**
 * RF-101 (propuesta de valor) + RF-105 (enlace a GitHub), en papel.
 *
 * Una banda de papel magenta a sangre con bordes rasgados. Sobre ella, todo en
 * tinta: el rol en una etiqueta Dymo, el nombre en recortes de revista, el
 * pitch en una fotocopia pegada con cinta, los dos CTA (cartulina tinta y
 * fotocopia) y GitHub y LinkedIn subrayados a rotulador.
 *
 * Los dos criterios que condicionan el maquetado:
 *  - RF-101: legible SIN hacer scroll en un viewport de 375 px.
 *  - RF-105: el enlace al perfil de GitHub visible sin pasar del hero.
 * `e2e/landing.spec.ts` mide que titular, propuesta, los dos CTA y GitHub
 * entren en 375x667. Cualquier elemento nuevo por encima de los botones
 * consume ese presupuesto.
 *
 * Adornos (salpicadura tinta y brochazo plum): SOLO en la columna derecha y
 * desde `lg`. Detrás del texto en tinta lo dejarían ilegible.
 */

/** Retardo escalonado de entrada, expuesto a `.p-enter` como `--delay`. */
function delay(ms: number): CSSProperties {
  return { '--delay': `${ms}ms` } as CSSProperties
}

export function Hero({ locale }: { locale: Locale }) {
  const words = hero.name.split(' ')
  const cvFile = cv.downloads.find((download) => download.language === locale)?.fileName

  return (
    <section aria-labelledby="hero-title" className="m-magenta relative overflow-x-clip">
      <PointerParallax className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="p-depth-1 absolute -right-24 top-6 w-[30rem] opacity-90">
          <SplatStar className="w-full" />
        </div>
        <div className="p-depth-2 absolute bottom-16 right-10 w-[26rem] -rotate-6">
          <BrushStroke className="h-6 w-full" color="#5a1257" />
        </div>
      </PointerParallax>

      <div className="relative mx-auto grid max-w-content items-center gap-12 px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-14 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative">
          <p className="p-enter m-dymo text-[0.7rem] sm:text-xs" style={delay(0)}>
            {hero.role[locale]}
          </p>

          {/*
            Nombre en "nota de rescate": cada palabra recortada de una revista
            distinta (ver `.p-ransom`). Los recortes son `aria-hidden` y el
            nombre legible va en un `sr-only`. La región del hero toma su nombre
            de aquí.
          */}
          <h1 id="hero-title" className="p-display mt-4 text-[2.15rem] leading-none sm:mt-6 sm:text-6xl md:text-7xl">
            <span className="sr-only">{hero.name}</span>
            <span aria-hidden="true">
              {words.map((word, index) => (
                <span key={word} className="p-ransom" style={{ animationDelay: `${120 + index * 90}ms` }}>
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <div className="p-enter relative mt-5 max-w-2xl sm:mt-7" style={delay(380)}>
            <p className="m-sheet px-4 py-2.5 text-lg leading-snug sm:px-5 sm:py-3 sm:text-xl">{hero.pitch[locale]}</p>
            <Tape className="-right-3 -top-3" rotate={8} />
          </div>
          <p className="p-enter mt-3 max-w-2xl text-base leading-relaxed text-tinta sm:text-lg" style={delay(420)}>
            {hero.support[locale]}
          </p>

          <div
            className="p-enter mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-6"
            style={delay(480)}
          >
            <ExternalLinkButton link={hero.casesCta} locale={locale} variant="dark" />
            <ExternalLinkButton link={hero.cvCta} locale={locale} variant="secondary" download={cvFile} />
          </div>

          <ul className="p-enter p-type mt-2 flex gap-6 text-sm font-bold sm:mt-5" style={delay(520)}>
            {[hero.githubLink, hero.linkedinLink].map((link) => {
              const href = resolved(linkHref(link, locale))
              if (!href) return null
              return (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-link p-link--ink p-link--cyan inline-flex min-h-[44px] items-center px-0.5 text-tinta"
                  >
                    {link.label[locale]}
                    <span className="sr-only">{projectsSection.labels.newTab[locale]}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Debajo de los CTA a propósito: no compite por el espacio de RF-101. */}
          <p className="p-enter mt-8 flex flex-wrap items-center gap-4 text-xs" style={delay(560)}>
            <span className="m-dymo">{hero.location[locale]}</span>
            <span className="m-stamp m-stamp--ink text-sm [--stamp-r:-3deg]">{hero.availability[locale]}</span>
          </p>
        </div>

        {/*
          Menú de pausa P3R en cartulina negra recortada, girada y pegada con
          dos cintas. "MENÚ" en vertical, a rotulador, relleno de tinta magenta.
        */}
        <div className="p-enter relative -rotate-2" style={delay(640)}>
          <div className="m-card px-6 py-8 sm:px-10">
            <span
              aria-hidden="true"
              className="p-display pointer-events-none absolute -left-1 top-4 select-none text-6xl leading-none text-magenta-text [writing-mode:vertical-rl]"
            >
              {hero.menu.title[locale]}
            </span>
            <div className="relative pl-12">
              <PauseMenu
                title={hero.menu.title[locale]}
                label={hero.menu.label[locale]}
                hint={hero.menu.hint[locale]}
                items={[...navItems(), hero.menu.extra].map((item) => ({
                  href: item.href,
                  label: item.label[locale],
                }))}
              />
            </div>
          </div>
          <Tape className="-top-3 left-8" rotate={-8} />
          <Tape className="-bottom-3 right-10" rotate={5} />
        </div>
      </div>
    </section>
  )
}
