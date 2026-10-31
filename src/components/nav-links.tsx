'use client'

import { useEffect, useState } from 'react'

/**
 * Enlaces de sección con el "cursor" de menú de Persona: un paralelogramo que
 * marca la sección en la que está el visitante y se mueve con el scroll.
 *
 * El servidor renderiza la lista SIN sección activa y todo funciona igual sin
 * JavaScript: son anclas normales. El cliente solo añade el resaltado. Se
 * anuncia con `aria-current="location"`, que es el valor correcto para "la
 * parte de la página donde estás", no solo con color.
 */
export function NavLinks({
  items,
  tones,
}: {
  items: readonly { href: string; label: string }[]
  /** Clase de fondo del cursor, una por enlace (clases completas: Tailwind). */
  tones: readonly string[]
}) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((element): element is HTMLElement => element !== null)

    // Banda estrecha a media altura de la pantalla: la sección que la cruza es
    // la "actual". Con umbrales normales dos secciones cortas podrían competir.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  return (
    <ul className="flex shrink-0 items-center gap-1 sm:gap-2">
      {items.map((item, index) => {
        const isActive = active === item.href
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={isActive ? 'location' : undefined}
              className={`group relative isolate inline-block whitespace-nowrap px-3 py-1.5 font-display text-sm font-black uppercase italic transition-colors duration-150 sm:px-3.5 ${
                isActive ? 'text-surface' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 -z-10 -skew-x-[14deg] transition-transform duration-200 ease-out ${tones[index % tones.length]} ${
                  isActive ? 'scale-100' : 'scale-x-0 group-hover:scale-x-[0.12] group-hover:origin-left'
                }`}
              />
              {item.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
