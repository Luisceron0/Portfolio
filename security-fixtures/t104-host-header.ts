/**
 * FIXTURE VULNERABLE A PROPÓSITO — no forma parte de la aplicación.
 *
 * Cada función de aquí abajo viola T-104 del modelo de amenazas (derivar una URL
 * del header `Host`). Existe para demostrar que la regla ESLint correspondiente
 * DETECTA lo que dice detectar.
 *
 * `scripts/verify-guardrails.mjs` corre ESLint contra este archivo y falla si
 * NO encuentra las tres violaciones. Un lint en verde sobre `src/` solo prueba
 * que nadie viola la regla; este archivo prueba que la regla existe de verdad.
 *
 * Está en `ignorePatterns` de .eslintrc.json: el lint normal no lo mira.
 */

import { headers } from 'next/headers'

/** Violación 1: acceso directo a `.host` sobre el resultado de headers(). */
export function absoluteUrlFromHost(path: string): string {
  // @ts-expect-error - ReadonlyHeaders no expone .host; la forma insegura ni siquiera tipa
  return `https://${headers().host}${path}`
}

/** Violación 2: leer el header por nombre. */
export function canonicalUrl(path: string): string {
  const host = headers().get('host')
  return `https://${host}${path}`
}

/** Violación 3: la variante con proxy delante, igual de manipulable. */
export function redirectTarget(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-host')
  return `https://${forwarded}/gracias`
}
