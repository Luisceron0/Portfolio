import { expect, test } from '@playwright/test'

import { nav, projects, skills, timeline } from '@/content'

/**
 * Criterios de aceptación de RF-102 (4 proyectos), RF-106 (perfil y
 * trayectoria), RF-107 (habilidades) y RF-108 (navegación interna).
 *
 * Se comprueba contra `src/content.ts` en vez de contra literales copiados
 * aquí: si el dueño edita el contenido, estos tests siguen midiendo lo que la
 * página realmente promete, no una copia que se quedó vieja.
 */

test.describe('RF-108 — navegación interna', () => {
  test('cada elemento de la nav apunta a un ancla que existe', async ({ page }) => {
    await page.goto('/')

    const navLinks = page.getByRole('navigation', { name: /Secciones/ }).getByRole('link')
    // Los elementos declarados en content.ts, más el enlace de marca.
    await expect(navLinks).toHaveCount(nav.items.length + 1)

    for (const item of nav.items) {
      const target = item.href.replace('#', '')
      await expect(
        page.locator(`#${target}`),
        `la nav enlaza a #${target}, que debe existir en la página`
      ).toHaveCount(1)
    }
  })

  test('la nav no introduce rutas: todos los destinos son anclas', async ({ page }) => {
    await page.goto('/')

    const hrefs = await page
      .getByRole('navigation', { name: /Secciones/ })
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))

    for (const href of hrefs) {
      expect(href, 'una sola página: la nav no puede llevar a otra ruta').toMatch(/^#/)
    }
  })

  test('la nav no tapa el salto al contenido cuando recibe el foco', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'navegación por teclado: viewport de escritorio')

    await page.goto('/')
    await page.keyboard.press('Tab')

    const skipLink = page.locator(':focus')
    await expect(skipLink).toHaveText(/Saltar al contenido/)
    await expect(skipLink).toBeVisible()
  })
})

