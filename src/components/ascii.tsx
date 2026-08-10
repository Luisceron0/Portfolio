/**
 * RF-110 v2 — fondo ASCII animado.
 *
 * Tercera versión, y la primera que se mueve. Vale la pena dejar por qué
 * fallaron las dos anteriores, porque explica la forma de esta:
 *
 *   1ª) Campo de densidad estático en la columna derecha del hero. Retirado:
 *       era abstracto Y estaba quieto Y ocupaba sitio como si fuera contenido,
 *       así que se leía como ruido de compresión.
 *   2ª) Diagrama de capas (WWW / TLS / CSP / API / DB). Tenía forma, pero es
 *       el dibujo que sale en cualquier presentación de infraestructura.
 *
 * Esta es abstracta otra vez, y esta vez está bien: se mueve y está DETRÁS del
 * contenido. Un fondo no tiene que representar nada, tiene que dar textura y
 * profundidad sin pedir atención. Lo que no podía hacer la primera versión era
 * ser abstracta ocupando el sitio de una pieza principal.
 *
 * Cómo se anima sin JavaScript ni frames apilados: el campo se genera con un
 * PERIODO VERTICAL exacto y se dibujan dos periodos seguidos. Desplazarlo un
 * 50% de su propia altura equivale a desplazarlo exactamente un periodo, así
 * que el final encaja con el principio y el bucle no tiene costura. Es un
 * único elemento animando `transform`, que compone la GPU: no recalcula layout
 * en ningún fotograma.
 */

/** Filas por periodo. La altura total es el doble, para poder desplazar uno. */
const PERIOD_ROWS = 40
const TOTAL_ROWS = PERIOD_ROWS * 2
const COLS = 150

/** De vacío a denso. El primer carácter es un espacio: la mayor parte respira. */
const RAMP = ' .:-=+*#'

/**
 * Interferencia de dos ondas.
 *
 * Ambos términos son periódicos en `y` con periodo `PERIOD_ROWS` (el segundo
 * lo es con la mitad, que también divide al total), y de ahí sale la costura
 * invisible. Si tocas las frecuencias, mantén esa propiedad o el bucle salta.
 */
function buildField(): string {
  const rows: string[] = []

  for (let y = 0; y < TOTAL_ROWS; y += 1) {
    const ny = y / PERIOD_ROWS
    let row = ''

    for (let x = 0; x < COLS; x += 1) {
      const nx = x / COLS

      const primary = Math.sin(2 * Math.PI * ny + 1.15 * Math.sin(2 * Math.PI * nx * 2))
      const secondary = Math.sin(4 * Math.PI * ny - 2 * Math.PI * nx * 3)
      const value = 0.62 * primary + 0.38 * secondary

      // Sesgo hacia lo vacío: sin esto el campo es una pared sólida de signos.
      const normalized = ((value + 1) / 2) ** 1.7
      row += RAMP[Math.round(normalized * (RAMP.length - 1))]
    }

    rows.push(row)
  }

  return rows.join('\n')
}

/** Se calcula una vez por proceso, no una por petición. */
const FIELD = buildField()

/**
 * Telón de fondo. Se coloca en un contenedor `relative` y se estira sobre él.
 *
 * `aria-hidden` y `select-none`: es textura, no contenido. Para un lector de
 * pantalla, doce mil signos de puntuación serían un desastre.
 *
 * No afecta a RF-101 aunque se muestre en móvil: al ir en posición absoluta no
 * aporta altura, así que no consume el presupuesto vertical del hero.
 */
export function AsciiBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="ascii-backdrop pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      <pre className="ascii-backdrop__field">{FIELD}</pre>
    </div>
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
      className={`select-none overflow-hidden whitespace-nowrap font-mono text-xs text-deco ${className}`}
    >
      {SPEC_RULE}
    </div>
  )
}
