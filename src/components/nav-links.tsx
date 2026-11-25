'use client'

import { useEffect, useState } from 'react'

/**
 * Enlaces de sección con el "cursor" de menú de Persona: un paralelogramo que
 * marca la sección en la que está el visitante y se mueve con el scroll.
 *
 * Es UNA sola lista para los dos tamaños. En escritorio (`xl`, desde 1280 px: con siete secciones no caben a 1024) va en línea
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
  menuLabel,
}: {
  items: readonly { href: string; label: string }[]
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
    <div className="order-last xl:order-none xl:flex-1">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="nav-secciones"
        onClick={() => setOpen((value) => !value)}
        // Recorte de cartulina con borde de papel; la X y la hamburguesa son
        // trazos de rotulador.
        className="m-card flex h-11 w-11 items-center justify-center text-ink transition-transform duration-200 hover:-rotate-3 xl:hidden"
      >
        <span className="sr-only">{menuLabel}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
          {open ? (
            <path d="M5.4 5c4.4 4.2 9 9 13.4 14.2M18.6 5.2C14 9.6 9.6 14.4 5.2 19" />
          ) : (
            <path d="M3.6 6.4c5.6-.6 11.2-.4 16.8.2M3.2 12.2c5.8-.4 11.6-.3 17.4.1M3.8 18c5.4-.6 10.8-.5 16.4.1" />
          )}
        </svg>
      </button>

      <ul
        id="nav-secciones"
        className={`${
          open ? 'flex' : 'hidden'
        } m-sheet absolute inset-x-3 top-full mt-3 flex-col gap-1 px-5 py-5 xl:static xl:m-0 xl:flex xl:flex-row xl:items-center xl:gap-1 xl:bg-transparent xl:bg-none xl:p-0 xl:shadow-none`}
      >
        {items.map((item) => {
          const isActive = active === item.href
          return (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? 'location' : undefined}
                // Lo que entra desde la izquierda (con `--ease-snap`) es una tira
                // de resaltador de bordes irregulares; el texto pasa a tinta.
                className="m-marker p-display inline-block whitespace-nowrap px-3 py-2 text-lg text-tinta xl:px-3 xl:py-1.5 xl:text-sm xl:text-ink-muted xl:hover:text-tinta xl:aria-[current]:text-tinta"
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
