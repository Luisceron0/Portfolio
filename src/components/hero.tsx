import type { CSSProperties } from 'react'

import { hero, nav, type Locale } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'
import { PauseMenu } from '@/components/pause-menu'
import { PersonaEmblem, ShardField } from '@/components/persona'
import { PointerParallax } from '@/components/pointer-parallax'

/**
 * RF-101 (propuesta de valor) + RF-105 (enlace a GitHub).
 *
 * Los dos criterios que condicionan el maquetado:
 *  - RF-101: legible y comprensible SIN hacer scroll en un viewport de 375 px.
 *  - RF-105: el enlace al perfil de GitHub visible sin pasar del hero.
 * Por eso ambos CTA van dentro de esta sección, no más abajo.
 *
 * OJO al añadir cosas aquí: `e2e/landing.spec.ts` mide que el titular, la
 * propuesta de valor y los dos CTA entren en 375x667. Cualquier elemento nuevo
 * por encima de los botones consume ese presupuesto. Es intencionado.
 *
 * El emblema va en posición absoluta: no aporta altura y no toca ese
 * presupuesto. El menú de pausa va DESPUÉS de los CTA en el DOM: en móvil
 * queda debajo de ellos, y en escritorio pasa a la columna derecha.
 */

/** Retardo escalonado de entrada, expuesto a `.p-enter` como `--delay`. */
function delay(ms: number): CSSProperties {
  return { '--delay': `${ms}ms` } as CSSProperties
}

export function Hero({ locale }: { locale: Locale }) {
  const words = hero.name.split(' ')

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto grid max-w-content items-center gap-12 px-5 pb-6 pt-6 sm:px-8 sm:pb-10 sm:pt-14 lg:grid-cols-[1.35fr_1fr]"
    >
      {/* Capas con profundidad: se desplazan con el puntero (ver
          `.p-depth-*`). El emblema queda detrás del texto en móvil, tenue. */}
      {/* `overflow-hidden`: el emblema asoma por la derecha y, sin recorte,
          abriría scroll horizontal en móvil. */}
      <PointerParallax className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="p-depth-1 absolute -right-28 -top-4 w-72 opacity-[0.15] sm:-right-10 sm:w-[26rem] sm:opacity-40 lg:-right-16 lg:top-auto lg:bottom-0 lg:w-[34rem] lg:opacity-60">
          <PersonaEmblem className="w-full" />
        </div>
        <div className="p-depth-2 absolute inset-0 hidden lg:block">
          <ShardField />
        </div>
      </PointerParallax>

      <div className="relative">
        <p
          className="p-enter p-slant inline-block px-4 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-widest2 text-ink [--slant-bg:#c8101b]"
          style={delay(0)}
        >
          {hero.role[locale]}
        </p>

        {/*
          Nombre en "nota de rescate": cada palabra en un recorte distinto (ver
          `.p-ransom`). Los recortes son `aria-hidden` y el nombre legible va en
          un `sr-only`: un lector de pantalla oye el nombre una vez y limpio,
          no cuatro fragmentos. La región del hero toma su nombre de aquí.
        */}
        <h1
          id="hero-title"
          className="p-display mt-4 text-[2.15rem] leading-none sm:mt-6 sm:text-6xl md:text-7xl"
        >
          <span className="sr-only">{hero.name}</span>
          <span aria-hidden="true">
            {words.map((word, index) => (
              <span key={word} className="p-ransom" style={{ animationDelay: `${120 + index * 90}ms` }}>
                {word}
              </span>
            ))}
          </span>
        </h1>

        <p
          className="p-enter mt-5 max-w-2xl border-l-4 border-blood pl-4 text-lg leading-relaxed text-ink sm:mt-7 sm:text-xl"
          style={delay(380)}
        >
          {hero.pitch[locale]}
        </p>

        <div
          className="p-enter mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-6"
          style={delay(480)}
        >
          <ExternalLinkButton link={hero.contactCta} locale={locale} variant="primary" />
          <ExternalLinkButton link={hero.githubLink} locale={locale} variant="secondary" />
        </div>

        {/* Debajo de los CTA a propósito: no compite por el espacio de RF-101. */}
        <p
          className="p-enter mt-8 flex flex-wrap items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest2"
          style={delay(560)}
        >
          <span className="p-slant px-3 py-1 text-ink [--slant-bg:#1a54d1]">
            {hero.location[locale]}
          </span>
          <span className="p-slant px-3 py-1 text-surface [--slant-bg:#ffd23f]">
            {hero.availability[locale]}
          </span>
        </p>
      </div>

      {/* Panel del menú de pausa P3R: agua azul en movimiento, fragmentos
          flotando y el rótulo "MENU" vertical deslizándose por el borde. */}
      <div
        className="p-enter relative overflow-hidden border-l-4 border-tone-cyan bg-midnight px-6 py-7 shadow-[10px_10px_0_#c8101b] sm:px-10"
        style={delay(640)}
      >
        <div aria-hidden="true" className="p-water pointer-events-none absolute inset-0" />
        <ShardField />
        <span
          aria-hidden="true"
          className="p-display p-outline pointer-events-none absolute -left-3 top-0 select-none text-7xl leading-none text-tone-cyan/40 [writing-mode:vertical-rl]"
        >
          {hero.menu.title[locale]}
        </span>
        <div className="relative pl-10">
          <PauseMenu
            title={hero.menu.title[locale]}
            label={hero.menu.label[locale]}
            hint={hero.menu.hint[locale]}
            items={[...nav.items, hero.menu.extra].map((item) => ({
              href: item.href,
              label: item.label[locale],
            }))}
          />
        </div>
      </div>
    </section>
  )
}
