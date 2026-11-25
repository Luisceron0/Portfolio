import type { CSSProperties, ReactNode } from 'react'

import { Reveal } from '@/components/reveal'
import { BrushStroke, SplatStar } from '@/components/zine'

/**
 * RF-110 v5: cada sección tiene su tono de MATERIAL (tinta magenta, papel rosa,
 * kraft, resaltador cian, fotocopia lila). El color orienta: dice en qué parte
 * de la página estás.
 *
 * Las clases se escriben completas y no se componen con plantillas
 * (`text-tone-${x}`): Tailwind analiza el código como texto plano y una clase
 * construida en tiempo de ejecución nunca llega al CSS final.
 *
 * Todos los tonos son legibles como texto sobre negro y con tinta encima
 * cuando son papel (check:contrast).
 */
export type Tone = 'magenta' | 'pink' | 'ochre' | 'cyan' | 'lilac'

export const TONE_HEX: Record<Tone, string> = {
  magenta: '#F25CEB',
  pink: '#FF9CF5',
  ochre: '#E0A24A',
  cyan: '#46C3D8',
  lilac: '#B6A6B6',
}

/** Estilo en línea que expone el tono a los efectos de globals.css. */
export function toneVar(tone: Tone): CSSProperties {
  return { '--tone': TONE_HEX[tone] } as CSSProperties
}

export const TONE_TEXT: Record<Tone, string> = {
  magenta: 'text-tone-magenta',
  pink: 'text-tone-pink',
  ochre: 'text-tone-ochre',
  cyan: 'text-tone-cyan',
  lilac: 'text-tone-lilac',
}

export const TONE_BG: Record<Tone, string> = {
  magenta: 'bg-tone-magenta',
  pink: 'bg-tone-pink',
  ochre: 'bg-tone-ochre',
  cyan: 'bg-tone-cyan',
  lilac: 'bg-tone-lilac',
}

export const TONE_BORDER: Record<Tone, string> = {
  magenta: 'border-tone-magenta',
  pink: 'border-tone-pink',
  ochre: 'border-tone-ochre',
  cyan: 'border-tone-cyan',
  lilac: 'border-tone-lilac',
}

export const TONE_HOVER_BORDER: Record<Tone, string> = {
  magenta: 'hover:border-tone-magenta',
  pink: 'hover:border-tone-pink',
  ochre: 'hover:border-tone-ochre',
  cyan: 'hover:border-tone-cyan',
  lilac: 'hover:border-tone-lilac',
}

/**
 * Cabecera de sección del zine: el número a rotulador con una salpicadura
 * plum detrás, el título en una tira de fotocopia rasgada con su sombra
 * sólida, y debajo un brochazo que termina en un tachón.
 *
 * El número es decorativo (`aria-hidden`): un lector de pantalla ya anuncia el
 * orden de los encabezados. `onPaper` cambia número, regla e intro a tinta
 * cuando la sección es una banda de papel magenta o lila.
 */
export function SectionHeading({
  id,
  number,
  title,
  intro,
  tone,
  onPaper = false,
}: {
  id: string
  number: string
  title: string
  intro?: string
  tone: Tone
  onPaper?: boolean
}) {
  return (
    <Reveal>
      <div className="relative flex items-end gap-3 sm:gap-6" style={toneVar(tone)}>
        <span aria-hidden="true" className="relative -mb-2 select-none">
          <SplatStar
            className="absolute -left-4 -top-6 h-28 w-28 sm:h-36 sm:w-36"
            color={onPaper ? '#f2efe8' : '#5a1257'}
          />
          <span
            className={`p-display p-parallax relative block text-6xl leading-none min-[400px]:text-7xl sm:text-8xl md:text-9xl ${
              onPaper ? 'text-tinta' : 'text-magenta-text'
            }`}
          >
            {number}
          </span>
        </span>

        <div className="min-w-0 pb-1">
          <h2 id={id} className="p-display text-[clamp(1.1rem,5.4vw,1.6rem)] leading-none [overflow-wrap:anywhere] sm:text-5xl md:text-6xl">
            <span className="p-title-box">{title}</span>
          </h2>
        </div>
      </div>

      <div aria-hidden="true" className={`mt-6 flex items-center gap-2 ${onPaper ? 'text-tinta' : 'text-paper'}`}>
        <BrushStroke className="h-3 w-full max-w-md" color={onPaper ? '#0b0a0f' : '#f2efe8'} draw />
      </div>

      {intro && (
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${onPaper ? 'text-tinta' : 'text-ink-muted'}`}>
          {intro}
        </p>
      )}
    </Reveal>
  )
}

/**
 * Contenedor de sección.
 *
 * `band` saca la sección a sangre sobre papel: `magenta` (papel magenta con
 * semitonos en las esquinas) o `lilac` (fotocopia vieja), los dos con bordes
 * rasgados arriba y abajo. Sobre papel el texto es tinta; las tarjetas que van
 * dentro son su propio material (cartulina, nota, ficha).
 *
 * El `<section>` es SIEMPRE el elemento con `id` y `aria-labelledby`, con o
 * sin banda: los tests y las anclas de la nav no dependen del estilo.
 */
export function Section({
  id,
  labelledBy,
  className = '',
  band,
  children,
}: {
  id: string
  labelledBy: string
  className?: string
  band?: 'magenta' | 'lilac'
  children: ReactNode
}) {
  if (band) {
    return (
      <section
        id={id}
        aria-labelledby={labelledBy}
        className={`${band === 'magenta' ? 'm-magenta' : 'm-band-lilac'} relative my-8 py-20 sm:py-28 ${className}`}
      >
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
