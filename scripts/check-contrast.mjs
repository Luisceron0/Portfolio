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
 * Hace falta porque `.card-surface` (RF-110) no es opaca: es blanco cálido al
 * 82% sobre el lienzo de papel. Medir el contraste contra el hex nominal daría
 * un número que no es el que ve nadie. Esto calcula el color real resultante.
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
  ink: '#211d16',
  inkMuted: '#6b6255',
  accent: '#322d84',
  accentHover: '#26215f',
  surface: '#f7f2ea',
  surfaceCard: '#fffdfa',
  surfaceSubtle: '#efe6d8',
  warn: '#854d0e',
  warnSurface: '#fdf3e0',
  // RF-110: tonos de sección y de proyecto. No son decorativos: llevan texto.
  toneTeal: '#0f6459',
  tonePlum: '#6d2a63',
  toneRust: '#9c3f2a',
  toneOchre: '#8a5310',
  // RF-110: superficie "consola" (tarjeta oscura de ángulo de seguridad) y sus
  // variantes claras de tono, pensadas específicamente para ese fondo oscuro.
  consoleBg: '#211d16',
  consoleText: '#efe6d5',
  consoleMuted: '#b8ab93',
  toneBrightIndigo: '#a29cf2',
  toneBrightTeal: '#4fd6c4',
  toneBrightPlum: '#e08fd6',
  toneBrightRust: '#f2896a',
  toneBrightOchre: '#f0b93d',
}

/**
 * Color REAL de una tarjeta: `.card-surface` es blanco cálido al 82% sobre el
 * lienzo (RF-110), no un color sólido. Se compone aquí para medir lo que de
 * verdad ve un visitante, no el hex nominal.
 */
const CARD_EFFECTIVE = over(PALETTE.surfaceCard, PALETTE.surface, 0.82)

/** Cada par que el sitio realmente usa como texto sobre fondo. */
const PAIRS = [
  { label: 'ink sobre surface (texto principal, lienzo)', fg: PALETTE.ink, bg: PALETTE.surface, min: 4.5 },
  { label: 'ink sobre surface-card (texto en tarjetas)', fg: PALETTE.ink, bg: PALETTE.surfaceCard, min: 4.5 },
  {
    label: `ink sobre tarjeta REAL compuesta al 82% (${CARD_EFFECTIVE})`,
    fg: PALETTE.ink,
    bg: CARD_EFFECTIVE,
    min: 4.5,
  },
  {
    label: 'ink-muted sobre tarjeta REAL compuesta al 82%',
    fg: PALETTE.inkMuted,
    bg: CARD_EFFECTIVE,
    min: 4.5,
  },
  {
    label: 'accent sobre tarjeta REAL compuesta al 82%',
    fg: PALETTE.accent,
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
    label: 'ink-muted sobre surface-subtle (CV, footer)',
    fg: PALETTE.inkMuted,
    bg: PALETTE.surfaceSubtle,
    min: 4.5,
  },
  { label: 'accent sobre surface (enlaces, botón secundario)', fg: PALETTE.accent, bg: PALETTE.surface, min: 4.5 },
  {
    label: 'accent sobre surface-card (enlaces en tarjetas)',
    fg: PALETTE.accent,
    bg: PALETTE.surfaceCard,
    min: 4.5,
  },
  { label: 'blanco cálido sobre accent (botón primario)', fg: PALETTE.surfaceCard, bg: PALETTE.accent, min: 4.5 },
  { label: 'blanco cálido sobre accent-hover (botón primario, hover)', fg: PALETTE.surfaceCard, bg: PALETTE.accentHover, min: 4.5 },
  { label: 'warn sobre warn-surface (aviso [PENDIENTE])', fg: PALETTE.warn, bg: PALETTE.warnSurface, min: 4.5 },

  /*
   * RF-110: los tonos de sección y de proyecto NO son decorativos, llevan
   * texto (números de sección, kickers, encabezados de grupo, enlaces). Cada
   * uno se mide sobre los dos fondos donde realmente aparece.
   */
  ...["toneTeal", "tonePlum", "toneRust", "toneOchre"].flatMap((key) => [
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
  ]),

  /*
   * RF-110: superficie "consola" — tarjeta oscura del ángulo de seguridad.
   * Bloque aparte porque el fondo no es ninguno de los anteriores.
   */
  { label: 'console-text sobre console-bg (cuerpo de la terminal)', fg: PALETTE.consoleText, bg: PALETTE.consoleBg, min: 4.5 },
  { label: 'console-muted sobre console-bg (prompt, metadatos)', fg: PALETTE.consoleMuted, bg: PALETTE.consoleBg, min: 4.5 },
  ...["toneBrightIndigo", "toneBrightTeal", "toneBrightPlum", "toneBrightRust", "toneBrightOchre"].map((key) => ({
    label: `${key} sobre console-bg (encabezado de terminal)`,
    fg: PALETTE[key],
    bg: PALETTE.consoleBg,
    min: 4.5,
  })),
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
console.log('\ncheck:contrast — todos los pares cumplen AA.')
