import type { ReactNode } from 'react'

import { Reveal } from '@/components/reveal'

/**
 * RF-110: cada sección tiene su propio tono. El color deja de ser decoración
 * y pasa a ser orientación, dice en qué parte de la página estás.
 *
 * Las clases se escriben completas y no se componen con plantillas
 * (`text-tone-${x}`): Tailwind analiza el código como texto plano y una clase
 * construida en tiempo de ejecución nunca llega al CSS final. Es un error
 * clásico que se manifiesta como "el color no se aplica" sin ningún aviso.
 */
export type Tone = 'indigo' | 'teal' | 'ochre' | 'plum' | 'rust'

export const TONE_TEXT: Record<Tone, string> = {
  indigo: 'text-tone-indigo',
  teal: 'text-tone-teal',
  ochre: 'text-tone-ochre',
  plum: 'text-tone-plum',
  rust: 'text-tone-rust',
}

export const TONE_RULE: Record<Tone, string> = {
  indigo: 'from-tone-indigo/45',
  teal: 'from-tone-teal/45',
  ochre: 'from-tone-ochre/45',
  plum: 'from-tone-plum/45',
  rust: 'from-tone-rust/45',
}

export const TONE_DOT: Record<Tone, string> = {
  indigo: 'bg-tone-indigo',
  teal: 'bg-tone-teal',
  ochre: 'bg-tone-ochre',
  plum: 'bg-tone-plum',
  rust: 'bg-tone-rust',
}

export const TONE_BORDER: Record<Tone, string> = {
  indigo: 'border-tone-indigo/30',
  teal: 'border-tone-teal/30',
  ochre: 'border-tone-ochre/30',
  plum: 'border-tone-plum/30',
  rust: 'border-tone-rust/30',
}

export const TONE_WASH: Record<Tone, string> = {
  indigo: 'bg-tone-indigo/[0.05]',
  teal: 'bg-tone-teal/[0.05]',
  ochre: 'bg-tone-ochre/[0.05]',
  plum: 'bg-tone-plum/[0.05]',
  rust: 'bg-tone-rust/[0.05]',
}

/** Borde a plena opacidad: para botones, donde un 30% se ve desvaído. */
export const TONE_BORDER_SOLID: Record<Tone, string> = {
  indigo: 'border-tone-indigo',
  teal: 'border-tone-teal',
  ochre: 'border-tone-ochre',
  plum: 'border-tone-plum',
  rust: 'border-tone-rust',
}

export const TONE_HOVER_BORDER: Record<Tone, string> = {
  indigo: 'hover:border-tone-indigo',
  teal: 'hover:border-tone-teal',
  ochre: 'hover:border-tone-ochre',
  plum: 'hover:border-tone-plum',
  rust: 'hover:border-tone-rust',
}

/**
 * RF-110 — variantes claras de cada tono, para texto sobre `console-bg`
 * (fondo oscuro). Los `tone.*` normales están medidos sobre lienzo claro y
 * fallan AA sobre un fondo casi negro; estas son un color distinto, no el
 * mismo con opacidad.
 */
export const TONE_TEXT_BRIGHT: Record<Tone, string> = {
  indigo: 'text-toneBright-indigo',
  teal: 'text-toneBright-teal',
  ochre: 'text-toneBright-ochre',
  plum: 'text-toneBright-plum',
  rust: 'text-toneBright-rust',
}

/**
 * Cabecera de sección numerada, en la línea editorial de las referencias de
 * diseño: el número pequeño con tracking amplio en el tono de la sección, una
 * regla que se desvanece desde ese mismo tono, y el título grande debajo.
 *
 * El número es decorativo (`aria-hidden`): un lector de pantalla ya anuncia el
 * orden de los encabezados, así que leer "cero uno" antes de cada título sería
 * ruido, no información.
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
      <div className="flex items-center gap-3">
        {icon && <span className={TONE_TEXT[tone]}>{icon}</span>}
        <span
          aria-hidden="true"
          className={`text-xs font-semibold tracking-widest2 ${TONE_TEXT[tone]}`}
        >
          {number}
        </span>
        <span
          aria-hidden="true"
          className={`h-px flex-1 bg-gradient-to-r to-transparent ${TONE_RULE[tone]}`}
        />
      </div>

      <h2
        id={id}
        className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
      >
        {title}
      </h2>

      {intro && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{intro}</p>
      )}
    </Reveal>
  )
}

/** Contenedor de sección con el ancho y el ritmo vertical del sitio. */
export function Section({
  id,
  labelledBy,
  className = '',
  children,
}: {
  id: string
  labelledBy: string
  className?: string
  children: ReactNode
}) {
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
