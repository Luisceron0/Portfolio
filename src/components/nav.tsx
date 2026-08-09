import { nav } from '@/content'

/**
 * RF-108 — navegación dentro de la misma página.
 *
 * NO introduce rutas: cada destino es un ancla (`#seccion`) del mismo
 * documento, así que la restricción de "una sola página" del §3 de la SRS se
 * mantiene intacta.
 *
 * Es un componente de servidor a propósito: no necesita estado. El resaltado
 * de la sección activa exigiría JavaScript en el cliente y un observer más
 * por sección, y no aporta lo suficiente para justificar ese coste.
 *
 * `top-3` y no `top-0`: la barra flota sobre el lienzo, como en las
 * referencias de diseño, en vez de pegarse al borde. `z-40` la deja por debajo
 * del salto al contenido (`z-50`), que debe poder taparla al recibir el foco.
 */
export function SiteNav() {
  return (
    <nav
      aria-label="Secciones de la página"
      className="sticky top-3 z-40 mx-auto mb-2 mt-3 w-[calc(100%-1.5rem)] max-w-content sm:top-4 sm:mt-4"
    >
      <div className="flex items-center justify-between gap-4 rounded-full border border-hairline bg-surface-card/90 px-4 py-2 backdrop-blur sm:px-5">
        <a
          href="#contenido"
          className="rounded-full text-sm font-bold tracking-widest2 text-ink"
        >
          {nav.brand}
        </a>

        <ul className="flex items-center gap-1 overflow-x-auto sm:gap-2">
          {nav.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-block whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink sm:px-3"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
