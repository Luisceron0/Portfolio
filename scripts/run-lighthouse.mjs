#!/usr/bin/env node
/**
 * Ejecuta Lighthouse CI usando el Chromium que ya trae Playwright.
 *
 * Sin esto, `lhci autorun` falla con "Chrome installation not found": el
 * sandbox no tiene un `google-chrome` de sistema, y `chromium_headless_shell`
 * (que sí instalamos para los tests) no sirve para Lighthouse. El binario
 * correcto es el Chromium completo que Playwright descarga aparte, dentro
 * de chrome-linux64, que SÍ está disponible porque Playwright ya lo bajó.
 *
 * `chrome-launcher` (usado por Lighthouse) respeta CHROME_PATH, así que no
 * hace falta tocar lighthouserc.json ni fijar un número de revisión: se
 * resuelve con la propia API de Playwright, que ya sabe dónde lo dejó.
 *
 * Uso: npm run lighthouse
 */

import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'

const chromePath = chromium.executablePath()

execFileSync('npx', ['lhci', 'autorun'], {
  stdio: 'inherit',
  env: { ...process.env, CHROME_PATH: chromePath },
})
