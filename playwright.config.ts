import { defineConfig, devices } from '@playwright/test'

/**
 * Dos servidores, a propósito — son dos configuraciones distintas del protocolo
 * de neutralización de efectos, no un capricho:
 *
 *   :3000  CONTACT_TEST_MODE + CONTACT_DRY_RUN
 *          Turnstile verifica de verdad (claves de prueba oficiales de
 *          Cloudflare) y el correo se registra en memoria. Camino feliz.
 *
 *   :3001  CONTACT_TEST_MODE, SIN dry-run y SIN RESEND_API_KEY
 *          El envío falla en el punto de integración. Es el estado de error
 *          real del usuario, obtenido sin ninguna puerta trasera en el código:
 *          simplemente no hay credencial.
 *
 * Ninguno de los dos desactiva Turnstile. Desactivarlo haría falso cualquier
 * resultado de "está protegido".
 */

export const HAPPY_PATH_URL = 'http://127.0.0.1:3000'
export const SEND_FAILURE_URL = 'http://127.0.0.1:3001'
export const CAPTCHA_REJECT_URL = 'http://127.0.0.1:3002'
export const RATE_LIMIT_URL = 'http://127.0.0.1:3003'

/** Secret de prueba pública de Cloudflare que rechaza cualquier token. */
const TURNSTILE_SECRET_ALWAYS_FAILS = '2x0000000000000000000000000000000AA'

const SHARED_ENV = {
  NEXT_TELEMETRY_DISABLED: '1',
  CONTACT_TEST_MODE: '1',
  // Todos los tests salen de la misma IP. Con el tope real (3/10 min) el cuarto
  // envío de la suite fallaría por rate limit en vez de por lo que prueba.
  // El límite real se verifica en su propio servidor, abajo.
  CONTACT_RATE_LIMIT_MAX: '50',
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  // Compila una vez; los dos servidores solo arrancan.
  globalSetup: './e2e/global-setup.ts',

  use: {
    baseURL: HAPPY_PATH_URL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    /*
     * RF-101 exige que el hero se entienda sin scroll en 375 px.
     *
     * El viewport se fija a mano en 375x667 en lugar de usar un descriptor de
     * dispositivo: `devices['iPhone SE']` de Playwright es 320x568, así que
     * verificar el criterio con él probaría un ancho que la SRS no pide.
     * Del descriptor solo se conserva la emulación móvil (táctil, user agent),
     * y browserName se fuerza a chromium porque CI solo instala chromium.
     */
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
      },
    },
  ],

  /*
   * Las cabeceras se prueban contra el build de producción: en `next dev` la
   * CSP lleva 'unsafe-eval' y ws:, así que un test contra dev daría un falso
   * positivo sobre lo que realmente se despliega.
   */
  webServer: [
    {
      command: 'npm run start -- --port 3000',
      url: HAPPY_PATH_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { ...SHARED_ENV, CONTACT_DRY_RUN: '1' },
    },
    {
      command: 'npm run start -- --port 3001',
      url: SEND_FAILURE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: SHARED_ENV,
    },
    {
      // Turnstile con el secret que SIEMPRE rechaza: prueba que el fail-closed
      // del servidor funciona aunque el navegador entregue un token con pinta
      // de bueno.
      command: 'npm run start -- --port 3002',
      url: CAPTCHA_REJECT_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...SHARED_ENV,
        CONTACT_DRY_RUN: '1',
        TURNSTILE_SECRET_KEY: TURNSTILE_SECRET_ALWAYS_FAILS,
      },
    },
    {
      // Tope de 2 envíos para poder observar el 3.º bloqueado sin esperar
      // 10 minutos.
      command: 'npm run start -- --port 3003',
      url: RATE_LIMIT_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { ...SHARED_ENV, CONTACT_DRY_RUN: '1', CONTACT_RATE_LIMIT_MAX: '2' },
    },
  ],
})
