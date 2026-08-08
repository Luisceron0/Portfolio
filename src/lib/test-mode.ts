/**
 * Modo de prueba — protocolo de neutralización de efectos.
 *
 * Este archivo es la única razón por la que se puede desarrollar y testear el
 * formulario de contacto sin una sola credencial real. Existe por un precedente
 * concreto: una herramienta lanzada contra un endpoint de contacto sin
 * neutralizar acabó enviando ~200 correos reales a una bandeja real.
 *
 * Dos interruptores, ambos explícitos, ninguno activo por defecto:
 *
 *   CONTACT_TEST_MODE=1 → Turnstile usa las claves de PRUEBA OFICIALES de
 *                          Cloudflare (públicas y documentadas, no secretos).
 *                          La validación real sigue ocurriendo contra el
 *                          endpoint real de Cloudflare: NO se desactiva.
 *   CONTACT_DRY_RUN=1    → el transporte de correo registra en memoria en vez
 *                          de enviar. Cero cuota de Resend, cero correos.
 *
 * Y una negativa dura: si alguno de los dos aparece en un despliegue de
 * producción, el módulo lanza al cargarse. Un backdoor de test que sobrevive al
 * deploy es peor que no tener tests.
 */

/** Claves de prueba públicas de Cloudflare. NO son secretos: están documentadas. */
export const TURNSTILE_TEST_KEYS = {
  /** Widget visible que siempre entrega token válido. */
  sitekeyAlwaysPasses: '1x00000000000000000000AA',
  /** Widget que siempre bloquea: sirve para probar el camino sin token. */
  sitekeyAlwaysBlocks: '2x00000000000000000000AB',
  /** Secret que acepta cualquier token. */
  secretAlwaysPasses: '1x0000000000000000000000000000000AA',
  /** Secret que rechaza cualquier token. */
  secretAlwaysFails: '2x0000000000000000000000000000000AA',
} as const

function isProductionDeployment(): boolean {
  // Vercel expone VERCEL_ENV; el fallback cubre cualquier otro hosting.
  return process.env.VERCEL_ENV === 'production'
}

const testModeRequested = process.env.CONTACT_TEST_MODE === '1'
const dryRunRequested = process.env.CONTACT_DRY_RUN === '1'

if ((testModeRequested || dryRunRequested) && isProductionDeployment()) {
  throw new Error(
    'CONTACT_TEST_MODE / CONTACT_DRY_RUN están activos en un despliegue de ' +
      'producción. Se aborta el arranque: en producción el formulario debe usar ' +
      'credenciales reales y enviar de verdad, o no funcionar en absoluto.'
  )
}

export const isTestMode = testModeRequested
export const isDryRun = dryRunRequested

/**
 * Permite a la suite de tests ajustar el tope del rate limit.
 *
 * El override SOLO se honra con CONTACT_TEST_MODE=1. En producción devuelve
 * siempre `null` aunque la variable esté puesta, así que no hay forma de
 * aflojar el límite real desde el entorno.
 *
 * Existe porque todos los tests salen de la misma IP: con el tope real (3 en
 * 10 minutos) el cuarto test de la suite fallaría por rate limit en vez de por
 * lo que pretende probar. El límite se verifica en su propio servidor, con su
 * propio tope bajo.
 */
export function rateLimitMaxOverride(): number | null {
  if (!isTestMode) return null
  const raw = process.env.CONTACT_RATE_LIMIT_MAX
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}
