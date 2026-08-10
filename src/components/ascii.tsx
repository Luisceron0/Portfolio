/**
 * RF-110 v2 — ASCII art generativo.
 *
 * Dibujo hecho con caracteres, no con imágenes: cero peticiones de red, cero
 * bytes de asset y nada que pueda fallar al cargar. Encaja con el registro de
 * ficha técnica del resto de la página.
 *
 * Dos reglas que condicionan la implementación:
 *
 *  1. DETERMINISTA. Ni un `Math.random()`. El dibujo es una función pura de la
 *     posición, así que el servidor y el cliente producen exactamente los
 *     mismos caracteres y React no tiene nada que reconciliar. Con contenido
 *     aleatorio esto sería un error de hidratación en cuanto se renderizara en
 *     ambos lados.
 *
 *  2. DECORATIVO. Todo va con `aria-hidden`: para un lector de pantalla, una
 *     retícula de bloques Unicode es ruido puro, no información. Por el mismo
 *     motivo no lleva texto: sería copy sin traducir en un sitio bilingüe.
 *
 * Se calcula una sola vez por proceso (constante a nivel de módulo), no una vez
 * por petición, aunque la página sea `force-dynamic`.
 */

/** Rampa de densidad, de vacío a sólido. */
const RAMP = ' ░▒▓█'

/**
 * Campo de densidad: una diagonal atravesada por una onda suave. La diagonal
 * da dirección de lectura y la onda evita que parezca un degradado plano.
 */
function buildField(cols: number, rows: number): readonly string[] {
  const lines: string[] = []

  for (let y = 0; y < rows; y += 1) {
    let line = ''
    for (let x = 0; x < cols; x += 1) {
      const nx = x / (cols - 1)
      const ny = y / (rows - 1)

      const wave = Math.sin(nx * Math.PI * 1.6 + ny * Math.PI * 0.9)
      const density = 1 - (nx * 0.72 + ny * 0.5) + wave * 0.2
      const clamped = Math.min(1, Math.max(0, density))

      line += RAMP[Math.round(clamped * (RAMP.length - 1))]
    }
    lines.push(line)
  }

  return lines
}

const HERO_FIELD = buildField(26, 22).join('\n')

/**
 * Bloque decorativo del hero.
 *
 * Oculto por debajo de `lg` a propósito: RF-101 exige que el titular, la
 * propuesta de valor y los dos CTA se lean sin scroll en 375px, y cualquier
 * elemento extra consume ese presupuesto. En escritorio sobra sitio a la
 * derecha, así que ahí sí aparece.
 */
export function AsciiField() {
  return (
    <pre
      aria-hidden="true"
      // Tintado con el índigo de marca en vez de gris plano: a este tamaño un
      // gris neutro se lee como ruido de compresión, y el tinte lo convierte en
      // un elemento con intención. Al ser decoración `aria-hidden`, el mínimo
      // de contraste de WCAG no le aplica.
      className="pointer-events-none hidden select-none font-mono text-[0.72rem] leading-[0.78] text-accent/30 lg:block"
    >
      {HERO_FIELD}
    </pre>
  )
}

/**
 * Regla acotada, como la de un plano: extremos cerrados y marcas intermedias.
 * Se construye con caracteres de dibujo de caja en vez de con bordes CSS
 * porque aquí el propio carácter es el lenguaje visual.
 */
const SPEC_RULE = `├${'─'.repeat(14)}┼${'─'.repeat(14)}┼${'─'.repeat(14)}┤`

export function SpecRule({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden select-none whitespace-nowrap font-mono text-xs text-deco ${className}`}
    >
      {SPEC_RULE}
    </div>
  )
}
