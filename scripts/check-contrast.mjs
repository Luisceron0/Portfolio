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
  ink: '#f5f3fa',
  inkMuted: '#aaa6b8',
  inkDim: '#3a3448',
  surface: '#09080d',
  surfaceCard: '#15121d',
  surfaceSubtle: '#1d1a27',
  abyss: '#130a26',
  abyssCard: '#1e1238',
  violet: '#7a1fff',
  violetHover: '#6420cf',
  warn: '#ffd23f',
  warnSurface: '#241d0c',
  toneViolet: '#b07cff',
  toneGreen: '#a6f13c',
  toneMint: '#5ef0a8',
  toneLilac: '#d7c4ff',
  toneSilver: '#c3c0cf',
}

/**
 * Fondos REALES compuestos. Las tarjetas de las bandas `abyss` son
 * `abyss-card` al 70-80% sobre `abyss`; se mide el caso al 70%, que es
 * el que más se aleja del par sólido.
 */
const ABYSS_CARD_EFFECTIVE = over(PALETTE.abyssCard, PALETTE.abyss, 0.7)

/**
 * El emblema del hero va detrás del texto en móvil al 15% de opacidad. Su
 * color más claro es el blanco de los tajos: ese es el caso peor para la letra
 * del hero. Si cambias `opacity-[0.15]` en hero.tsx, cambia esto.
 */
const EMBLEM_ALPHA = 0.15
const HERO_WORST = over(PALETTE.ink, PALETTE.surface, EMBLEM_ALPHA)

const TONE_KEYS = ['toneViolet', 'toneGreen', 'toneMint', 'toneLilac', 'toneSilver']

/** Cada par que el sitio realmente usa como texto sobre fondo. */
const PAIRS = [
  { label: 'ink sobre surface (texto principal)', fg: PALETTE.ink, bg: PALETTE.surface, min: 4.5 },
  { label: 'ink sobre surface-card (tarjetas de proyecto)', fg: PALETTE.ink, bg: PALETTE.surfaceCard, min: 4.5 },
  { label: 'ink sobre surface-subtle (entradas del formulario)', fg: PALETTE.ink, bg: PALETTE.surfaceSubtle, min: 4.5 },
  { label: 'ink-muted sobre surface', fg: PALETTE.inkMuted, bg: PALETTE.surface, min: 4.5 },
  { label: 'ink-muted sobre surface-card', fg: PALETTE.inkMuted, bg: PALETTE.surfaceCard, min: 4.5 },
  { label: 'ink-muted sobre surface-subtle', fg: PALETTE.inkMuted, bg: PALETTE.surfaceSubtle, min: 4.5 },

  // Bandas `abyss` (trayectoria, habilidades).
  { label: 'ink sobre abyss', fg: PALETTE.ink, bg: PALETTE.abyss, min: 4.5 },
  { label: 'ink-muted sobre abyss', fg: PALETTE.inkMuted, bg: PALETTE.abyss, min: 4.5 },
  { label: `ink-muted sobre tarjeta abyss REAL (${ABYSS_CARD_EFFECTIVE})`, fg: PALETTE.inkMuted, bg: ABYSS_CARD_EFFECTIVE, min: 4.5 },
  { label: 'ink-muted sobre abyss-card sólida', fg: PALETTE.inkMuted, bg: PALETTE.abyssCard, min: 4.5 },

  // Rellenos con letra encima: botones, etiquetas inclinadas, banda del CV.
  { label: 'ink sobre violet (botón primario, banda del CV, etiquetas)', fg: PALETTE.ink, bg: PALETTE.violet, min: 4.5 },
  { label: 'ink sobre violet-hover (botón primario en hover)', fg: PALETTE.ink, bg: PALETTE.violetHover, min: 4.5 },
  { label: 'ink sobre violet en tarjeta abyss (etiqueta de trayectoria)', fg: PALETTE.ink, bg: PALETTE.violet, min: 4.5 },
  { label: 'surface sobre ink (botón secundario en hover, caja del título)', fg: PALETTE.surface, bg: PALETTE.ink, min: 4.5 },
  { label: 'ink-muted sobre surface-subtle (botón deshabilitado)', fg: PALETTE.inkMuted, bg: PALETTE.surfaceSubtle, min: 4.5 },

  // Entrada de trayectoria invertida a blanco al pasar el ratón (LOAD DATA de P3R).
  { label: 'ink-dim sobre ink (texto secundario invertido)', fg: PALETTE.inkDim, bg: PALETTE.ink, min: 4.5 },
  { label: 'violet sobre ink (organización invertida)', fg: PALETTE.violet, bg: PALETTE.ink, min: 4.5 },

  // Hero con el emblema detrás (móvil).
  { label: `ink sobre hero con emblema detrás (${HERO_WORST}, caso peor)`, fg: PALETTE.ink, bg: HERO_WORST, min: 4.5 },
  { label: 'ink-muted sobre hero con emblema detrás (caso peor)', fg: PALETTE.inkMuted, bg: HERO_WORST, min: 4.5 },

  { label: 'warn sobre warn-surface (aviso [PENDIENTE])', fg: PALETTE.warn, bg: PALETTE.warnSurface, min: 4.5 },
  { label: 'ink sobre warn-surface (cuerpo del aviso)', fg: PALETTE.ink, bg: PALETTE.warnSurface, min: 4.5 },

  /*
   * Cada tono se usa como texto sobre negro, sobre tarjeta y sobre las bandas
   * `abyss`, y como relleno con letra `surface` encima (cursor de la nav,
   * pestañas de fecha, etiquetas, nota de rescate verde).
   */
  ...TONE_KEYS.flatMap((key) => [
    { label: `${key} sobre surface`, fg: PALETTE[key], bg: PALETTE.surface, min: 4.5 },
    { label: `${key} sobre surface-card`, fg: PALETTE[key], bg: PALETTE.surfaceCard, min: 4.5 },
    { label: `${key} sobre abyss`, fg: PALETTE[key], bg: PALETTE.abyss, min: 4.5 },
    { label: `${key} sobre tarjeta abyss REAL`, fg: PALETTE[key], bg: ABYSS_CARD_EFFECTIVE, min: 4.5 },
    { label: `surface sobre ${key} (relleno, letra oscura)`, fg: PALETTE.surface, bg: PALETTE[key], min: 4.5 },
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
