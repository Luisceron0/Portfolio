#!/usr/bin/env node
/**
 * Guardia de contenido: falla si queda algún `[PENDIENTE: ...]` en content.ts.
 *
 * Existe por una razón concreta: la regla "no inventes un dominio ni un
 * placeholder que pueda acabar desplegado". Los marcadores son válidos durante
 * el desarrollo, pero este script es lo que impide que sobrevivan a un deploy.
 *
 * Uso: npm run check:pending
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const contentPath = join(root, 'src', 'content.ts')

const source = readFileSync(contentPath, 'utf8')
const lines = source.split('\n')

const findings = []
lines.forEach((line, index) => {
  // Ignora la definición del propio tipo y las líneas de comentario.
  const trimmed = line.trim()
  if (trimmed.startsWith('*') || trimmed.startsWith('//')) return
  if (trimmed.includes('`[PENDIENTE: ${string}]`')) return
  if (trimmed.includes("startsWith('[PENDIENTE:')")) return

  const match = line.match(/\[PENDIENTE:[^\]]*\]/)
  if (match) {
    findings.push({ line: index + 1, text: match[0] })
  }
})

if (findings.length === 0) {
  console.log('check:pending — sin marcadores [PENDIENTE] en src/content.ts.')
  process.exit(0)
}

console.error(
  `check:pending — ${findings.length} marcador(es) [PENDIENTE] sin resolver en src/content.ts:\n`
)
for (const finding of findings) {
  console.error(`  src/content.ts:${finding.line}  ${finding.text}`)
}
console.error(
  '\nCada uno necesita un dato real del dueño del sitio. No los rellenes con' +
    '\nvalores inventados: ese es exactamente el fallo que este script previene.'
)
process.exit(1)