test.describe('RF-102 — cuatro proyectos', () => {
  test('los cuatro proyectos se renderizan con nombre y captura', async ({ page }) => {
    await page.goto('/')

    expect(projects, 'la SRS v1.1 pide cuatro proyectos').toHaveLength(4)

    for (const project of projects) {
      const article = page.locator(`article[aria-labelledby="proyecto-${project.id}"]`)
      await expect(article, `falta el bloque del proyecto ${project.name}`).toHaveCount(1)
      await expect(article.getByRole('heading', { name: project.name })).toBeVisible()
      // Captura presente y con texto alternativo real.
      const image = article.locator('img')
      await expect(image).toHaveCount(1)
      await expect(image).toHaveAttribute('alt', /\S/)
    }
  })

  test('cada proyecto lista su stack y su ángulo de seguridad', async ({ page }) => {
    await page.goto('/')

    for (const project of projects) {
      const article = page.locator(`article[aria-labelledby="proyecto-${project.id}"]`)

      const techs = article.getByRole('list', { name: 'Tecnologías' }).getByRole('listitem')
      await expect(techs).toHaveCount(project.stack.length)

      await expect(
        article.getByRole('heading', { name: 'El ángulo de seguridad' }),
        `${project.name} debe declarar su ángulo de seguridad (criterio RF-102)`
      ).toBeVisible()
    }
  })

  test('todos los enlaces de proyecto son absolutos y se abren con rel seguro', async ({
    page,
  }) => {
    await page.goto('/')

    for (const project of projects) {
      const article = page.locator(`article[aria-labelledby="proyecto-${project.id}"]`)
      const links = article.getByRole('link')
      const count = await links.count()
      expect(count, `${project.name} debe tener al menos un enlace`).toBeGreaterThan(0)

      for (let i = 0; i < count; i++) {
        const link = links.nth(i)
        const href = await link.getAttribute('href')
        expect(href).toMatch(/^https:\/\//)
        // Sin acceso a window.opener desde la pestaña nueva.
        expect(await link.getAttribute('rel')).toContain('noopener')
      }
    }
  })
})

test.describe('RF-106 / RF-107 — perfil, trayectoria y habilidades', () => {
  test('la trayectoria lista todas las entradas del CV, en una lista ordenada', async ({
    page,
  }) => {
    await page.goto('/')

    const entries = page.locator('#trayectoria ol > li')
    await expect(entries).toHaveCount(timeline.entries.length)

    // Cada entrada muestra su periodo: una cronología sin fechas no es una
    // cronología.
    for (const entry of timeline.entries) {
      await expect(page.locator('#trayectoria')).toContainText(entry.period)
      await expect(page.locator('#trayectoria')).toContainText(entry.organization)
    }
  })

  test('las habilidades salen como chips agrupados, no como prosa', async ({ page }) => {
    await page.goto('/')

    for (const group of skills.groups) {
      const heading = page.locator('#habilidades').getByRole('heading', { name: group.label })
      await expect(heading).toBeVisible()
    }

    // Todos los elementos de todos los grupos están presentes.
    const totalItems = skills.groups.reduce((sum, group) => sum + group.items.length, 0)
    const chips = page.locator('#habilidades ul li')
    expect(await chips.count()).toBeGreaterThanOrEqual(totalItems)
  })

  test('el perfil no contradice el CV: correo y ubicación coinciden', async ({ page }) => {
    await page.goto('/')

    const perfil = page.locator('#perfil')
    await expect(perfil).toContainText('luiscerontrabajos@gmail.com')
    await expect(perfil).toContainText('Pasto, Nariño, Colombia')
  })
})

test.describe('Animaciones', () => {
  /**
   * Estos tests existen por un bug real: la primera versión ocultaba todo por
   * CSS y dependía del observer para mostrarlo. Resultado: 9 de 10 bloques se
   * quedaban invisibles después de recorrer la página entera. Ver
   * tasks/lessons.md.
   */

  test('el contenido animado termina visible tras recorrer la página', async ({ page }) => {
    await page.goto('/')

    /*
     * `scroll-behavior: smooth` está activo en el sitio, así que un bucle de
     * `window.scrollTo` se interrumpe a sí mismo y la página nunca llega a
     * pasar de verdad por las secciones. Se desactiva durante la medición para
     * que el scroll sea instantáneo: si no, el test mide su propio artefacto
     * en vez del comportamiento real.
     */
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })

    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y)
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
      }
    })
    await page.waitForTimeout(900)

    const stuck = await page.locator('.reveal').evaluateAll((nodes) =>
      nodes
        .filter((node) => Number(getComputedStyle(node).opacity) < 0.9)
        .map((node) => node.textContent?.slice(0, 60) ?? '')
    )

    expect(stuck, 'ningún bloque puede quedarse invisible tras pasar por él').toEqual([])
  })

  test('sin scroll y sin animación, el contenido de abajo ya es legible', async ({ page }) => {
    /*
     * El caso del crawler, de Lighthouse y del JavaScript que no llega: nadie
     * hace scroll y aun así el contenido tiene que estar ahí. Se comprueba
     * sobre el HTML del servidor, sin ejecutar nada.
     */
    const response = await page.request.get('/')
    const html = await response.text()

    // Ningún bloque puede venir ya oculto desde el servidor.
    expect(html).not.toContain('data-reveal="hidden"')
    // Y el contenido de las secciones de abajo tiene que estar en ese HTML.
    expect(html).toContain('Politécnico Grancolombiano')
    expect(html).toContain('KOA Store')
  })

  test('con prefers-reduced-motion el contenido es visible desde el principio', async ({
    browser,
  }) => {
    // Contexto nuevo con la preferencia activada: es la única forma de probar
    // que la regla existe de verdad y no es una suposición.
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')

    // Sin hacer scroll: los bloques de más abajo ya deben estar a opacidad 1.
    const opacities = await page
      .locator('.reveal')
      .evaluateAll((nodes) => nodes.map((node) => Number(getComputedStyle(node).opacity)))

    expect(opacities.length).toBeGreaterThan(0)
    for (const opacity of opacities) {
      expect(opacity).toBe(1)
    }

    await context.close()
  })
})
