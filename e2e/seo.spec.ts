import { expect, test } from '@playwright/test'

import { LOCALES, securityCases, site } from '@/content'

/**
 * RF-112 — descubrimiento: longitudes de título y descripción, Open Graph,
 * Twitter Card, JSON-LD Person sin datos privados, sitemap y robots.
 */

test.describe('RF-112 — SEO', () => {
  test('título ≤60 y descripción ≤155 caracteres, en los dos idiomas', () => {
    for (const locale of LOCALES) {
      expect(site.title[locale].length).toBeLessThanOrEqual(60)
      expect(site.description[locale].length).toBeLessThanOrEqual(155)
    }
    for (const item of securityCases) {
      for (const locale of LOCALES) {
        expect(item.seoDescription[locale].length).toBeLessThanOrEqual(155)
      }
    }
  })

  test('la home declara Open Graph, Twitter Card e imagen de previsualización', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og$/)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1)

    const image = await page.request.get('/og')
    expect(image.status()).toBe(200)
    expect(image.headers()['content-type']).toContain('image/png')
  })

  test('JSON-LD Person: datos públicos y nada de teléfono ni correo', async ({ page }) => {
    await page.goto('/?lang=en')
    const raw = await page.locator('script[type="application/ld+json"]').textContent()
    const data = JSON.parse(raw ?? '{}')
    expect(data['@type']).toBe('Person')
    expect(data.jobTitle).toContain('Application Security Engineer')
    expect(data.sameAs).toEqual(
      expect.arrayContaining(['https://github.com/Luisceron0', 'https://www.linkedin.com/in/luis-ceronmunoz'])
    )
    expect(data.alumniOf.length).toBeGreaterThan(0)
    for (const forbidden of ['telephone', 'email', 'birthDate', 'streetAddress']) {
      expect(JSON.stringify(data)).not.toContain(forbidden)
    }
    expect(raw).not.toContain('@gmail.com')
    expect(raw).not.toContain('+57')
  })

  test('sitemap.xml lista la home y los cuatro casos; robots.txt lo declara', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    for (const item of securityCases) {
      expect(sitemap).toContain(`/casos/${item.slug}`)
    }
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/)
  })

  test('cada página tiene un solo H1', async ({ page }) => {
    for (const path of ['/', ...securityCases.map((item) => `/casos/${item.slug}`)]) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    }
  })
})
