import type { CSSProperties, ReactNode } from 'react'

import { ShardField, VerticalWatermark } from '@/components/persona'
import { Reveal } from '@/components/reveal'

/**
 * RF-110: cada sección tiene su propio tono. El color es orientación: dice en
 * qué parte de la página estás.
 *
 * Las clases se escriben completas y no se componen con plantillas
 * (`text-tone-${x}`): Tailwind analiza el código como texto plano y una clase
 * construida en tiempo de ejecución nunca llega al CSS final.
 *
 * `TONE_HEX` existe porque algunos efectos (la sombra sólida del título, el
 * `drop-shadow` de las tarjetas) leen el tono desde la variable CSS `--tone`,
 * y una variable no puede apuntar a una clase de Tailwind.
 */
export type Tone = 'violet' | 'green' | 'mint' | 'lilac' | 'silver'

export const TONE_HEX: Record<Tone, string> = {
  violet: '#b07cff',
  green: '#a6f13c',
  mint: '#5ef0a8',
  lilac: '#d7c4ff',
  silver: '#c3c0cf',
}

/** Estilo en línea que expone el tono a los efectos de globals.css. */
export function toneVar(tone: Tone): CSSProperties {
  return { '--tone': TONE_HEX[tone] } as CSSProperties
}

export const TONE_TEXT: Record<Tone, string> = {
  violet: 'text-tone-violet',
  green: 'text-tone-green',
  mint: 'text-tone-mint',
  lilac: 'text-tone-lilac',
  silver: 'text-tone-silver',
}

export const TONE_BG: Record<Tone, string> = {
  violet: 'bg-tone-violet',
  green: 'bg-tone-green',
  mint: 'bg-tone-mint',
  lilac: 'bg-tone-lilac',
  silver: 'bg-tone-silver',
}

export const TONE_BORDER: Record<Tone, string> = {
  violet: 'border-tone-violet',
  green: 'border-tone-green',
  mint: 'border-tone-mint',
  lilac: 'border-tone-lilac',
  silver: 'border-tone-silver',
}

export const TONE_HOVER_BORDER: Record<Tone, string> = {
  violet: 'hover:border-tone-violet',
  green: 'hover:border-tone-green',
  mint: 'hover:border-tone-mint',
  lilac: 'hover:border-tone-lilac',
  silver: 'hover:border-tone-silver',
}

/**
 * Cabecera de sección en clave de menú de P5R: el número enorme, relleno e
 * inclinado, y el título en una caja blanca torcida con sombra sólida del tono
 * de la sección. Debajo, una regla violeta que se corta en diagonal.
 *
 * El número es decorativo (`aria-hidden`): un lector de pantalla ya anuncia el
 * orden de los encabezados.
 */
export function SectionHeading({
  id,
  number,
  title,
  intro,
  tone,
  icon,
}: {
  id: string
  number: string
  title: string
  intro?: string
  tone: Tone
  icon?: ReactNode
}) {
  return (
    <Reveal>
      <div className="relative flex items-end gap-4 sm:gap-6" style={toneVar(tone)}>
        <span
          aria-hidden="true"
          className={`p-display p-parallax -mb-2 select-none text-7xl leading-none sm:text-8xl md:text-9xl ${TONE_TEXT[tone]}`}
        >
          {number}
        </span>

        <div className="min-w-0 pb-1">
          {icon && (
            <span
              aria-hidden="true"
              className={`mb-3 inline-flex h-8 w-8 items-center justify-center border-2 ${TONE_BORDER[tone]} ${TONE_TEXT[tone]} -rotate-6`}
            >
              {icon}
            </span>
          )}
          <h2
            id={id}
            className="p-display text-3xl leading-none sm:text-5xl md:text-6xl"
          >
            <span className="p-title-box">{title}</span>
          </h2>
        </div>
      </div>

      <div aria-hidden="true" className="mt-6 flex h-1.5 gap-1.5">
        <span className="w-24 -skew-x-[30deg] bg-violet" />
        <span className={`w-6 -skew-x-[30deg] ${TONE_BG[tone]}`} />
        <span className="flex-1 -skew-x-[30deg] bg-hairline" />
      </div>

      {intro && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{intro}</p>
      )}
    </Reveal>
  )
}

/**
 * Contenedor de sección.
 *
 * `band="abyss"` saca la sección a sangre sobre el violeta abismo, con cortes
 * diagonales arriba y abajo; el contenido sigue centrado al ancho del sitio.
 * El `<section>` es SIEMPRE el elemento con `id` y `aria-labelledby`, con o
 * sin banda: los tests y las anclas de la nav no dependen del estilo.
 */
export function Section({
  id,
  labelledBy,
  className = '',
  band,
  watermark,
  children,
}: {
  id: string
  labelledBy: string
  className?: string
  band?: 'abyss'
  /** Rótulo vertical gigante del borde de la banda (solo con `band`). */
  watermark?: string
  children: ReactNode
}) {
  if (band === 'abyss') {
    return (
      <section
        id={id}
        aria-labelledby={labelledBy}
        className={`p-band relative my-8 bg-abyss ${className}`}
      >
        {/* Agua P3R en movimiento, fragmentos flotando y el rótulo vertical.
            Todo decorativo y detrás del contenido. */}
        <div aria-hidden="true" className="p-water pointer-events-none absolute inset-0" />
        <ShardField className="opacity-60" />
        {watermark && <VerticalWatermark text={watermark} />}
        <div className="relative mx-auto max-w-content px-5 sm:px-8">{children}</div>
      </section>
    )
  }

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`mx-auto max-w-content px-5 py-16 sm:px-8 sm:py-24 ${className}`}
    >
      {children}
    </section>
  )
}
