/**
 * Validación del formulario de contacto.
 *
 * Escrita a mano y sin dependencias (D-07 de tasks/plan.md): son tres campos y
 * está en el camino del único secreto del proyecto.
 *
 * Reglas de diseño:
 *  - Es una función pura. No lee env, no hace red, no registra nada. Por eso se
 *    puede testear exhaustivamente sin levantar la app.
 *  - Devuelve CÓDIGOS, nunca el valor que falló. Ningún dato del visitante sale
 *    de aquí hacia un log ni hacia la respuesta (T-103 + sección Logging).
 *  - Esta validación es la de SEGURIDAD. La del cliente es solo UX y se
 *    duplica a propósito (regla de la constitución).
 */

export type FieldName = 'name' | 'email' | 'message'

export type ValidationCode =
  | 'REQUIRED'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'INVALID_EMAIL'
  | 'CONTROL_CHARS'

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export type ValidationResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; errors: Partial<Record<FieldName, ValidationCode>> }

export const LIMITS = {
  name: { min: 2, max: 80 },
  // 254 es el máximo real de una dirección de correo (RFC 5321).
  email: { max: 254 },
  message: { min: 10, max: 5000 },
} as const

/**
 * Caracteres de control. Importan por dos motivos distintos:
 *  - CR/LF en `name` o `email` permitiría inyectar cabeceras en el correo
 *    saliente (CWE-93). Ahí es un fallo de seguridad, no de formato.
 *  - El resto de controles no aportan nada legítimo a estos campos.
 * En `message` los saltos de línea sí son legítimos, así que ahí se permiten.
 */
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/
const CONTROL_CHARS_ALLOWING_NEWLINES = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/

/**
 * Deliberadamente conservador. No intenta implementar el RFC 5322 completo:
 * el objetivo no es aceptar toda dirección legal del mundo, es rechazar sin
 * ambigüedad lo que no puede ser una dirección.
 */
const EMAIL = /^[^\s@<>,;:"'\\]+@[^\s@<>,;:"'\\.]+(\.[^\s@<>,;:"'\\.]+)+$/

function readField(input: unknown): string {
  return typeof input === 'string' ? input.trim() : ''
}

function validateName(value: string): ValidationCode | null {
  if (value.length === 0) return 'REQUIRED'
  if (CONTROL_CHARS.test(value)) return 'CONTROL_CHARS'
  if (value.length < LIMITS.name.min) return 'TOO_SHORT'
  if (value.length > LIMITS.name.max) return 'TOO_LONG'
  return null
}

function validateEmail(value: string): ValidationCode | null {
  if (value.length === 0) return 'REQUIRED'
  if (CONTROL_CHARS.test(value)) return 'CONTROL_CHARS'
  // La longitud se comprueba ANTES del regex: una cadena enorme contra un
  // regex con backtracking es un ReDoS esperando a pasar.
  if (value.length > LIMITS.email.max) return 'TOO_LONG'
  if (!EMAIL.test(value)) return 'INVALID_EMAIL'
  return null
}

function validateMessage(value: string): ValidationCode | null {
  if (value.length === 0) return 'REQUIRED'
  if (CONTROL_CHARS_ALLOWING_NEWLINES.test(value)) return 'CONTROL_CHARS'
  if (value.length < LIMITS.message.min) return 'TOO_SHORT'
  if (value.length > LIMITS.message.max) return 'TOO_LONG'
  return null
}

export function validateContact(input: {
  name?: unknown
  email?: unknown
  message?: unknown
}): ValidationResult {
  const name = readField(input.name)
  const email = readField(input.email)
  const message = readField(input.message)

  const errors: Partial<Record<FieldName, ValidationCode>> = {}

  const nameError = validateName(name)
  if (nameError) errors.name = nameError

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  const messageError = validateMessage(message)
  if (messageError) errors.message = messageError

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  return { ok: true, value: { name, email, message } }
}
