/**
 * RF-110 — glifos de sección.
 *
 * SVG propio, trazado a mano, sin librería de iconos ni fuente de iconos: cero
 * peticiones de red, cero bytes extra de fuente. Cada glifo usa `currentColor`,
 * así que hereda el tono de la sección donde se coloca sin necesitar una prop
 * de color propia.
 *
 * Decorativos: el título ya dice de qué sección se trata, así que llevan
 * `aria-hidden` y no `focusable` para que un lector de pantalla no los anuncie.
 */

const common = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

/** Perfil: figura simple. */
export function ProfileIcon() {
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20c1.2-4 4-6 6.5-6s5.3 2 6.5 6" />
    </svg>
  )
}

/** Trayectoria: hitos sobre una línea. */
export function TimelineIcon() {
  return (
    <svg {...common}>
      <path d="M4 12h16" />
      <circle cx="6" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Proyectos: corchetes de código. */
export function ProjectsIcon() {
  return (
    <svg {...common}>
      <path d="M9 6 4 12l5 6" />
      <path d="M15 6l5 6-5 6" />
    </svg>
  )
}

/** Habilidades: capas apiladas. */
export function SkillsIcon() {
  return (
    <svg {...common}>
      <path d="M12 4 4 8l8 4 8-4-8-4Z" />
      <path d="M4 12l8 4 8-4" />
      <path d="M4 16l8 4 8-4" />
    </svg>
  )
}

/** Contacto: sobre de mensaje. */
export function ContactIcon() {
  return (
    <svg {...common}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}
