import { expect, test } from '@playwright/test'

/**
 * Criterio de Fase 4: "CSP presente en TODA respuesta, verificado".
 * Este archivo es la verificación. No se marca ese checkbox sin que pase.
 */

/** Convierte una cabecera CSP en un mapa directiva -> fuentes. */
function parseCsp(header: string): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const part of header.split(';')) {
    const [directive, ...sources] = part.trim().split(/\s+/)
    if (directive) map.set(directive, sources)
  }
  return map
}

test.describe('Cabeceras de seguridad', () => {
  test('el documento lleva CSP con todas las directivas explícitas', async ({ request }) => {
    const response = await request.get('/')
    expect(response.status()).toBe(200)

    const header = response.headers()['content-security-policy']
    expect(header, 'la respuesta del documento debe llevar CSP').toBeTruthy()

    const csp = parseCsp(header)

    // Las directivas que copilot-instructions exige nombrar de forma explícita.
    for (const directive of [
      'default-src',
      'script-src',
      'style-src',
      'img-src',
      'font-src',
      'connect-src',
      'frame-src',
      'form-action',
      'frame-ancestors',
      'base-uri',
      'object-src',
    ]) {
      expect(csp.has(directive), `falta la directiva ${directive}`).toBe(true)
    }

    // Turnstile: nombrado en script-src y único origen permitido en frame-src.
    expect(csp.get('script-src')).toContain('https://challenges.cloudflare.com')
    expect(csp.get('frame-src')).toEqual(['https://challenges.cloudflare.com'])
    expect(csp.get('connect-src')).toContain('https://challenges.cloudflare.com')

    // Nonce por petición, y sin 'unsafe-inline' en scripts.
    expect(csp.get('script-src')?.some((s) => s.startsWith("'nonce-"))).toBe(true)
    expect(csp.get('script-src')).not.toContain("'unsafe-inline'")
    expect(csp.get('script-src')).not.toContain("'unsafe-eval'")

    // Anti-clickjacking y anti-inyección de <base>.
    expect(csp.get('frame-ancestors')).toEqual(["'none'"])
    expect(csp.get('object-src')).toEqual(["'none'"])
    expect(csp.get('base-uri')).toEqual(["'self'"])
    expect(csp.get('form-action')).toEqual(["'self'"])
  })

  test('el nonce cambia en cada petición', async ({ request }) => {
    const first = parseCsp((await request.get('/')).headers()['content-security-policy'])
    const second = parseCsp((await request.get('/')).headers()['content-security-policy'])

    const nonceOf = (csp: Map<string, string[]>) =>
      csp.get('script-src')?.find((s) => s.startsWith("'nonce-"))

    expect(nonceOf(first)).toBeTruthy()
    expect(nonceOf(first)).not.toBe(nonceOf(second))
  })

  test('las rutas 404 también llevan CSP', async ({ request }) => {
    const response = await request.get('/ruta-que-no-existe')
    expect(response.status()).toBe(404)
    expect(response.headers()['content-security-policy']).toBeTruthy()
  })

  test('los archivos servidos desde /public también llevan CSP', async ({ request }) => {
    // El matcher del middleware excluye solo /_next/static y /_next/image;
    // /public (robots.txt, futuros PDFs y capturas) pasa por él. Sin este
    // test, "CSP en toda respuesta" era una afirmación más amplia que lo
    // realmente comprobado: nunca se había verificado un archivo de /public.
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-security-policy']).toBeTruthy()
    expect(response.headers()['x-content-type-options']).toBe('nosniff')
  })

  test('los assets estáticos llevan su propia CSP', async ({ page, request }) => {
    await page.goto('/')

    const assetUrl = await page.evaluate(() => {
      const link = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')
      const script = document.querySelector<HTMLScriptElement>('script[src*="/_next/static/"]')
      return link?.href ?? script?.src ?? null
    })

    expect(assetUrl, 'debería haber al menos un asset en /_next/static').toBeTruthy()

    const response = await request.get(assetUrl!)
    expect(response.headers()['content-security-policy']).toBeTruthy()
  })

  test('el resto de cabeceras de seguridad están presentes', async ({ request }) => {
    const headers = (await request.get('/')).headers()

    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['strict-transport-security']).toContain('max-age=')
    expect(headers['permissions-policy']).toContain('geolocation=()')
    // Sin delatar el framework.
    expect(headers['x-powered-by']).toBeUndefined()
  })

  test('T-104: un header Host falsificado no acaba en el HTML', async ({ request }) => {
    const response = await request.get('/', {
      headers: { Host: 'atacante.example' },
    })
    const body = await response.text()

    expect(body).not.toContain('atacante.example')
  })
})
