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
  ink: '#f5f5f2',
  inkMuted: '#a8a8b0',
  surface: '#08080a',
  surfaceCard: '#141418',
  surfaceSubtle: '#1c1c22',
  midnight: '#0b1430',
  midnightCard: '#111d42',
  blood: '#c8101b',
  bloodHover: '#a80d16',
  royal: '#1a54d1',
  accent: '#ff4552',
  warn: '#ffd23f',
  warnSurface: '#241d0c',
  toneRed: '#ff4552',
  toneCyan: '#4fe0ff',
  toneGold: '#ffd23f',
  toneBlue: '#7ea6ff',
  tonePink: '#ff7ab0',
}

/**
 * Fondos REALES compuestos. Las tarjetas de las bandas P3R son
 * `midnight-card` al 70-80% sobre `midnight`; se mide el caso al 70%, que es
 * el que más se aleja del par sólido.
 */
const MIDNIGHT_CARD_EFFECTIVE = over(PALETTE.midnightCard, PALETTE.midnight, 0.7)

/**
 * El emblema del hero va detrás del texto en móvil al 15% de opacidad. Su
 * color más claro es el blanco de los tajos: ese es el caso peor para la letra
 * del hero. Si cambias `opacity-[0.15]` en hero.tsx, cambia esto.
 */
const EMBLEM_ALPHA = 0.15
const HERO_WORST = over(PALETTE.ink, PALETTE.surface, EMBLEM_ALPHA)

const TONE_KEYS = ['toneRed', 'toneCyan', 'toneGold', 'toneBlue', 'tonePink']

/** Cada par que el sitio realmente usa como texto sobre fondo. */
const PAIRS = [
  { label: 'ink sobre surface (texto principal)', fg: PALETTE.ink, bg: PALETTE.surface, min: 4.5 },
  { label: 'ink sobre surface-card (tarjetas de proyecto)', fg: PALETTE.ink, bg: PALETTE.surfaceCard, min: 4.5 },
  { label: 'ink sobre surface-subtle (entradas del formulario)', fg: PALETTE.ink, bg: PALETTE.surfaceSubtle, min: 4.5 },
  { label: 'ink-muted sobre surface', fg: PALETTE.inkMuted, bg: PALETTE.surface, min: 4.5 },
  { label: 'ink-muted sobre surface-card', fg: PALETTE.inkMuted, bg: PALETTE.surfaceCard, min: 4.5 },
  { label: 'ink-muted sobre surface-subtle', fg: PALETTE.inkMuted, bg: PALETTE.surfaceSubtle, min: 4.5 },

  // Bandas P3R (trayectoria, habilidades).
  { label: 'ink sobre midnight', fg: PALETTE.ink, bg: PALETTE.midnight, min: 4.5 },
  { label: 'ink-muted sobre midnight', fg: PALETTE.inkMuted, bg: PALETTE.midnight, min: 4.5 },
  { label: `ink-muted sobre tarjeta midnight REAL (${MIDNIGHT_CARD_EFFECTIVE})`, fg: PALETTE.inkMuted, bg: MIDNIGHT_CARD_EFFECTIVE, min: 4.5 },
  { label: 'ink-muted sobre midnight-card sólida', fg: PALETTE.inkMuted, bg: PALETTE.midnightCard, min: 4.5 },

  // Rellenos con letra encima: botones, etiquetas inclinadas, banda del CV.
  { label: 'ink sobre blood (botón primario, banda del CV, etiquetas)', fg: PALETTE.ink, bg: PALETTE.blood, min: 4.5 },
  { label: 'ink sobre blood-hover (botón primario en hover)', fg: PALETTE.ink, bg: PALETTE.bloodHover, min: 4.5 },
  { label: 'ink sobre royal (etiquetas azules)', fg: PALETTE.ink, bg: PALETTE.royal, min: 4.5 },
  { label: 'surface sobre ink (botón secundario en hover, caja del título)', fg: PALETTE.surface, bg: PALETTE.ink, min: 4.5 },
  { label: 'ink-muted sobre surface-subtle (botón deshabilitado)', fg: PALETTE.inkMuted, bg: PALETTE.surfaceSubtle, min: 4.5 },

  // Entrada de trayectoria invertida a blanco al pasar el ratón (LOAD DATA de P3R).
  { label: 'ink-dim sobre ink (texto secundario invertido)', fg: '#3d3d48', bg: PALETTE.ink, min: 4.5 },
  { label: 'royal sobre ink (organización invertida)', fg: PALETTE.royal, bg: PALETTE.ink, min: 4.5 },

  // Hero con el emblema detrás (móvil).
  { label: `ink sobre hero con emblema detrás (${HERO_WORST}, caso peor)`, fg: PALETTE.ink, bg: HERO_WORST, min: 4.5 },
  { label: 'ink-muted sobre hero con emblema detrás (caso peor)', fg: PALETTE.inkMuted, bg: HERO_WORST, min: 4.5 },

  { label: 'warn sobre warn-surface (aviso [PENDIENTE])', fg: PALETTE.warn, bg: PALETTE.warnSurface, min: 4.5 },
  { label: 'ink sobre warn-surface (cuerpo del aviso)', fg: PALETTE.ink, bg: PALETTE.warnSurface, min: 4.5 },

  /*
   * Cada tono se usa como texto sobre negro, sobre tarjeta y sobre las bandas
   * azules, y como relleno con letra `surface` encima (cursor de la nav,
   * pestañas de fecha, etiquetas).
   */
  ...TONE_KEYS.flatMap((key) => [
    { label: `${key} sobre surface`, fg: PALETTE[key], bg: PALETTE.surface, min: 4.5 },
    { label: `${key} sobre surface-card`, fg: PALETTE[key], bg: PALETTE.surfaceCard, min: 4.5 },
    { label: `${key} sobre midnight`, fg: PALETTE[key], bg: PALETTE.midnight, min: 4.5 },
    { label: `${key} sobre tarjeta midnight REAL`, fg: PALETTE[key], bg: MIDNIGHT_CARD_EFFECTIVE, min: 4.5 },
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
