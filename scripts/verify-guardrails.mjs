#!/usr/bin/env node
/**
 * Prueba de falsabilidad de los guardarraíles de lint.
 *
 * Por qué existe: `npm run lint` en verde sobre `src/` NO prueba que las reglas
 * de seguridad funcionen — prueba que nadie las viola. Una regla mal escrita da
 * exactamente el mismo verde. Ya pasó en este repo: la primera versión de la
 * regla de T-104 usaba `no-restricted-properties`, no detectaba `headers().host`
 * y se reportó como control activo. Ver tasks/lessons.md.
 *
 * Este script corre ESLint contra un fixture vulnerable a propósito y FALLA si
 * el fixture pasa limpio.
 *
 * Uso: npm run verify:guardrails
 */

import { execFileSync } from 'node:child_process'

const FIXTURE = 'security-fixtures/t104-host-header.ts'
/** Cada fixture declara cuántas violaciones debe producir y de qué regla. */
const EXPECTED = { rule: 'no-restricted-syntax', count: 3 }

let report
try {
  // --no-ignore: el fixture está en ignorePatterns para el lint normal.
  execFileSync('npx', ['eslint', '--no-ignore', '--format', 'json', FIXTURE], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  // ESLint sale 0 solo si no encontró errores: eso ya es el fallo.
  console.error(
    `verify:guardrails — FALLO: ESLint no encontró NINGUNA violación en ${FIXTURE}.\n` +
      'El fixture viola T-104 a propósito. Si pasa limpio, la regla no funciona.'
  )
  process.exit(1)
} catch (error) {
  // Salida distinta de 0 = encontró errores, que es lo esperado.
  report = error.stdout
}

let results
try {
  results = JSON.parse(report)
} catch {
  console.error('verify:guardrails — no se pudo parsear la salida de ESLint:\n', report)
  process.exit(1)
}

const messages = results.flatMap((file) => file.messages)
const hits = messages.filter((message) => message.ruleId === EXPECTED.rule)

if (hits.length !== EXPECTED.count) {
  console.error(
    `verify:guardrails — FALLO: se esperaban ${EXPECTED.count} violaciones de ` +
      `${EXPECTED.rule} en ${FIXTURE}, se encontraron ${hits.length}.`
  )
  for (const message of messages) {
    console.error(`  línea ${message.line}: [${message.ruleId}] ${message.message}`)
  }
  process.exit(1)
}

console.log(
  `verify:guardrails — OK: la regla ${EXPECTED.rule} detectó las ${hits.length} ` +
    `violaciones de T-104 plantadas en ${FIXTURE}:`
)
for (const hit of hits) {
  console.log(`  línea ${hit.line}: ${hit.message}`)
}
