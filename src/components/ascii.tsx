/**
 * RF-110 v2 — ASCII art.
 *
 * Dibujo hecho con caracteres, no con imágenes: cero peticiones de red, cero
 * bytes de asset y nada que pueda fallar al cargar.
 *
 * La primera versión era un campo de densidad generado (una cuña de bloques con
 * una onda). Se retiró porque no representaba nada: a ese tamaño se leía como
 * ruido de compresión, no como una pieza con intención. Lo sustituye un
 * diagrama que SÍ es reconocible y que además dice algo del perfil: las capas
 * de una aplicación con el control de seguridad que le corresponde a cada una.
 *
 * Dos reglas que condicionan la implementación:
 *
 *  1. SOLO ACRÓNIMOS TÉCNICOS. WWW, TLS, CSP, WAF, API, JWT, RBAC, DB, RLS se
 *     escriben igual en español y en inglés. Es lo que permite que el dibujo
 *     sea el mismo en las dos versiones del sitio sin convertirse en copy sin
 *     traducir, que es justo lo que este proyecto no permite (RF-109).
 *
 *  2. DECORATIVO. Va con `aria-hidden`: para un lector de pantalla, una caja
 *     dibujada con guiones es ruido. La misma idea está dicha en texto real en
 *     las prácticas del perfil y en el ángulo de seguridad de cada proyecto,
 *     así que no se pierde información por ocultarlo.
 */

/**
 * Capas de la aplicación, de fuera hacia dentro, con su control.
 *
 * Todas las líneas miden exactamente 20 caracteres y los conectores caen en la
 * misma columna: si editas una caja, cuenta los caracteres. Una sola columna
 * desalineada rompe el dibujo entero, y en monoespaciada se nota al instante.
 */
const STACK_DIAGRAM = [
  '┌──────────────────┐',
  '│       WWW        │',
  '└────────┬─────────┘',
  '         │ TLS',
  '┌────────▼─────────┐',
  '│   CSP  ·  WAF    │',
  '└────────┬─────────┘',
  '         │',
  '┌────────▼─────────┐',
  '│   API  ·  JWT    │',
  '│       RBAC       │',
  '└────────┬─────────┘',
  '         │',
  '┌────────▼─────────┐',
  '│   DB   ·  RLS    │',
  '└──────────────────┘',
].join('\n')

/**
 * Bloque decorativo del hero.
 *
 * Oculto por debajo de `lg` a propósito: RF-101 exige que el titular, la
 * propuesta de valor y los dos CTA se lean sin scroll en 375px, y cualquier
 * elemento extra consume ese presupuesto. En escritorio sobra sitio a la
 * derecha, así que ahí sí aparece.
 *
 * `ascii-scan` le pasa por encima una banda de luz que recorre el diagrama de
 * arriba abajo, como el barrido de un escáner. Es CSS puro sobre `transform`
 * (compuesto por la GPU, no provoca repintado de layout) y se desactiva sola
 * bajo `prefers-reduced-motion`.
 */
export function AsciiField() {
  return (
    <div
      aria-hidden="true"
      className="ascii-scan pointer-events-none hidden select-none lg:block"
    >
      <pre className="font-mono text-[0.78rem] leading-[1.15] text-accent/60">
        {STACK_DIAGRAM}
      </pre>
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
