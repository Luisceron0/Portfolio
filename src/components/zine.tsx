import type { CSSProperties, ReactNode } from 'react'

/**
 * RF-110 v5 — adornos del zine, dibujados a mano en el código.
 *
 * Todos son SVG inline, `aria-hidden`, sin eventos de puntero y sin assets de
 * terceros. Los trazos son irregulares a propósito (curvas con variación,
 * `stroke-linecap="round"`, grosores distintos): un adorno geométrico perfecto
 * es una pieza de pantalla, no de papel.
 *
 * Límite de caos: como máximo 3 adornos (brochazo, garabato o salpicadura)
 * por pantalla. Las cintas y las grapas no cuentan: son construcción.
 *
 * Los trazos que "se dibujan" al revelarse llevan `pathLength={1}` y la clase
 * `p-draw` (globals.css): animan `stroke-dashoffset`, nunca filtros.
 */

const base = {
  'aria-hidden': true,
  focusable: false,
} as const

function cls(extra = '') {
  return `pointer-events-none select-none ${extra}`
}

/** Brochazo de rotulador, estirable a lo ancho (reglas, subrayados). */
export function BrushStroke({
  className = '',
  color = '#f2efe8',
  draw = false,
}: {
  className?: string
  color?: string
  draw?: boolean
}) {
  return (
    <svg
      {...base}
      viewBox="0 0 300 18"
      preserveAspectRatio="none"
      className={cls(`${draw ? 'p-draw' : ''} ${className}`)}
    >
      <path
        pathLength={1}
        d="M3 11.5c22-4.6 44-5.4 70-3.8 31 1.9 56 3.9 88 1.3 33-2.7 60-5.1 91-2.2 15 1.4 30 3.6 45 3.4"
        fill="none"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        pathLength={1}
        d="M28 13.6c40-2.4 82-1.6 122-.6 38 1 78-.8 114-2.9"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

/** Garabato de margen: una espiral apurada. */
export function Scribble({ className = '', color = '#5a1257' }: { className?: string; color?: string }) {
  return (
    <svg {...base} viewBox="0 0 80 60" className={cls(`p-draw ${className}`)}>
      <path
        pathLength={1}
        d="M8 40c6-14 22-28 34-24 10 3 4 18-6 20-9 2-12-9-4-16 9-8 26-9 33 1 7 10-2 25-16 29-16 4-34-3-37-15"
        fill="none"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Salpicadura en estrella de tinta: el "golpe" del zine. */
export function SplatStar({ className = '', color = '#0b0a0f' }: { className?: string; color?: string }) {
  return (
    <svg {...base} viewBox="0 0 200 200" className={cls(className)}>
      <path
        fill={color}
        d="M101 6c7 22 6 42 17 52 12-10 30-22 52-26-12 18-26 34-28 47 18 1 38 4 52 12-20 4-41 6-52 14 12 14 22 32 25 52-17-12-31-27-45-30-4 19-10 38-21 52-3-20-1-40-9-51-15 9-33 22-55 25 12-17 27-32 30-45-19-3-40-8-56-19 21-1 43-2 55-9-10-15-18-33-20-52 16 11 31 25 44 28 4-19 8-38 11-52Z"
      />
      <circle cx="170" cy="40" r="6" fill={color} />
      <circle cx="28" cy="164" r="4.5" fill={color} />
      <circle cx="182" cy="150" r="3.5" fill={color} />
    </svg>
  )
}

/** Flecha dibujada a rotulador (hacia abajo por defecto). */
export function ArrowDoodle({
  className = '',
  color = 'currentColor',
  direction = 'down',
}: {
  className?: string
  color?: string
  direction?: 'down' | 'left' | 'right'
}) {
  const rotate = direction === 'down' ? 0 : direction === 'left' ? 90 : -90
  return (
    <svg
      {...base}
      viewBox="0 0 40 48"
      className={cls(`p-draw ${className}`)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        pathLength={1}
        d="M19 3c2 9 0 18 1.5 27 .6 4 .4 7 0 11"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        pathLength={1}
        d="M8 30c4 4 8 8 12.5 12.5 3.6-5 7.8-9.6 11.6-13.4"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Tachón en X, al final de una regla. */
export function CrossOut({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg {...base} viewBox="0 0 30 30" className={cls(className)}>
      <path d="M5 6c6 5 13 11 20 19M25 5c-6 6-12 13-19 20" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

/** Check a mano. */
export function HandCheck({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg {...base} viewBox="0 0 20 20" className={cls(className)}>
      <path d="M2.6 11.1c1.4 1 2.6 2.4 3.9 4.6 2.3-5 5.6-9 10.9-12.6" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Asterisco a mano. */
export function HandAsterisk({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg {...base} viewBox="0 0 20 20" className={cls(className)}>
      <path
        d="M10.3 2.2c-.3 2.6-.1 5.4.2 8.1M10.6 10.4c-.2 2.5.1 5 .4 7.4M3.4 6.1c2.4 1.2 4.7 2.7 7 4.1M10.4 10.2c2.2 1.6 4.4 2.8 6.6 3.7M16.6 5.4c-2.1 1.5-4.2 3.3-6.2 4.8M10.4 10.2c-2.3 1.4-4.6 3-6.8 4.6"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Grapa metálica con su línea de luz (18 x 6). */
export function Staple({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg {...base} viewBox="0 0 18 6" width="18" height="6" className={cls(`absolute ${className}`)} style={style}>
      <path d="M1 5V1.6C1 1.2 1.3 1 1.7 1h14.6c.4 0 .7.2.7.6V5" fill="none" stroke="#8d8a92" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2.4 1.6h12.8" stroke="#f2efe8" strokeWidth="0.6" opacity="0.7" />
    </svg>
  )
}

/** Chincheta magenta vista desde arriba (timeline). */
export function Pushpin({ className = '' }: { className?: string }) {
  return (
    <svg {...base} viewBox="0 0 24 24" className={cls(className)}>
      <ellipse cx="13" cy="15" rx="7" ry="3" fill="#0b0a0f" opacity="0.35" />
      <circle cx="12" cy="11" r="7.5" fill="#d903d5" />
      <circle cx="12" cy="11" r="7.5" fill="none" stroke="#5a1257" strokeWidth="1.4" />
      <path d="M8.6 8.2c1-1.4 2.6-2 4.2-1.8" stroke="#f2efe8" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" fill="none" />
    </svg>
  )
}

/** Borde rasgado horizontal, para coser al pie o a la cabeza de una tira. */
export function TornEdge({
  className = '',
  color = '#d903d5',
  flip = false,
}: {
  className?: string
  color?: string
  flip?: boolean
}) {
  return (
    <svg
      {...base}
      viewBox="0 0 400 10"
      preserveAspectRatio="none"
      className={cls(className)}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path
        fill={color}
        d="M0 0h400v4l-9 3-11-4-8 5-13-3-10 4-12-5-9 4-14-2-8 3-12-4-10 5-11-3-9 2-13-4-8 5-12-3-11 4-9-3-14 2-8-4-12 5-10-3-11 3-9-4-13 5-8-3-12 2-10-4-11 5-9-2-14 3-8-4-12 4-10-3-9 4-13-4-8 3-11-2-12 4-9-3-10 3V0Z"
      />
    </svg>
  )
}

/** Círculo de rotulador que no cierra: rodea iconos y la "A" del menú. */
export function MarkerCircle({
  className = '',
  color = 'currentColor',
  children,
}: {
  className?: string
  color?: string
  children?: ReactNode
}) {
  return (
    <span aria-hidden="true" className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 40 40" className="pointer-events-none absolute inset-0 h-full w-full" focusable="false">
        <path
          d="M30 7c-6-4-15-4-21 1-6 5-7 14-4 20 3 7 11 10 18 9 8-1 13-7 13-15 0-6-3-10-7-13-3-2-7-3-11-2"
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  )
}

/** Trozo de cinta adhesiva pegado en una esquina. */
export function Tape({ className = '', rotate = -6 }: { className?: string; rotate?: number }) {
  return (
    <span
      aria-hidden="true"
      className={`m-tape ${className}`}
      style={{ '--tape-r': `${rotate}deg` } as CSSProperties}
    />
  )
}
