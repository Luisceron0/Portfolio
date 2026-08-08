#!/usr/bin/env node
/**
 * Escaneo de secretos sin dependencias externas.
 *
 * NO sustituye a gitleaks en CI: es la red de seguridad local, ejecutable sin
 * red y sin instalar nada, para que la comprobación de T-101 no dependa de que
 * una acción de terceros esté disponible. En CI corren los dos.
 *
 * Comprueba dos cosas:
 *   1. Que no haya ningún archivo .env versionado (salvo .env.example).
 *   2. Que ningún archivo versionado contenga un patrón de credencial conocido.
 *
 * Uso: npm run check:secrets
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'

/** Patrones de alta señal: prefijos propios de cada proveedor, pocos falsos positivos. */
const SECRET_PATTERNS = [
  { name: 'Clave de API de Resend', regex: /\bre_[A-Za-z0-9]{16,}\b/ },
  { name: 'Secret key de Cloudflare Turnstile', regex: /\b0x[A-Za-z0-9_-]{30,}\b/ },
  { name: 'Access key de AWS', regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Bloque de clave privada', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Token de GitHub', regex: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  {
    name: 'Asignación de secreto con valor literal',
    // Coincide solo si hay valor tras el `=`: `RESEND_API_KEY=` vacío es correcto.
    regex: /\b(?:RESEND_API_KEY|TURNSTILE_SECRET_KEY)\s*=\s*["']?[A-Za-z0-9_\-]{8,}/,
  },
]

/** Archivos que este propio script menciona por diseño. */
const SELF = 'scripts/check-secrets.mjs'
const MAX_BYTES = 512 * 1024

/**
 * Archivos versionados MÁS los no versionados que no están ignorados.
 * Incluir los segundos es deliberado: el objetivo es avisar ANTES del commit,
 * no después. Los ignorados (.env.local) quedan fuera, que es donde deben estar.
 */
function candidateFiles() {
  return execFileSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    { encoding: 'utf8' }
  )
    .split('\0')
    .filter(Boolean)
}

const files = candidateFiles()
const problems = []

for (const file of files) {
  const base = file.split('/').pop() ?? file

  if (base.startsWith('.env') && base !== '.env.example') {
    problems.push(`${file}: archivo .env versionado. Debe estar en .gitignore (T-101).`)
    continue
  }

  if (file === SELF) continue

  let size
  try {
    size = statSync(file).size
  } catch {
    continue // Archivo borrado pero aún en el índice.
  }
  if (size > MAX_BYTES) continue

  let content
  try {
    content = readFileSync(file, 'utf8')
  } catch {
    continue // Binario o ilegible.
  }
  if (content.includes('\0')) continue

  for (const { name, regex } of SECRET_PATTERNS) {
    const match = content.match(regex)
    if (match) {
      const line = content.slice(0, match.index).split('\n').length
      problems.push(`${file}:${line}: posible ${name}.`)
    }
  }
}

if (problems.length === 0) {
  console.log(`check:secrets — ${files.length} archivos revisados, sin hallazgos.`)
  process.exit(0)
}

console.error('check:secrets — posibles secretos:\n')
for (const problem of problems) console.error(`  ${problem}`)
console.error(
  '\nSi alguno es real: rota la credencial ANTES de reescribir el historial.' +
    '\nBorrarla del commit no la invalida.'
)
process.exit(1)
