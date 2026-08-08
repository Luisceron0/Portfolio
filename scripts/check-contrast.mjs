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

// Los mismos valores hex que tailwind.config.ts. Si uno cambia allá y no
// aquí, este script deja de reflejar la realidad — es la razón por la que
// tailwind.config.ts enlaza a este archivo en su comentario.
const PALETTE = {
  ink: '#0f172a',
  inkMuted: '#475569',
  accent: '#3730a3',
  surface: '#ffffff',
  surfaceSubtle: '#f8fafc',
  warn: '#854d0e',
  warnSurface: '#fffbeb',
}

/** Cada par que el sitio realmente usa como texto sobre fondo. */
const PAIRS = [
  { label: 'ink sobre surface (texto principal)', fg: PALETTE.ink, bg: PALETTE.surface, min: 4.5 },
  {
    label: 'ink-muted sobre surface (texto secundario)',
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
  { label: 'blanco sobre accent (botón primario)', fg: PALETTE.surface, bg: PALETTE.accent, min: 4.5 },
  { label: 'warn sobre warn-surface (aviso [PENDIENTE])', fg: PALETTE.warn, bg: PALETTE.warnSurface, min: 4.5 },
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
