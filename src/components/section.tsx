import type { ReactNode } from 'react'

import { Reveal } from '@/components/reveal'

/**
 * Cabecera de sección numerada, en la línea editorial de las referencias de
 * diseño: un número pequeño con tracking amplio, una regla horizontal fina, y
 * el título grande debajo.
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
}: {
  id: string
  number: string
  title: string
  intro?: string
}) {
  return (
    <Reveal>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="text-xs font-semibold tracking-widest2 text-accent"
        >
          {number}
        </span>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-gradient-to-r from-hairline-strong to-transparent"
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
