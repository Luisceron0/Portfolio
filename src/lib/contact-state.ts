/**
 * Tipos y estado inicial del formulario de contacto.
 *
 * Vive fuera de `src/app/actions/contact.ts` a propósito: un archivo con
 * `'use server'` en Next.js SOLO puede exportar funciones async — cualquier
 * otro export (un tipo, una constante) revienta en runtime con
 * "A 'use server' file can only export async functions, found object.".
 *
 * Ese error no lo detectó `next build` (los tipos se borran) ni `tsc`
 * (`initialContactState` tipa perfectamente bien) — solo lo detectó ejecutar
 * la página de verdad. Ver tasks/lessons.md.
 */

import type { FieldName, ValidationCode } from '@/lib/validation'

export type ContactErrorCode = 'VALIDATION' | 'CAPTCHA' | 'RATE_LIMITED' | 'SEND_FAILED'

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error'
      code: ContactErrorCode
      fieldErrors?: Partial<Record<FieldName, ValidationCode>>
      retryAfterSeconds?: number
    }

export const initialContactState: ContactState = { status: 'idle' }
