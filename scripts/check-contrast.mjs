#!/usr/bin/env node
/**
 * Verifica en frío los ratios de contraste que tailwind.config.ts AFIRMA que
 * cumplen WCAG AA (RF-110 v5, zine de papel).
 *
 * Existe porque una versión anterior de la paleta citaba ratios calculados de
 * memoria. Aquí se miden. Ver tasks/lessons.md.
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

// Los mismos valores hex que tailwind.config.ts. Si uno cambia allá y no
// aquí, este script deja de reflejar la realidad.
const PALETTE = {
  surface: '#121014', // cartulina negra
  surfaceCard: '#1b181e', // cartulina negra de tarjeta
  paper: '#f2efe8', // fotocopia
  paperDark: '#e6e2d8', // campos del formulario
  ink: '#f2efe8',
  inkMuted: '#b9b3ab',
  tinta: '#0b0a0f',
  tintaMuted: '#4a4540',
  magenta: '#D903D5',
  magentaDeep: '#A8009F',
  magentaText: '#F25CEB',
  warn: '#ffd23f',
  toneMagenta: '#F25CEB',
  tonePink: '#FF9CF5',
  toneOchre: '#E0A24A',
  toneCyan: '#46C3D8',
  toneLilac: '#B6A6B6',
}

const TONE_KEYS = ['toneMagenta', 'tonePink', 'toneOchre', 'toneCyan', 'toneLilac']

/** Cada par que el sitio realmente usa como texto sobre fondo. */
const PAIRS = [
  // Cartulina negra.
  { label: 'ink sobre surface (texto principal)', fg: PALETTE.ink, bg: PALETTE.surface, min: 4.5 },
  { label: 'ink sobre surface-card (tarjetas)', fg: PALETTE.ink, bg: PALETTE.surfaceCard, min: 4.5 },
  { label: 'ink-muted sobre surface', fg: PALETTE.inkMuted, bg: PALETTE.surface, min: 4.5 },
  { label: 'ink-muted sobre surface-card', fg: PALETTE.inkMuted, bg: PALETTE.surfaceCard, min: 4.5 },
  { label: 'magenta-text sobre surface (sellos, números, organización)', fg: PALETTE.magentaText, bg: PALETTE.surface, min: 4.5 },
  { label: 'magenta-text sobre surface-card', fg: PALETTE.magentaText, bg: PALETTE.surfaceCard, min: 4.5 },

  // Fotocopia (papel).
  { label: 'tinta sobre paper (fotocopias, títulos, formulario)', fg: PALETTE.tinta, bg: PALETTE.paper, min: 4.5 },
  { label: 'tinta-muted sobre paper (secundario sobre papel)', fg: PALETTE.tintaMuted, bg: PALETTE.paper, min: 4.5 },
  { label: 'magenta-deep sobre paper (sello y organización sobre papel)', fg: PALETTE.magentaDeep, bg: PALETTE.paper, min: 4.5 },
  { label: 'tinta sobre paper-dark (texto de los campos)', fg: PALETTE.tinta, bg: PALETTE.paperDark, min: 4.5 },
  { label: 'tinta-muted sobre paper-dark (placeholder)', fg: PALETTE.tintaMuted, bg: PALETTE.paperDark, min: 4.5 },
  { label: 'magenta-deep sobre paper-dark (error de campo)', fg: PALETTE.magentaDeep, bg: PALETTE.paperDark, min: 4.5 },

  // Papel magenta y rellenos.
  { label: 'tinta sobre magenta (bandas, hero, CV)', fg: PALETTE.tinta, bg: PALETTE.magenta, min: 4.5 },
  { label: 'paper sobre magenta-deep (botón primario)', fg: PALETTE.paper, bg: PALETTE.magentaDeep, min: 4.5 },
  { label: 'paper sobre tinta (Dymo, botón oscuro, cinta tinta)', fg: PALETTE.paper, bg: PALETTE.tinta, min: 4.5 },

  // Nota adhesiva.
  { label: 'tinta sobre warn (nota adhesiva, [PENDIENTE])', fg: PALETTE.tinta, bg: PALETTE.warn, min: 4.5 },
  { label: 'tinta-muted sobre warn (evidencia en nota)', fg: PALETTE.tintaMuted, bg: PALETTE.warn, min: 4.5 },

  /*
   * Cada tono: como texto sobre negro y sobre tarjeta, y como papel con tinta
   * encima (notas, recortes, chips, bandas lila, resaltador).
   */
  ...TONE_KEYS.flatMap((key) => [
    { label: `${key} sobre surface`, fg: PALETTE[key], bg: PALETTE.surface, min: 4.5 },
    { label: `${key} sobre surface-card`, fg: PALETTE[key], bg: PALETTE.surfaceCard, min: 4.5 },
    { label: `tinta sobre ${key} (papel con tinta encima)`, fg: PALETTE.tinta, bg: PALETTE[key], min: 4.5 },
  ]),

  // Secundario en notas de color (pasos del proceso): solo donde llega.
  { label: 'tinta-muted sobre tonePink (nota rosa)', fg: PALETTE.tintaMuted, bg: PALETTE.tonePink, min: 4.5 },
  { label: 'tinta-muted sobre toneCyan (nota cian)', fg: PALETTE.tintaMuted, bg: PALETTE.toneCyan, min: 4.5 },
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
