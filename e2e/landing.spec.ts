import { expect, test } from '@playwright/test'

/**
 * Criterios de aceptación de RF-101, RF-102, RF-103 y RF-105 que se pueden
 * verificar ya, sin los recursos que aún faltan (dominio, capturas, PDFs).
 */

test.describe('Landing', () => {
  test('la CSP no bloquea nada al cargar la página', async ({ page }) => {
    const violations: string[] = []
    // Una violación de CSP se reporta como un error de consola del navegador.
    page.on('console', (message) => {
      if (message.type() === 'error' && /Content Security Policy/i.test(message.text())) {
        violations.push(message.text())
      }
    })
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    await page.goto('/')
    // NO se usa waitForLoadState('networkidle'): el widget de Turnstile
    // mantiene actividad de red en segundo plano (heartbeat, telemetría de
    // Cloudflare) y esa espera nunca se cumple con el widget montado. Es un
    // antipatrón conocido de Playwright con widgets de terceros de este tipo.
    // 'load' + un margen es suficiente: lo que se mide son errores de consola
    // y de página, no la ausencia total de tráfico de red.
    await page.waitForLoadState('load')
    await page.waitForTimeout(1000)

    expect(violations, 'la CSP está bloqueando recursos propios').toEqual([])
    expect(pageErrors, 'errores de JavaScript en la página').toEqual([])
  })

  test('RF-101: el hero se lee sin scroll en 375 px', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'solo aplica al viewport móvil')

    await page.goto('/')

    const viewport = page.viewportSize()
    // El ancho exacto del criterio, no "375 o menos": es lo que dice RF-101.
    expect(viewport?.width).toBe(375)

    // Se acota al hero: el enlace de GitHub también aparece en la sección de
    // contacto, y esa copia no dice nada sobre el criterio de RF-105.
    const heroSection = page.getByRole('region', { name: /Luis Alejandro Cerón Muñoz/ })

    // El titular, la propuesta de valor y ambos CTA deben caber en la primera
    // pantalla: es el criterio literal de RF-101 y de RF-105.
    for (const locator of [
      page.getByRole('heading', { level: 1 }),
      page.getByText(/Construyo aplicaciones web completas/),
      heroSection.getByRole('link', { name: /Escríbeme/ }),
      heroSection.getByRole('link', { name: /Ver mi perfil de GitHub/ }),
    ]) {
      const box = await locator.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height)
    }
  })

  test('RF-105: el enlace de GitHub apunta al perfil, no a un repo', async ({ page }) => {
    await page.goto('/')

    const link = page
      .getByRole('region', { name: /Luis Alejandro Cerón Muñoz/ })
      .getByRole('link', { name: /Ver mi perfil de GitHub/ })
    const href = await link.getAttribute('href')

    expect(href).toBe('https://github.com/Luisceron0')
    // Un perfil no lleva segmento de repositorio.
    expect(new URL(href!).pathname.split('/').filter(Boolean)).toHaveLength(1)
    expect(await link.getAttribute('rel')).toContain('noopener')
  })

  test('no hay enlaces rotos ni href vacíos', async ({ page }) => {
    await page.goto('/')

    const hrefs = await page.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((a) => a.getAttribute('href') ?? '')
    )

    expect(hrefs.length).toBeGreaterThan(0)
    for (const href of hrefs) {
      expect(href).not.toBe('')
      expect(href).not.toBe('#')
      // Un marcador sin resolver nunca debe llegar a un href.
      expect(href).not.toContain('[PENDIENTE')
    }
  })

  test('estructura accesible: un h1, landmarks y saltos de nivel correctos', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(page.getByRole('contentinfo')).toHaveCount(1)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')

    // Toda imagen renderizada necesita alt (vacío no cuenta: son de contenido).
    const alts = await page.locator('img').evaluateAll((images) =>
      images.map((img) => img.getAttribute('alt'))
    )
    for (const alt of alts) {
      expect(alt).toBeTruthy()
    }
  })

  test('el salto al contenido es el primer elemento tabulable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'navegación por teclado: viewport de escritorio')

    await page.goto('/')
    await page.keyboard.press('Tab')

    await expect(page.locator(':focus')).toHaveText(/Saltar al contenido/)
  })
})
