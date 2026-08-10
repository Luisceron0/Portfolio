#!/usr/bin/env node
/**
 * Verifica en frío los ratios de contraste que tailwind.config.ts AFIRMA que
 * cumplen WCAG AA.
 *
 * Existe porque ese archivo tenía un comentario ("cumplen WCAG AA >=4.5:1")
 * que citaba un test (`e2e/accessibility.spec.ts`) que nunca se escribió. Los
 * números estaban calculados de memoria, no medidos. Ver tasks/lessons.md.
 *
 * Fórmula de contraste relativo: WCAG 2.x, relative luminance + ratio.
 * https://www.w3.org/TR/WCAG21/#contrast-minimum
 *
 * Uso: npm run check:contrast
 */

/** @param {string} hex */
function relativeLuminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const linear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexA)
  const lB = relativeLuminance(hexB)
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA]
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Compone un color semitransparente sobre un fondo y devuelve el hex efectivo.
 *
 * Hace falta porque `.card-surface` no es opaca: es la superficie de tarjeta al
 * 72% sobre el lienzo. Medir el contraste contra el hex nominal daría un número
 * que no ve nadie. Esto calcula el color real resultante.
 */
function over(foregroundHex, backgroundHex, alpha) {
  const channel = (hex, index) => parseInt(hex.slice(index, index + 2), 16)
  const mixed = [1, 3, 5].map((index) => {
    const value =
      alpha * channel(foregroundHex, index) + (1 - alpha) * channel(backgroundHex, index)
    return Math.round(value).toString(16).padStart(2, '0')
  })
  return `#${mixed.join('')}`
}

// Los mismos valores hex que tailwind.config.ts. Si uno cambia allá y no
// aquí, este script deja de reflejar la realidad — es la razón por la que
// tailwind.config.ts enlaza a este archivo en su comentario.
const PALETTE = {
  ink: '#ededea',
  inkMuted: '#9c9c98',
  surface: '#0b0b0c',
  surfaceCard: '#131315',
  surfaceSubtle: '#1a1a1d',
  accent: '#a29cf2',
  accentHover: '#b8b3f6',
  warn: '#f0b93d',
  warnSurface: '#241d0c',
  // Tonos de sección y de proyecto. No son decorativos: llevan texto.
  toneIndigo: '#a29cf2',
  toneTeal: '#4fd6c4',
  tonePlum: '#e08fd6',
  toneRust: '#f2896a',
  toneOchre: '#f0b93d',
}

/**
 * `deco` (#55555a) NO se mide aquí, y es intencionado: no alcanza 4.5:1 contra
 * ningún fondo del sitio. Solo se usa en la rejilla del lienzo, el ASCII art y
 * las marcas de corte, todo `aria-hidden` y sin una sola letra de contenido.
 * Para texto secundario el token es `ink.muted`, que sí se mide abajo.
 */

/**
 * Color REAL de una tarjeta: `.card-surface` es la superficie de tarjeta al 72%
 * sobre el lienzo, no un color sólido. Se compone aquí para medir lo que de
 * verdad ve un visitante, no el hex nominal.
 */
const CARD_EFFECTIVE = over(PALETTE.surfaceCard, PALETTE.surface, 0.72)

/**
 * Fondo efectivo del hero con el ASCII animado detrás.
 *
 * El texto del hero se lee ENCIMA de ese campo, así que el fondo real no es el
 * lienzo limpio. Se mide el caso peor: el carácter más denso de la rampa, a la
 * opacidad declarada en `.ascii-backdrop__field` (globals.css), cubriendo el
 * 100% de la celda. Un glifo real nunca la cubre entera, así que el ratio de
 * verdad es mejor que este. Si subes esa opacidad, este número baja.
 */
const ASCII_BACKDROP_ALPHA = 0.13
const HERO_EFFECTIVE = over(PALETTE.accent, PALETTE.surface, ASCII_BACKDROP_ALPHA)

const TONE_KEYS = ['toneIndigo', 'toneTeal', 'tonePlum', 'toneRust', 'toneOchre']

