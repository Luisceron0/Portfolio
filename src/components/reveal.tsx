'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Aparición al hacer scroll, sin librerías de animación.
 *
 * EL PUNTO IMPORTANTE DE ESTE ARCHIVO — el contenido empieza VISIBLE.
 *
 * La primera versión hacía lo contrario: `opacity: 0` en CSS y el observer se
 * encargaba de mostrarlo. Eso convierte la animación en un requisito para leer
 * la página, y falla en todos estos casos reales:
 *   - Un crawler o Lighthouse que renderiza sin hacer scroll: ve el contenido
 *     transparente.
 *   - `scroll-behavior: smooth` + saltos rápidos: el observer no llega a
 *     dispararse y secciones enteras se quedan invisibles (comprobado: de 10
 *     bloques, 9 seguían en opacity 0 tras recorrer la página entera).
 *   - JavaScript lento, fallido o bloqueado.
 *
 * Ahora el servidor renderiza todo visible (`data-reveal="static"`, sin CSS de
 * animación). Solo al montar, y solo para lo que está POR DEBAJO del viewport
 * —que el visitante todavía no puede ver— se pasa a `hidden` y se observa.
 * Si algo falla, el peor caso es que no haya animación; nunca que no haya
 * contenido.
 */
export function Reveal({
  children,
  /** Retardo escalonado en ms, para que una lista no aparezca toda de golpe. */
  delayMs = 0,
  className = '',
}: {
  children: ReactNode
  delayMs?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  /**
   * 'static' = sin animación, visible. Es el estado que se renderiza en el
   * servidor y el que se queda si algo va mal.
   */
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static')

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Sin soporte del navegador: se queda visible, sin animación.
    if (typeof IntersectionObserver === 'undefined') return

    // Quien pide menos animación no recibe ninguna. También se resuelve en CSS,
    // pero comprobarlo aquí evita incluso el cambio de estado.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Si el bloque ya está en pantalla al cargar, NO se anima: hacerlo
    // provocaría un parpadeo de contenido que el visitante ya estaba leyendo.
    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight) return

    // A partir de aquí: está por debajo del pliegue, así que ocultarlo no le
    // quita nada a nadie y la animación se ve al llegar.
    setState('hidden')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState('shown')
            // Una sola vez: no se re-anima al volver a pasar por encima.
            observer.disconnect()
          }
        }
      },
      // rootMargin negativo abajo: dispara cuando el bloque ya entró de verdad,
      // no cuando asoma un píxel.
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal={state}
      style={state === 'hidden' && delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  )
}
