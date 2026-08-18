import { expect, test, type Page } from '@playwright/test'

import { cv, LOCALES, nav, projects, skills, timeline, type Locale } from '@/content'

/**
 * Criterios de aceptación de RF-102 (5 proyectos), RF-106 (perfil y
 * trayectoria), RF-107 (habilidades), RF-108 (navegación interna) y RF-109
 * (bilingüe).
 *
 * Se comprueba contra `src/content.ts` en vez de contra literales copiados
 * aquí: si el dueño edita el contenido, estos tests siguen midiendo lo que la
 * página realmente promete, no una copia que se quedó vieja.
 */

/** URL de la página en un idioma. El español es el idioma por defecto. */
function pageUrl(locale: Locale): string {
  return locale === 'es' ? '/' : `/?lang=${locale}`
}

async function gotoLocale(page: Page, locale: Locale) {
  await page.goto(pageUrl(locale))
}

test.describe('RF-108 — navegación interna', () => {
  test('cada elemento de la nav apunta a un ancla que existe', async ({ page }) => {
    await page.goto('/')

    for (const item of nav.items) {
      const target = item.href.replace('#', '')
      await expect(
        page.locator(`#${target}`),
        `la nav enlaza a #${target}, que debe existir en la página`
      ).toHaveCount(1)
    }
  })

  test('los destinos de sección son anclas, nunca rutas nuevas', async ({ page }) => {
    await page.goto('/')

    const hrefs = await page
      .getByRole('navigation')
      .getByRole('list')
      .first()
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))

    expect(hrefs.length).toBe(nav.items.length)
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

test.describe('RF-109 — bilingüe', () => {
  test('el atributo lang del documento coincide con el idioma renderizado', async ({
    page,
  }) => {
    for (const locale of LOCALES) {
      await gotoLocale(page, locale)
      await expect(
        page.locator('html'),
        `?lang=${locale} debe producir <html lang="${locale}">`
      ).toHaveAttribute('lang', locale)
    }
  })

  test('el lang correcto llega ya en la respuesta del servidor, sin ejecutar JS', async ({
    page,
  }) => {
    // Criterio explícito: el idioma se resuelve en servidor, no con un
    // intercambio en el cliente.
    const response = await page.request.get('/?lang=en')
    const html = await response.text()

    expect(html).toContain('lang="en"')
    // Y el contenido ya viene traducido en ese mismo HTML.
    expect(html).toContain('Full-Stack Software Engineer')
  })

  test('el contenido cambia realmente de idioma', async ({ page }) => {
    await gotoLocale(page, 'es')
    await expect(page.getByRole('heading', { name: 'Perfil', exact: true })).toBeVisible()

    await gotoLocale(page, 'en')
    await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible()
  })

  test('el selector de idioma son enlaces, para que el idioma sea compartible', async ({
    page,
  }) => {
    await page.goto('/')

    const group = page.getByRole('group', { name: /Idioma|Language/ })
    const links = group.getByRole('link')
    await expect(links).toHaveCount(LOCALES.length)

    // Enlaces reales con href, no botones que dependan de JavaScript.
    const hrefs = await links.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href') ?? '')
    )
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/?lang=en')
  })

  test('un idioma desconocido cae al español, nunca a una página en blanco', async ({
    page,
  }) => {
    const response = await page.goto('/?lang=zz')

    expect(response?.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('el idioma no introduce rutas nuevas: sigue siendo la misma página', async ({
    page,
  }) => {
    await gotoLocale(page, 'en')
    expect(new URL(page.url()).pathname).toBe('/')
  })
})

test.describe('RF-102 — cinco proyectos', () => {
  test('los cinco proyectos se renderizan con nombre y captura', async ({ page }) => {
    await page.goto('/')

    expect(projects, 'la SRS v1.3 pide cinco proyectos').toHaveLength(5)

    for (const project of projects) {
      const article = page.locator(`article[aria-labelledby="proyecto-${project.id}"]`)
      await expect(article, `falta el bloque del proyecto ${project.name}`).toHaveCount(1)
      await expect(article.getByRole('heading', { name: project.name })).toBeVisible()
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
        expect(await link.getAttribute('href')).toMatch(/^https:\/\//)
        // Sin acceso a window.opener desde la pestaña nueva.
        expect(await link.getAttribute('rel')).toContain('noopener')
      }
    }
  })

  test('KOA Store enlaza a su versión localizada, verificada, y el resto no', async ({
    page,
  }) => {
    /*
     * Solo store.koa.elevaforge.com tiene versión en inglés (/en devuelve 200).
     * koa.elevaforge.com y elevaforge.com devuelven 404 en /en, así que sus
     * enlaces NO deben localizarse. Criterio de RF-109: verificado por URL,
     * nunca supuesto.
     */
    await gotoLocale(page, 'en')
    const store = page.locator('article[aria-labelledby="proyecto-koa-store"]')
    await expect(store.getByRole('link', { name: /store\.koa\.elevaforge\.com/ })).toHaveAttribute(
      'href',
      'https://store.koa.elevaforge.com/en'
    )

    const landing = page.locator('article[aria-labelledby="proyecto-koa-landing"]')
    await expect(
      landing.getByRole('link', { name: /koa\.elevaforge\.com/ }).first()
    ).toHaveAttribute('href', 'https://koa.elevaforge.com/')
  })
})

test.describe('RF-106 / RF-107 — perfil, trayectoria y habilidades', () => {
  test('la trayectoria lista todas las entradas del CV, en una lista ordenada', async ({
    page,
  }) => {
    await page.goto('/')

    const entries = page.locator('#trayectoria ol > li')
    await expect(entries).toHaveCount(timeline.entries.length)

    // Cada entrada muestra su periodo: una cronología sin fechas no lo es.
    for (const entry of timeline.entries) {
      await expect(page.locator('#trayectoria')).toContainText(entry.period.es)
      await expect(page.locator('#trayectoria')).toContainText(entry.organization)
    }
  })

  test('las habilidades salen como chips agrupados, no como prosa', async ({ page }) => {
    await page.goto('/')

    for (const group of skills.groups) {
      await expect(
        page.locator('#habilidades').getByRole('heading', { name: group.label.es })
      ).toBeVisible()
    }

    const totalItems = skills.groups.reduce((sum, group) => sum + group.items.es.length, 0)
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

    expect(html).not.toContain('data-reveal="hidden"')
    expect(html).toContain('Politécnico Grancolombiano')
    expect(html).toContain('KOA Store')
  })

  test('con prefers-reduced-motion el contenido es visible desde el principio', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')

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

test.describe('RF-103 — descarga del CV', () => {
  /**
   * El criterio de aceptación es literal: "ambos PDF abren/descargan sin un
   * enlace roto". Un href con buena pinta no es lo mismo que un archivo que
   * responde 200 con el tipo de contenido correcto. Generados con RenderCV a
   * partir de cv/luis-ceron-cv-es.yaml y cv/luis-ceron-cv-en.yaml.
   */
  test('ambos PDF del CV responden 200 con Content-Type de PDF', async ({ page, request }) => {
    for (const download of cv.downloads) {
      const response = await request.get(download.href)
      expect(response.status(), `${download.fileName} debe responder 200`).toBe(200)
      expect(response.headers()['content-type']).toContain('application/pdf')

      // Un PDF real pesa varias decenas de KB; un archivo vacío o un 404
      // disfrazado no lo haría.
      const body = await response.body()
      expect(body.byteLength, `${download.fileName} no puede estar vacío`).toBeGreaterThan(10_000)
      // Firma binaria %PDF: confirma que es un PDF de verdad, no HTML de error.
      expect(body.subarray(0, 4).toString('latin1')).toBe('%PDF')
    }

    // Y que el botón en la página apunta exactamente a esas rutas.
    await page.goto('/')
    for (const download of cv.downloads) {
      const link = page.getByRole('link', { name: download.label.es })
      await expect(link).toHaveAttribute('href', download.href)
    }
  })

  test('los nombres de archivo son descriptivos, no genéricos', async () => {
    for (const download of cv.downloads) {
      expect(download.fileName).toMatch(/^luis-ceron-cv-(es|en)\.pdf$/)
    }
  })
})
