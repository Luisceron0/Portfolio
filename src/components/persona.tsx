import type { CSSProperties } from 'react'

/**
 * RF-110 v3 — piezas decorativas del lenguaje Persona.
 *
 * Sustituyen al fondo ASCII de la v2. Todo es SVG o CSS propio: cero
 * peticiones de red, cero imágenes, cero dependencias. Todo es `aria-hidden`:
 * es textura y gesto, no información.
 */

/**
 * Estallido de puntas, el "golpe" de los cómics que P5R usa en cada aviso.
 * Puntas de longitud alterna para que no parezca un engranaje.
 */
function burstPoints(cx: number, cy: number, spikes: number, outer: number, inner: number) {
  const points: string[] = []
  for (let i = 0; i < spikes * 2; i += 1) {
    const isTip = i % 2 === 0
    const radius = isTip ? (i % 4 === 0 ? outer : outer * 0.82) : inner
    const angle = (Math.PI * i) / spikes - Math.PI / 2
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`)
  }
  return points.join(' ')
}

/** Se calcula una vez por proceso, no una por petición. */
const BURST = burstPoints(200, 200, 14, 190, 120)

/**
 * Emblema del hero: el estallido violeta de P5R girando muy despacio detrás de la
 * luna creciente verde de P3R, cruzados por dos tajos blancos.
 *
 * El color blanco y el gris del texto que se lea encima están medidos en
 * `check:contrast` con la opacidad que el hero le da en móvil. Si cambias la
 * opacidad allí, vuelve a medir.
 */
export function PersonaEmblem({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 400 400"
      className={`pointer-events-none select-none ${className}`}
    >
      <g className="p-spin">
        <polygon points={BURST} fill="#7a1fff" />
      </g>
      <polygon points="40,250 380,90 380,118 60,268" fill="#09080d" />
      <circle cx="210" cy="205" r="104" fill="#a6f13c" />
      <circle cx="248" cy="182" r="92" fill="#09080d" />
      <circle cx="210" cy="205" r="104" fill="none" stroke="#d7c4ff" strokeWidth="3" />
      <polygon points="10,330 390,150 392,162 14,346" fill="#f5f3fa" />
      <polygon points="60,372 300,262 302,270 64,384" fill="#f5f3fa" />
    </svg>
  )
}

/**
 * Cinta de texto en bucle, a sangre e inclinada. Se dibujan dos copias del
 * contenido y la pista se desplaza un 50%, así que el bucle no tiene costura
 * (ver `.p-marquee` en globals.css).
 *
 * `aria-hidden` porque repite texto que ya está en la página: para un lector
 * de pantalla sería la misma frase leída en bucle.
 */
export function Marquee({
  items,
  variant = 'violet',
}: {
  items: readonly string[]
  variant?: 'violet' | 'dark'
}) {
  const sequence = [...items, ...items, ...items]
  const isViolet = variant === 'violet'

  return (
    <div
      aria-hidden="true"
      className={`p-marquee ${isViolet ? '' : 'p-marquee--reverse'} select-none overflow-hidden whitespace-nowrap py-2.5 ${
        isViolet ? 'bg-violet text-ink' : 'border-y-2 border-tone-green bg-surface text-tone-green'
      }`}
    >
      <div className="p-marquee__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {sequence.map((item, index) => (
              <span
                key={`${copy}-${index}`}
                className="p-display flex items-center px-5 text-lg sm:text-2xl"
              >
                {item}
                <span className="ml-10 text-base">★</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Las dos cintas cruzadas que separan el hero del resto: violeta y negra con
 * verde, inclinadas en sentidos opuestos. El contenedor recorta lo que se
 * sale al girar, así que no genera scroll horizontal.
 */
export function CrossedMarquees({ items }: { items: readonly string[] }) {
  return (
    <div aria-hidden="true" className="relative overflow-hidden py-10 sm:py-14">
      <div className="-mx-8 -rotate-2">
        <Marquee items={items} variant="violet" />
      </div>
      <div className="-mx-8 -mt-3 rotate-[1.5deg]">
        <Marquee items={items} variant="dark" />
      </div>
    </div>
  )
}

/**
 * Fragmentos flotantes: los cristales que caen en el menú de pausa de P3R.
 *
 * Posiciones, tamaños y tiempos FIJOS, no aleatorios: un `Math.random` en un
 * componente de servidor daría un HTML distinto en cada petición y, si algún
 * día se hidratara, un desajuste servidor/cliente. Cada fragmento lleva sus
 * valores en variables CSS y la animación `.p-shard` hace el resto.
 */
const SHARDS = [
  { x: 8, y: 14, s: 14, r: 20, d: 0, t: 9, c: '#a6f13c' },
  { x: 22, y: 70, s: 9, r: -30, d: 1.8, t: 11, c: '#c3c0cf' },
  { x: 38, y: 30, s: 18, r: 45, d: 3.2, t: 13, c: '#d7c4ff' },
  { x: 55, y: 82, s: 11, r: 10, d: 0.6, t: 10, c: '#f5f3fa' },
  { x: 68, y: 12, s: 16, r: -15, d: 2.4, t: 12, c: '#b07cff' },
  { x: 80, y: 55, s: 10, r: 60, d: 4, t: 9.5, c: '#a6f13c' },
  { x: 92, y: 26, s: 13, r: -45, d: 1.1, t: 14, c: '#5ef0a8' },
  { x: 47, y: 52, s: 8, r: 30, d: 5.2, t: 8.5, c: '#f5f3fa' },
] as const

export function ShardField({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {SHARDS.map((shard, index) => (
        <span
          key={index}
          className="p-shard"
          style={
            {
              left: `${shard.x}%`,
              top: `${shard.y}%`,
              width: shard.s,
              height: shard.s * 1.6,
              background: shard.c,
              '--r': `${shard.r}deg`,
              animationDelay: `${shard.d}s`,
              animationDuration: `${shard.t}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/**
 * Rótulo gigante en vertical y en contorno que se desliza sin fin por el
 * borde de las bandas P3R, como el "MENU" lateral del menú de pausa.
 * Decorativo y muy tenue: nunca queda texto real encima sin un panel opaco.
 */
export function VerticalWatermark({ text }: { text: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-36 select-none overflow-hidden lg:block"
    >
      <div className="p-vertical-track">
        {[0, 1].map((copy) => (
          <span key={copy} className="p-display p-vertical block text-[9rem] leading-none">
            {text} {text}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Regla cortada en diagonal: violeta, blanco, verde y el resto en gris. */
export function SlashRule({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex h-2 gap-1.5 ${className}`}>
      <span className="w-16 -skew-x-[30deg] bg-violet" />
      <span className="w-4 -skew-x-[30deg] bg-ink" />
      <span className="w-8 -skew-x-[30deg] bg-tone-green" />
      <span className="flex-1 -skew-x-[30deg] bg-hairline" />
    </div>
  )
}
