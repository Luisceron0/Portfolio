/**
 * Rate limit por IP, en memoria.
 *
 * D-08/D-08b de tasks/plan.md: esto es defensa en profundidad, NO el control
 * primario. En un entorno serverless cada instancia tiene su propio Map, así
 * que un atacante distribuido lo esquiva. El control primario contra abuso es
 * Turnstile; esto solo corta el caso trivial de alguien dándole al botón.
 *
 * Documentarlo importa: un rate limit que se cree más fuerte de lo que es
 * produce una falsa sensación de cobertura.
 *
 * La IP nunca se guarda en claro: se indexa por su hash. No hay base de datos,
 * pero tampoco hace falta tener PII en memoria si se puede evitar.
 */

import { createHash } from 'node:crypto'

export const RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  maxRequests: 3,
} as const

export interface RateLimitVerdict {
  allowed: boolean
  retryAfterSeconds: number
}

/** Clave opaca: la IP en claro no entra en el Map. */
export function hashClientKey(value: string): string {
  return createHash('sha256').update(value).digest('base64url').slice(0, 22)
}

/**
 * Estado del proceso. Exportado solo para que los tests puedan partir de cero;
 * la aplicación nunca lo toca directamente.
 */
export const rateLimitStore = new Map<string, number[]>()

export function resetRateLimitStore(): void {
  rateLimitStore.clear()
}

export function checkRateLimit(
  clientKey: string,
  now: number = Date.now(),
  store: Map<string, number[]> = rateLimitStore,
  maxRequests: number = RATE_LIMIT.maxRequests
): RateLimitVerdict {
  const windowStart = now - RATE_LIMIT.windowMs
  const previous = store.get(clientKey) ?? []
  const recent = previous.filter((timestamp) => timestamp > windowStart)

  if (recent.length >= maxRequests) {
    const oldest = recent[0]
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + RATE_LIMIT.windowMs - now) / 1000)
    )
    // El intento bloqueado NO se apunta: si lo hiciera, quien insista quedaría
    // bloqueado para siempre en vez de recuperar el acceso al vencer la ventana.
    store.set(clientKey, recent)
    return { allowed: false, retryAfterSeconds }
  }

  recent.push(now)
  store.set(clientKey, recent)

  // Poda perezosa: sin esto, el Map crece sin techo con IPs que no volverán.
  if (store.size > 10_000) {
    for (const [key, timestamps] of store) {
      if (timestamps.every((timestamp) => timestamp <= windowStart)) store.delete(key)
    }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}
