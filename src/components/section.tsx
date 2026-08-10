import type { ReactNode } from 'react'

import { Reveal } from '@/components/reveal'

/**
 * RF-110: cada sección tiene su propio tono. El color deja de ser decoración y
 * pasa a ser orientación, dice en qué parte de la página estás.
 *
 * Las clases se escriben completas y no se componen con plantillas
 * (`text-tone-${x}`): Tailwind analiza el código como texto plano y una clase
 * construida en tiempo de ejecución nunca llega al CSS final. Es un error
 * clásico que se manifiesta como "el color no se aplica" sin ningún aviso.
 *
 * Al pasar el sitio a fondo oscuro, los tonos de `tailwind.config.ts` ya son
 * las variantes claras, así que el antiguo mapa `TONE_TEXT_BRIGHT` desapareció:
 * un solo juego de tonos sirve para todo.
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
  indigo: 'from-tone-indigo/55',
  teal: 'from-tone-teal/55',
  ochre: 'from-tone-ochre/55',
  plum: 'from-tone-plum/55',
  rust: 'from-tone-rust/55',
}

/** Cuadrado, no círculo: en este lenguaje visual no hay curvas. */
export const TONE_DOT: Record<Tone, string> = {
  indigo: 'bg-tone-indigo',
  teal: 'bg-tone-teal',
  ochre: 'bg-tone-ochre',
  plum: 'bg-tone-plum',
  rust: 'bg-tone-rust',
}

export const TONE_BORDER: Record<Tone, string> = {
  indigo: 'border-tone-indigo/35',
  teal: 'border-tone-teal/35',
  ochre: 'border-tone-ochre/35',
  plum: 'border-tone-plum/35',
  rust: 'border-tone-rust/35',
}

export const TONE_WASH: Record<Tone, string> = {
  indigo: 'bg-tone-indigo/[0.06]',
  teal: 'bg-tone-teal/[0.06]',
  ochre: 'bg-tone-ochre/[0.06]',
  plum: 'bg-tone-plum/[0.06]',
  rust: 'bg-tone-rust/[0.06]',
}

/** Borde a plena opacidad: para botones, donde un 35% se ve desvaído. */
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
 * Cabecera de sección en clave de ficha técnica.
 *
 * La jerarquía es la del cartel suizo: una línea de datos diminuta en
 * monoespaciada y mayúsculas muy espaciadas, una regla que cruza todo el ancho,
 * y debajo el título grande en Helvetica con el tracking cerrado. El contraste
 * de escala entre esas dos cosas es el efecto.
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
      <div className="flex items-center gap-3 border-b border-hairline pb-3">
        <span aria-hidden="true" className={`h-2 w-2 shrink-0 ${TONE_DOT[tone]}`} />

        <span
          aria-hidden="true"
          className={`font-mono text-[0.7rem] uppercase tracking-spec ${TONE_TEXT[tone]}`}
        >
          {number}
        </span>

        <span
          aria-hidden="true"
          className={`h-px flex-1 bg-gradient-to-r to-transparent ${TONE_RULE[tone]}`}
        />

        {icon && (
          <span className={`shrink-0 ${TONE_TEXT[tone]}`} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <h2
        id={id}
        className="mt-6 text-4xl font-bold leading-[0.95] tracking-tighter sm:text-5xl md:text-6xl"
      >
        {title}
      </h2>

      {intro && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{intro}</p>
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
