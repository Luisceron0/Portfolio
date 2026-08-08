import { execSync } from 'node:child_process'

/**
 * Compila una sola vez antes de levantar los dos servidores de prueba.
 *
 * Sin esto, los dos `webServer` de playwright.config.ts arrancarían en paralelo
 * y ambos intentarían escribir en `.next` a la vez.
 */
export default function globalSetup() {
  execSync('npm run build', {
    stdio: 'inherit',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  })
}
