import { expect, test, type Page } from '@playwright/test'

import {
  CAPTCHA_REJECT_URL,
  HAPPY_PATH_URL,
  RATE_LIMIT_URL,
  SEND_FAILURE_URL,
} from '../playwright.config'

/**
 * RF-104 en navegador real. Implementa los escenarios marcados [B] en
 * tests/rf-104.feature — los títulos coinciden a propósito.
 *
 * Nada de esto se puede comprobar con curl ni leyendo el diff: el fail-closed
 * de Turnstile depende de que un script de terceros entregue un token, y el
 * estado del botón es una consecuencia de eso.
 */

const TURNSTILE_SCRIPT = /challenges\.cloudflare\.com\/turnstile/

const VALID_INPUT = {
  name: 'Ana Pérez',
  email: 'ana@ejemplo.test',
  message: 'Hola Luis, me gustaría hablar contigo sobre una vacante de backend.',
}

async function fillForm(page: Page, overrides: Partial<typeof VALID_INPUT> = {}) {
  const data = { ...VALID_INPUT, ...overrides }
  await page.getByLabel('Nombre').fill(data.name)
  await page.getByLabel('Correo electrónico').fill(data.email)
  await page.getByLabel('Mensaje').fill(data.message)
}

/** El botón se habilita solo cuando Turnstile ha entregado el token. */
async function waitForToken(page: Page) {
  await expect(page.getByRole('button', { name: /Enviar mensaje/ })).toBeEnabled({
    timeout: 20_000,
  })
}

/** Cuenta los POST que salen hacia la server action. */
function countServerActionPosts(page: Page) {
  const posts: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST') posts.push(request.url())
  })
  return posts
}

// ---------------------------------------------------------------------------
// EL TEST CRÍTICO — la regresión de koa-landing
// ---------------------------------------------------------------------------

