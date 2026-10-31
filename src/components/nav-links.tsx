'use client'

import { useEffect, useState } from 'react'

/**
 * Enlaces de sección con el "cursor" de menú de Persona: un paralelogramo que
 * marca la sección en la que está el visitante y se mueve con el scroll.
 *
 * Es UNA sola lista para los dos tamaños. En escritorio (`lg`) va en línea
 * dentro de la barra; por debajo se pliega tras un botón de menú y se abre
 * como panel bajo el header. Antes la lista vivía en un contenedor con scroll
 * horizontal: en móvil había que deslizar para encontrar "Contacto", y en
 * Windows asomaba la barra de scroll gris dentro del header. Un menú plegable
 * enseña todos los destinos de un vistazo y no recorta nada.
 *
 * El servidor renderiza la lista SIN sección activa; el cliente añade el
 * resaltado. Se anuncia con `aria-current="location"`, que es el valor
 * correcto para "la parte de la página donde estás", no solo con color.
 */
export function NavLinks({
  items,
  tones,
  menuLabel,
}: {
  items: readonly { href: string; label: string }[]
  /** Clase de fondo del cursor, una por enlace (clases completas: Tailwind). */
  tones: readonly string[]
  /** Nombre accesible del botón de menú en el idioma de la página. */
  menuLabel: string
}) {
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

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

  // Escape cierra el panel, como cualquier menú desplegable.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="order-last lg:order-none lg:flex-1">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="nav-secciones"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-surface lg:hidden"
      >
        <span className="sr-only">{menuLabel}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          {open ? (
            <path d="M5 5l14 14M19 5L5 19" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" />
          )}
        </svg>
      </button>

      <ul
        id="nav-secciones"
        className={`${
          open ? 'flex' : 'hidden'
        } absolute inset-x-0 top-full flex-col gap-1 border-b-2 border-violet bg-surface px-5 py-4 shadow-[0_12px_24px_rgba(0,0,0,0.5)] lg:static lg:flex lg:flex-row lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
      >
        {items.map((item, index) => {
          const isActive = active === item.href
          return (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? 'location' : undefined}
                className={`group relative isolate inline-block whitespace-nowrap px-3 py-2.5 font-display text-lg font-black uppercase italic transition-colors duration-150 lg:px-3.5 lg:py-1.5 lg:text-sm ${
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
    </div>
  )
}
