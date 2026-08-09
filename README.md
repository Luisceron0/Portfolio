# Sitio personal de Luis Alejandro Cerón Muñoz

Página única cuyo único objetivo es convertir los primeros 60 segundos de un
reclutador en un contacto o en un clic a GitHub. Especificación completa en
[SRS-personal-site.md](SRS-personal-site.md); reglas de stack y seguridad en
[.github/copilot-instructions.md](.github/copilot-instructions.md); plan por
fases en [tasks/todo.md](tasks/todo.md).

## Stack

Next.js 14 (App Router) · Tailwind CSS · Resend (Fase 2) · Cloudflare Turnstile
(Fase 2) · Playwright · Vercel · Node.js 18+.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # rellenar solo cuando llegue la Fase 2
npm run dev
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run test:e2e` | Playwright (levanta el build de producción, no `dev`) |
| `npm run check:secrets` | Escaneo de secretos local, sin dependencias |
| `npm run check:pending` | Falla si queda algún `[PENDIENTE]` en `src/content.ts` |
| `npm run verify:guardrails` | Valida la regla ESLint de T-104 contra un fixture vulnerable |
| `npm run verify:semgrep` | Valida las reglas Semgrep propias contra su fixture |
| `npm run scan:semgrep` | Escanea `src/` con las reglas Semgrep propias |
| `npm run check:contrast` | Mide (no asume) el contraste WCAG AA de la paleta |
| `npm run check:dashes` | Falla si hay rayas largas en el copy visible |
| `npm run lighthouse` | Lighthouse CI, gate ≥95 Performance / ≥95 Accessibility |

## Formulario de contacto sin credenciales reales

`CONTACT_TEST_MODE=1` activa las claves de prueba **oficiales** de Cloudflare
Turnstile (públicas, no son secretos): el widget se resuelve solo, pero la
verificación real contra Cloudflare sigue ocurriendo, nunca se desactiva.
`CONTACT_DRY_RUN=1` hace que el correo se registre en memoria en vez de
enviarse. Sin ninguna de las dos variables, el formulario funciona igual pero
el envío falla en el punto de integración, así se prueba el estado de error
sin necesitar una clave de Resend real. Ninguna de las dos se activa en un
despliegue de producción (`src/lib/test-mode.ts` aborta el arranque si lo
detecta).

```bash
CONTACT_TEST_MODE=1 CONTACT_DRY_RUN=1 npm run dev
```

## Dónde se edita el contenido

Todo en [`src/content.ts`](src/content.ts). Ningún componente contiene texto
visible: para cambiar una frase, un enlace o una captura se edita ese archivo y
nada más.

El sitio es bilingüe (RF-109): cada texto visible es un objeto con `es` y `en`,
**ambos obligatorios**. Si olvidas una traducción, no compila. El idioma se
elige con `?lang=en` sobre la misma página, se resuelve en el servidor, y un
valor desconocido cae a español.

Los datos que aún no se pueden respaldar se escriben como
`[PENDIENTE: descripción]`. La página los muestra como un aviso amarillo bien
visible en lugar de renderizar un enlace roto, y `npm run check:pending` los
enumera. **Nunca se rellenan con valores inventados**: ese es exactamente el
fallo que el mecanismo previene.

## Seguridad

- **CSP** con directivas explícitas y nonce por petición
  ([`src/lib/csp.ts`](src/lib/csp.ts) + [`src/middleware.ts`](src/middleware.ts)).
  Presente en toda respuesta; verificado por
  [`e2e/security-headers.spec.ts`](e2e/security-headers.spec.ts), no asumido.
- **Bilingüe sin rutas nuevas**: el idioma va en `?lang=`, resuelto en servidor.
- **Secretos**: solo en `.env.local`, ignorado por git. En CI corren gitleaks y
  el escáner local.
- **Sin base de datos ni PII persistida.** El mensaje del formulario pasa al
  proveedor de correo y no se guarda en ningún sitio.
- **Sin telemetría ni fuentes externas**: cero peticiones a terceros al cargar
  la página.
- El dominio sale siempre de `site.url` en `src/content.ts`, **jamás** del
  header `Host` (T-104).

## Estado

Fases 1-3 completas (andamiaje, formulario de contacto, contenido real de los
cuatro proyectos, perfil y trayectoria, bilingüe ES/EN) y desplegadas en GitHub
con CI en verde ([Actions](https://github.com/Luisceron0/Portfolio/actions)):
128 tests de Playwright, Semgrep y ESLint validados contra fixtures vulnerables
propios, Lighthouse CI en el gate ≥95/≥95, todo verificado en un run real de
GitHub Actions y no solo en local. Faltan 3 datos del dueño: dominio propio y
los dos PDF del CV. Conectar el repo a Vercel es un paso manual pendiente (ver
`tasks/todo.md`, Fase 4b): requiere la sesión autenticada del dueño. Ver
[tasks/todo.md](tasks/todo.md) y [tasks/plan.md](tasks/plan.md) para el
detalle y qué lo bloquea.
