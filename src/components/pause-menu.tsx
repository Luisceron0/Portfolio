'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * Menú de pausa al estilo de P3R: una pila de rótulos en cursiva, cada uno con
 * su tamaño y su giro, y un cursor que VIAJA hasta el elemento señalado y se
 * redimensiona para envolverlo, con un rebote al llegar. El elemento elegido
 * crece y cambia de color.
 *
 * En el juego (y en la recreación de Ultipuk en Godot) el cursor son dos
 * polígonos, uno violeta y uno blanco, que se interpolan hacia el elemento. Aquí
 * es lo mismo con dos capas CSS y una transición sobre `transform`, `width` y
 * `height`. La curva con sobrepaso (`--ease-spring`) es el rebote.
 *
 * Accesibilidad: son enlaces normales dentro de una lista. El cursor es
 * `aria-hidden` y sigue tanto al ratón como al foco del teclado. Sin
 * JavaScript, los enlaces funcionan igual y el cursor simplemente no aparece.
 * El texto elegido es `ink` sobre el violeta de relleno (5.5:1) y el resto son tonos
 * claros sobre `abyss`, todos medidos en `check:contrast`.
 */

/** Giro, tamaño y tono de cada rótulo: la "pila desordenada" del menú. */
const LAYOUT = [
  { rotate: -7, size: 'text-3xl xl:text-4xl', tone: 'text-tone-green', indent: 'ml-2' },
  { rotate: -4, size: 'text-2xl xl:text-3xl', tone: 'text-tone-lilac', indent: 'ml-8' },
  { rotate: -6, size: 'text-3xl xl:text-4xl', tone: 'text-tone-green', indent: 'ml-0' },
  { rotate: -3, size: 'text-2xl xl:text-3xl', tone: 'text-tone-lilac', indent: 'ml-6' },
  { rotate: -8, size: 'text-3xl xl:text-4xl', tone: 'text-tone-green', indent: 'ml-1' },
  { rotate: -5, size: 'text-2xl xl:text-3xl', tone: 'text-tone-lilac', indent: 'ml-10' },
] as const

interface Box {
  x: number
  y: number
  w: number
  h: number
  rotate: number
}

export function PauseMenu({
  title,
  label,
  hint,
  items,
}: {
  title: string
  label: string
  hint: string
  items: readonly { href: string; label: string }[]
}) {
  const listRef = useRef<HTMLUListElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [selected, setSelected] = useState(0)
  const [box, setBox] = useState<Box | null>(null)
  /** Se reinicia en cada cambio para relanzar el "golpe" del cursor. */
  const [pulse, setPulse] = useState(0)

  /*
   * Se mide con `offset*` y NO con `getBoundingClientRect`: cada rótulo va
   * girado, y el rectángulo del giro es más grande que el rótulo. El cursor se
   * gira después con el mismo ángulo, así que necesita la caja SIN girar.
   */
  const measure = useCallback((index: number) => {
    // `offsetParent` del enlace es la `<ul>` (el `<li>` no está posicionado),
    // así que sus offsets ya son relativos a la lista, igual que el cursor.
    const link = linkRefs.current[index]
    if (!link) return
    setBox({
      x: link.offsetLeft,
      y: link.offsetTop,
      w: link.offsetWidth,
      h: link.offsetHeight,
      rotate: LAYOUT[index % LAYOUT.length].rotate,
    })
  }, [])

  // Medir antes de pintar para que el cursor no aparezca en (0,0) y salte.
  useLayoutEffect(() => {
    measure(selected)
  }, [measure, selected])

  // Si cambia el ancho (giro del móvil, zoom), el cursor se recoloca.
  useEffect(() => {
    const list = listRef.current
    if (!list || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => measure(selected))
    observer.observe(list)
    return () => observer.disconnect()
  }, [measure, selected])

  function choose(index: number) {
    if (index === selected) return
    setSelected(index)
    setPulse((value) => value + 1)
  }

  const cursorStyle: CSSProperties | undefined = box
    ? {
        // El rótulo elegido crece un 12% (`.is-selected`) y se desplaza 10px:
        // el cursor se dimensiona para el tamaño final, no para el de reposo.
        width: box.w * 1.12 + 40,
        height: box.h + 6,
        transform: `translate(${box.x - 18}px, ${box.y - 3}px) rotate(${box.rotate}deg)`,
      }
    : undefined

  return (
    <div className="relative">
      <p
        aria-hidden="true"
        className="p-display mb-2 text-sm tracking-[0.3em] text-tone-green"
      >
        {title}
      </p>

      <ul ref={listRef} aria-label={label} className="relative isolate flex flex-col items-start">
        {/* Cursor: sombra blanca desplazada + paralelogramo violeta. */}
        <span
          aria-hidden="true"
          style={cursorStyle}
          className={`p-menu-cursor pointer-events-none absolute left-0 top-0 -z-10 origin-left ${
            box ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span key={pulse} className="p-menu-cursor__shape block h-full w-full" />
        </span>

        {items.map((item, index) => {
          const layout = LAYOUT[index % LAYOUT.length]
          const isSelected = index === selected
          return (
            <li key={item.href} className={`${layout.indent} py-1`}>
              <a
                ref={(element) => {
                  linkRefs.current[index] = element
                }}
                href={item.href}
                onPointerEnter={() => choose(index)}
                onFocus={() => choose(index)}
                style={{ '--r': `${layout.rotate}deg` } as CSSProperties}
                className={`p-menu-item p-display inline-block leading-[1.05] ${layout.size} ${
                  isSelected ? 'is-selected text-ink' : layout.tone
                }`}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>

      <p aria-hidden="true" className="mt-4 flex items-center justify-end gap-2 font-display text-sm font-black italic text-ink">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-[50%] border-2 border-ink text-[0.65rem] not-italic">
          A
        </span>
        {hint}
      </p>
    </div>
  )
}
