/**
 * RF-110 v5 — glifos de sección, a rotulador.
 *
 * SVG propio, trazado a mano con curvas irregulares y grosor de rotulador, sin
 * librería ni fuente de iconos. Cada glifo usa `currentColor` y va dentro de
 * un `MarkerCircle` (section.tsx), no de un cuadro con borde.
 *
 * Decorativos: el título ya dice de qué sección se trata.
 */

const common = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

/** Perfil: figura simple. */
export function ProfileIcon() {
  return (
    <svg {...common}>
      <path d="M12.2 4.6c2 .1 3.3 1.6 3.2 3.5-.1 2-1.6 3.4-3.5 3.3-1.9-.1-3.2-1.7-3.1-3.6.2-1.9 1.6-3.3 3.4-3.2Z" />
      <path d="M5.4 19.6c.9-3.6 3.6-5.9 6.7-5.8 3.2.1 5.6 2.4 6.5 6" />
    </svg>
  )
}

/** Trayectoria: hitos sobre una línea. */
export function TimelineIcon() {
  return (
    <svg {...common}>
      <path d="M3.6 12.4c5.4-.6 11-.4 16.8.2" />
      <path d="M6.2 10.2v4M12 9.8v4.6M17.8 10.4v3.8" />
    </svg>
  )
}

/** Proyectos: corchetes de código. */
export function ProjectsIcon() {
  return (
    <svg {...common}>
      <path d="M9.2 5.6c-1.8 2.2-3.4 4.2-4.8 6.5 1.5 2 3.1 4 4.9 6.1" />
      <path d="M14.8 5.8c1.9 2 3.5 4 4.9 6.2-1.4 2.2-3 4.2-4.8 6.2" />
    </svg>
  )
}

/** Habilidades: capas apiladas. */
export function SkillsIcon() {
  return (
    <svg {...common}>
      <path d="M12.1 4.2c-2.7 1.2-5.3 2.5-7.9 3.9 2.6 1.4 5.2 2.7 8 3.8 2.6-1.2 5.2-2.5 7.6-3.9-2.6-1.3-5.1-2.6-7.7-3.8Z" />
      <path d="M4.3 12.2c2.6 1.3 5.2 2.6 7.9 3.7 2.7-1.1 5.3-2.4 7.7-3.8" />
      <path d="M4.5 16.1c2.5 1.3 5 2.5 7.7 3.7 2.6-1.1 5.1-2.3 7.5-3.7" />
    </svg>
  )
}

/** Contacto: sobre de mensaje. */
export function ContactIcon() {
  return (
    <svg {...common}>
      <path d="M4 6.2c5.4-.4 10.7-.3 16 .1.3 3.9.2 7.8-.1 11.6-5.3.3-10.6.3-15.8-.1-.3-3.8-.3-7.7-.1-11.6Z" />
      <path d="M4.5 7c2.5 2 5 3.9 7.6 5.8 2.6-1.9 5.1-3.8 7.4-5.9" />
    </svg>
  )
}
