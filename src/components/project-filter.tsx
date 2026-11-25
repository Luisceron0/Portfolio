'use client'

import { useEffect, useState, type ReactNode } from 'react'

import { FILTER_PARAM, FILTER_VALUES, type FilterValue } from '@/lib/project-filter-values'

function fromUrl(): FilterValue {
  const value = new URLSearchParams(window.location.search).get(FILTER_PARAM)
  return (FILTER_VALUES as readonly string[]).includes(value ?? '') ? (value as FilterValue) : 'destacados'
}

/**
 * Filtros de la sección Proyectos (portafolio v2).
 *
 * Mejora progresiva, a propósito:
 *  - El servidor renderiza TODAS las tarjetas y este componente no las toca:
 *    solo pone `data-filter` en el contenedor, y el CSS (globals.css, bloque
 *    "Filtros de proyectos") oculta las que no coinciden. Sin JavaScript no hay
 *    `data-filter`, así que se ve la lista completa, y tampoco se pintan unos
 *    botones que no harían nada.
 *  - Botones nativos con `aria-pressed`: Tab y Enter/Espacio funcionan sin
 *    código de teclado propio.
 *  - La URL refleja el filtro (`?categoria=pruebas`) con `replaceState`, sin
 *    recargar y conservando el resto de parámetros (`?lang=en`).
 */
export function ProjectFilter({
  label,
  options,
  counts,
  announce,
  children,
}: {
  label: string
  options: readonly { value: FilterValue; label: string }[]
  /** Cuántos proyectos muestra cada filtro (lo calcula el servidor). */
  counts: Readonly<Record<FilterValue, number>>
  /** Texto del anuncio para lectores de pantalla, con `{n}` como número. */
  announce: string
  children: ReactNode
}) {
  // `null` hasta montar: el primer render del cliente coincide con el HTML del
  // servidor (sin filtro) y no hay desajuste de hidratación.
  const [filter, setFilter] = useState<FilterValue | null>(null)

  useEffect(() => {
    setFilter(fromUrl())
    const onPop = () => setFilter(fromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function choose(value: FilterValue) {
    setFilter(value)
    const url = new URL(window.location.href)
    if (value === 'destacados') url.searchParams.delete(FILTER_PARAM)
    else url.searchParams.set(FILTER_PARAM, value)
    window.history.replaceState(null, '', url)
  }

  return (
    <div>
      {filter !== null && (
        <div role="group" aria-label={label} className="mt-10 flex flex-wrap gap-3">
          {options.map((option) => {
            const pressed = option.value === filter
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={pressed}
                onClick={() => choose(option.value)}
                // Etiquetas Dymo: la activa en magenta, el resto en tinta con
                // borde papel. `aria-pressed` dice cuál está activa, no el color.
                className={`m-dymo min-h-[44px] text-xs transition-transform duration-200 hover:-translate-y-0.5 ${
                  pressed ? 'm-dymo--magenta -rotate-2' : 'm-dymo--edge'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
      {filter !== null && (
        <p className="sr-only" aria-live="polite">
          {announce.replace('{n}', String(counts[filter]))}
        </p>
      )}
      <div data-project-list="" data-filter={filter ?? undefined}>
        {children}
      </div>
    </div>
  )
}
