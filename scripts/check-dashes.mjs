#!/usr/bin/env node
/**
 * Guardia de estilo: prohíbe la raya larga (—) y la raya (–) en el copy visible.
 *
 * Petición explícita del dueño. Existe como script y no como "acuérdate de no
 * usarlas" porque la raya larga se cuela sola: la escriben los editores al
 * autocorregir, y aparece copiada de cualquier texto de origen.
 *
 * Solo mira `src/content.ts`, que es donde vive TODO el texto visible del sitio
 * (regla 2 de copilot-instructions). Los comentarios del código quedan fuera:
 * ahí la raya larga es legítima y nadie la lee en la página.
 *
 * Uso: npm run check:dashes
 */

import { readFileSync } from 'node:fs'

const FILE = 'src/content.ts'
/** Raya larga (em dash) y raya (en dash). */
const FORBIDDEN = /[—–]/

const lines = readFileSync(FILE, 'utf8').split('\n')

const findings = []
let insideBlockComment = false

lines.forEach((line, index) => {
  const trimmed = line.trim()

  // Se saltan los comentarios: la restricción es sobre el texto que se
  // renderiza, no sobre la documentación del archivo.
  if (trimmed.startsWith('/*')) insideBlockComment = true
  const wasComment = insideBlockComment
  if (trimmed.includes('*/')) insideBlockComment = false
  if (wasComment || trimmed.startsWith('//') || trimmed.startsWith('*')) return

  if (FORBIDDEN.test(line)) {
    findings.push({ line: index + 1, text: trimmed.slice(0, 90) })
  }
})

if (findings.length === 0) {
  console.log(`check:dashes — sin rayas largas en el copy visible de ${FILE}.`)
  process.exit(0)
}

console.error(
  `check:dashes — ${findings.length} raya(s) larga(s) en el copy visible de ${FILE}:\n`
)
for (const finding of findings) {
  console.error(`  ${FILE}:${finding.line}  ${finding.text}`)
}
console.error('\nUsa comas, dos puntos o paréntesis en su lugar.')
process.exit(1)
