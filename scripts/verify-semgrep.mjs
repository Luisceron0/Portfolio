#!/usr/bin/env node
/**
 * Valida las reglas Semgrep propias contra su fixture vulnerable.
 *
 * Por qué es un script y no un comando suelto en package.json:
 * `semgrep --test` sale con código 0 cuando NO encuentra ningún test. Es decir,
 * un fixture mal ubicado o un directorio renombrado producen exactamente el
 * mismo verde que unas reglas validadas. Este wrapper convierte ese caso en un
 * fallo explícito.
 *
 * También comprueba que el fixture sigue produciendo al menos un hallazgo por
 * regla: si alguien añade una regla sin caso de prueba, se entera aquí.
 *
 * Uso: npm run verify:semgrep
 */

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const RULES_DIR = 'semgrep-rules'
const FIXTURE = `${RULES_DIR}/security.ts`

function run(args) {
  try {
    return execFileSync('semgrep', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (error) {
    return `${error.stdout ?? ''}${error.stderr ?? ''}`
  }
}

// --- 1. Los tests anotados (ruleid:/ok:) pasan -------------------------------
const testOutput = run(['--test', `${RULES_DIR}/`])

if (/No unit tests found/i.test(testOutput)) {
  console.error(
    'verify:semgrep — FALLO: semgrep no encontró ningún test.\n' +
      `El fixture ${FIXTURE} debe llamarse igual que el .yaml de reglas y vivir\n` +
      'en el mismo directorio. Ojo: semgrep ignora los directorios que empiezan\n' +
      'por punto, por eso las reglas NO están en .semgrep/.'
  )
  process.exit(1)
}

const passed = testOutput.match(/(\d+)\/(\d+): ✓ All tests passed/)
if (!passed) {
  console.error('verify:semgrep — FALLO: los tests de reglas no pasaron.\n', testOutput)
  process.exit(1)
}

// --- 2. Toda regla declarada tiene al menos un hallazgo en el fixture --------
const rulesYaml = readFileSync(`${RULES_DIR}/security.yaml`, 'utf8')
const declaredRules = [...rulesYaml.matchAll(/^\s*-\s*id:\s*(\S+)/gm)].map((m) => m[1])

const scanJson = run(['--config', `${RULES_DIR}/`, '--quiet', '--json', FIXTURE])
let findings
try {
  findings = JSON.parse(scanJson).results
} catch {
  console.error('verify:semgrep — no se pudo parsear el escaneo del fixture:\n', scanJson)
  process.exit(1)
}

const covered = new Set(findings.map((f) => f.check_id.split('.').pop()))
const uncovered = declaredRules.filter((rule) => !covered.has(rule))

if (uncovered.length > 0) {
  console.error(
    `verify:semgrep — FALLO: estas reglas no tienen ningún caso vulnerable en ${FIXTURE}:\n` +
      uncovered.map((rule) => `  - ${rule}`).join('\n') +
      '\nUna regla sin fixture es una regla en la que no se puede confiar.'
  )
  process.exit(1)
}

console.log(
  `verify:semgrep — OK: ${passed[1]}/${passed[2]} tests de reglas en verde.\n` +
    `  ${declaredRules.length} reglas declaradas, todas con caso vulnerable comprobado.\n` +
    `  ${findings.length} hallazgos plantados detectados en ${FIXTURE}.`
)
for (const finding of findings) {
  console.log(`    ${FIXTURE}:${finding.start.line}  ${finding.check_id.split('.').pop()}`)
}