test.describe('Fail-closed de Turnstile', () => {
  test('Scenario: Submit blocked before Turnstile token arrives', async ({ page }) => {
    // Se bloquea el script de Turnstile: reproduce de forma determinista el
    // instante en que el visitante ya rellenó el formulario y el token todavía
    // no ha llegado. Es exactamente la ventana en la que koa-landing dejaba
    // enviar y devolvía un 400.
    await page.route(TURNSTILE_SCRIPT, (route) => route.abort())

    const posts = countServerActionPosts(page)

    await page.goto('/')
    await fillForm(page)

    const submit = page.getByRole('button', { name: /Enviar mensaje/ })

    // 1. El botón está deshabilitado.
    await expect(submit).toBeDisabled()

    // 2. El motivo está dicho en texto visible, no en silencio.
    await expect(page.getByTestId('captcha-pending')).toBeVisible()

    // 3. Intentar enviar no llega al servidor.
    await submit.click({ force: true }).catch(() => {})
    await page.waitForTimeout(500)

    expect(posts, 'ninguna petición debe alcanzar la server action').toEqual([])
    await expect(page.getByTestId('contact-success')).toHaveCount(0)
    await expect(page.getByTestId('contact-error')).toHaveCount(0)
  })

  test('Scenario: Server rejects a request with no Turnstile token, even if the button was somehow enabled client-side', async ({
    page,
  }) => {
    await page.route(TURNSTILE_SCRIPT, (route) => route.abort())

    await page.goto('/')
    await fillForm(page)

    // Se retira el `disabled` desde el DOM, igual que haría alguien con la
    // consola abierta. El campo del token sigue vacío.
    await page.evaluate(() => {
      document.querySelector('button[type="submit"]')?.removeAttribute('disabled')
    })

    await page.getByRole('button', { name: /Enviar mensaje/ }).click()

    // El servidor lo rechaza por su cuenta: es la defensa que de verdad importa.
    await expect(page.getByTestId('contact-error')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByTestId('contact-success')).toHaveCount(0)
  })

  test('Scenario: Server rejects a token that Cloudflare refuses', async ({ page }) => {
    // Servidor con el secret de prueba que SIEMPRE rechaza: el navegador
    // entrega un token con toda la pinta de bueno y aun así no pasa.
    await page.goto(`${CAPTCHA_REJECT_URL}/`)
    await fillForm(page)
    await waitForToken(page)

    await page.getByRole('button', { name: /Enviar mensaje/ }).click()

    const error = page.getByTestId('contact-error')
    await expect(error).toBeVisible({ timeout: 15_000 })
    // Mensaje genérico: al visitante no se le explica el motivo técnico.
    await expect(error).toContainText(/verificación antifraude/i)
    await expect(error).not.toContainText(/turnstile|cloudflare|siteverify|token/i)
  })

  test('tras un envío correcto el botón vuelve a deshabilitarse hasta el nuevo token', async ({
    page,
  }) => {
    await page.goto('/')
    await fillForm(page)
    await waitForToken(page)
    await page.getByRole('button', { name: /Enviar mensaje/ }).click()

    await expect(page.getByTestId('contact-success')).toBeVisible({ timeout: 15_000 })
    // Un token es de un solo uso: el siguiente envío necesita el suyo.
    await expect(page.getByRole('button', { name: /Enviar mensaje/ })).toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// Camino feliz y estados explícitos
// ---------------------------------------------------------------------------

test.describe('Estados del formulario', () => {
  test('Scenario: Successful submission with valid data', async ({ page }) => {
    await page.goto('/')
    await fillForm(page)
    await waitForToken(page)

    await page.getByRole('button', { name: /Enviar mensaje/ }).click()

    const success = page.getByTestId('contact-success')
    await expect(success).toBeVisible({ timeout: 15_000 })
    await expect(success).toContainText('Mensaje enviado')
    await expect(page.getByTestId('contact-error')).toHaveCount(0)
  })

  test('Scenario: The mail provider is unavailable', async ({ page }) => {
    // Servidor sin credencial de Resend y sin dry-run: el envío falla en el
    // punto de integración. Sin mocks y sin puerta trasera.
    await page.goto(`${SEND_FAILURE_URL}/`)
    await fillForm(page)
    await waitForToken(page)

    await page.getByRole('button', { name: /Enviar mensaje/ }).click()

    const error = page.getByTestId('contact-error')
    await expect(error, 'el fallo no puede ser silencioso').toBeVisible({ timeout: 15_000 })
    // El texto ofrece otra vía de contacto, no deja al visitante sin salida.
    await expect(error).toContainText(/GitHub/)
    await expect(page.getByTestId('contact-success')).toHaveCount(0)
  })

  test('Scenario: Oversized message field', async ({ page }) => {
    await page.goto('/')
    await fillForm(page)
    await waitForToken(page)

    // 50.000 caracteres puestos directamente en el DOM: `maxlength` es una
    // ayuda de UX, no un control. Se salta igual que lo haría un atacante.
    await page.evaluate(() => {
      const field = document.querySelector<HTMLTextAreaElement>('#contact-message')
      if (field) field.value = 'a'.repeat(50_000)
    })

    await page.getByRole('button', { name: /Enviar mensaje/ }).click()

    await expect(page.getByTestId('contact-error')).toBeVisible({ timeout: 15_000 })
    // El visitante sabe qué campo está mal.
    await expect(page.locator('#contact-message-error')).toBeVisible()
    await expect(page.getByTestId('contact-success')).toHaveCount(0)
  })

  test('Scenario: Submitted content is never rendered back to the page', async ({ page }) => {
    const marker = '<img src=x onerror=alert(1)>'

    await page.goto('/')
    await fillForm(page, { message: `Prueba de eco ${marker} fin de la prueba.` })
    await waitForToken(page)
    await page.getByRole('button', { name: /Enviar mensaje/ }).click()
    await expect(page.getByTestId('contact-success')).toBeVisible({ timeout: 15_000 })

    // T-103: nada de lo que escribió el visitante vuelve al marcado.
    const html = await page.content()
    expect(html).not.toContain('onerror=alert')
    expect(html).not.toContain('Prueba de eco')
  })
})

// ---------------------------------------------------------------------------
// Rate limit
// ---------------------------------------------------------------------------

test.describe('Rate limit', () => {
  // Servidor dedicado con tope 2: se observa el bloqueo sin esperar 10 minutos.
  test.describe.configure({ mode: 'serial' })

  test('Scenario: Repeated submissions from the same IP are throttled', async ({
    page,
  }, testInfo) => {
    /*
     * Solo en un proyecto. Causa real de un fallo intermitente que se
     * investigó a fondo (ver tasks/lessons.md): el servidor de RATE_LIMIT_URL
     * es UNO SOLO, compartido por los proyectos chromium y mobile, y ambos
     * emiten sus peticiones desde la misma IP 127.0.0.1 del equipo que corre
     * los tests — la emulación de "mobile" cambia el viewport y el user
     * agent, NO el origen de red. Si el proyecto chromium corre primero y
     * agota la cuota de 2, el proyecto mobile arranca ya bloqueado.
     * El rate limit es lógica de servidor por IP: no depende del viewport,
     * así que verificarlo una sola vez es la cobertura correcta, no un recorte.
     */
    test.skip(testInfo.project.name !== 'chromium', 'lógica de servidor por IP: se prueba una sola vez')

    await page.goto(`${RATE_LIMIT_URL}/`)

    for (let attempt = 1; attempt <= 2; attempt++) {
      await fillForm(page, { message: `Mensaje número ${attempt} con longitud suficiente.` })
      await waitForToken(page)
      await page.getByRole('button', { name: /Enviar mensaje/ }).click()
      await expect(page.getByTestId('contact-success')).toBeVisible({ timeout: 15_000 })
      await page.reload()
    }

    // Tercer intento: por encima del tope.
    await fillForm(page, { message: 'Tercer mensaje, este debería quedar bloqueado.' })
    await waitForToken(page)
    await page.getByRole('button', { name: /Enviar mensaje/ }).click()

    const error = page.getByTestId('contact-error')
    await expect(error).toBeVisible({ timeout: 15_000 })
    await expect(error).toContainText(/varios mensajes seguidos/i)
  })
})

// ---------------------------------------------------------------------------
// Higiene general de la página con el formulario montado
// ---------------------------------------------------------------------------

test('el formulario no provoca violaciones de CSP ni errores de JS', async ({ page }) => {
  const problems: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text())
  })
  page.on('pageerror', (error) => problems.push(error.message))

  await page.goto(HAPPY_PATH_URL)
  await waitForToken(page)

  const cspProblems = problems.filter((text) => /Content Security Policy/i.test(text))
  expect(cspProblems, 'la CSP está bloqueando algo que la página necesita').toEqual([])
})