/** Cada par que el sitio realmente usa como texto sobre fondo. */
const PAIRS = [
  { label: 'ink sobre surface (texto principal, lienzo)', fg: PALETTE.ink, bg: PALETTE.surface, min: 4.5 },
  { label: 'ink sobre surface-card (texto en tarjetas)', fg: PALETTE.ink, bg: PALETTE.surfaceCard, min: 4.5 },
  { label: 'ink sobre surface-subtle (paneles de spec, entradas)', fg: PALETTE.ink, bg: PALETTE.surfaceSubtle, min: 4.5 },
  {
    label: `ink sobre tarjeta REAL compuesta al 72% (${CARD_EFFECTIVE})`,
    fg: PALETTE.ink,
    bg: CARD_EFFECTIVE,
    min: 4.5,
  },
  {
    label: 'ink-muted sobre surface (texto secundario, lienzo)',
    fg: PALETTE.inkMuted,
    bg: PALETTE.surface,
    min: 4.5,
  },
  {
    label: 'ink-muted sobre tarjeta REAL compuesta al 72%',
    fg: PALETTE.inkMuted,
    bg: CARD_EFFECTIVE,
    min: 4.5,
  },
  {
    label: 'ink-muted sobre surface-subtle (pistas, metadatos)',
    fg: PALETTE.inkMuted,
    bg: PALETTE.surfaceSubtle,
    min: 4.5,
  },
  { label: 'accent sobre surface (enlaces)', fg: PALETTE.accent, bg: PALETTE.surface, min: 4.5 },
  {
    label: 'accent sobre tarjeta REAL compuesta al 72%',
    fg: PALETTE.accent,
    bg: CARD_EFFECTIVE,
    min: 4.5,
  },
  /*
   * Botón primario invertido: sobre lienzo oscuro el relleno es el color claro
   * y la letra es el propio lienzo. Es la inversión que impone el tema oscuro.
   */
  { label: 'surface sobre accent (botón primario, letra oscura)', fg: PALETTE.surface, bg: PALETTE.accent, min: 4.5 },
  { label: 'surface sobre accent-hover (botón primario, hover)', fg: PALETTE.surface, bg: PALETTE.accentHover, min: 4.5 },
  /*
   * Hero con el fondo ASCII animado detrás. Caso peor: carácter más denso a
   * plena cobertura. Es el par que decide hasta dónde puede subir la opacidad
   * del telón de fondo.
   */
  {
    label: `ink sobre hero con ASCII detrás (${HERO_EFFECTIVE}, caso peor)`,
    fg: PALETTE.ink,
    bg: HERO_EFFECTIVE,
    min: 4.5,
  },
  {
    label: 'ink-muted sobre hero con ASCII detrás (caso peor)',
    fg: PALETTE.inkMuted,
    bg: HERO_EFFECTIVE,
    min: 4.5,
  },
  { label: 'warn sobre warn-surface (aviso [PENDIENTE])', fg: PALETTE.warn, bg: PALETTE.warnSurface, min: 4.5 },
  { label: 'ink sobre warn-surface (cuerpo del aviso)', fg: PALETTE.ink, bg: PALETTE.warnSurface, min: 4.5 },

  /*
   * Los tonos de sección y de proyecto NO son decorativos, llevan texto
   * (números de sección, kickers, encabezados de grupo, enlaces). Cada uno se
   * mide sobre los tres fondos donde realmente aparece, más el caso invertido
   * de botón relleno.
   */
  ...TONE_KEYS.flatMap((key) => [
    {
      label: `${key} sobre surface (número de sección, viñetas)`,
      fg: PALETTE[key],
      bg: PALETTE.surface,
      min: 4.5,
    },
    {
      label: `${key} sobre tarjeta REAL compuesta`,
      fg: PALETTE[key],
      bg: CARD_EFFECTIVE,
      min: 4.5,
    },
    {
      label: `${key} sobre surface-subtle (panel de spec)`,
      fg: PALETTE[key],
      bg: PALETTE.surfaceSubtle,
      min: 4.5,
    },
    {
      label: `surface sobre ${key} (botón relleno, letra oscura)`,
      fg: PALETTE.surface,
      bg: PALETTE[key],
      min: 4.5,
    },
  ]),
]

let failed = false
console.log('check:contrast — ratios reales (WCAG AA texto normal >= 4.5:1)\n')
for (const { label, fg, bg, min } of PAIRS) {
  const ratio = contrastRatio(fg, bg)
  const ok = ratio >= min
  if (!ok) failed = true
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${ratio.toFixed(2)}:1  ${label}`)
}

if (failed) {
  console.error('\ncheck:contrast — al menos un par no alcanza 4.5:1. Corrígelo antes de afirmarlo.')
  process.exit(1)
}
console.log(`\ncheck:contrast — ${PAIRS.length} pares, todos cumplen AA.`)
