'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Publica la posición del puntero como `--mx` y `--my` (de -1 a 1) en su
 * contenedor. Las capas decorativas de dentro las leen en CSS (`.p-depth-*`)
 * y se desplazan cada una a su profundidad.
 *
 * Solo escribe dos variables CSS en un `requestAnimationFrame`: no hay estado
 * de React ni un render por movimiento. Con `prefers-reduced-motion` o con un
 * puntero táctil (sin hover) no se engancha nada y las capas quedan quietas.
 */
export function PointerParallax({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return

    let frame = 0
    function onMove(event: PointerEvent) {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 2 - 1
        const y = (event.clientY / window.innerHeight) * 2 - 1
        element!.style.setProperty('--mx', x.toFixed(3))
        element!.style.setProperty('--my', y.toFixed(3))
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {children}
    </div>
  )
}
