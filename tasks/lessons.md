# Lessons learned

## 2026-08-08 — `actions/upload-artifact@v4` excluye rutas con punto inicial por defecto
**Contexto:** primer run real de CI. El job `Lighthouse CI` pasó (✓, gate
≥95/≥95 cumplido), pero el paso de subir el artefacto avisó: `No files were
found with the provided path: .lighthouseci/`. El job `Playwright`, con
`path: playwright-report/` (sin punto inicial), sí subió su artefacto sin
problema en el mismo run.
**Primer intento fallido:** cambiar el patrón a `.lighthouseci/**/*.json`
asumiendo que era un problema de glob. Se verificó en un SEGUNDO run real de
CI: **siguió sin subir nada**, mismo aviso. El patrón no era la causa.
**Causa real:** `include-hidden-files` es `false` por defecto en
`actions/upload-artifact@v4` (visible en el log del propio job `Playwright`,
que lo declara explícitamente aunque no se haya puesto a mano) — cualquier
ruta que empiece con punto se trata como oculta y se excluye del artefacto,
sin importar el patrón.
**Corrección:** `path: .lighthouseci/` (la ruta simple, como al principio) +
`include-hidden-files: true` explícito.
**Regla para el futuro:** ante un fallo de CI, verificar la causa en un run
real antes de aplicar la segunda corrección — la primera hipótesis (glob) era
razonable pero incorrecta, y sin volver a correr CI de verdad se habría dado
por resuelta sin estarlo.
**Tags:** #ci #github-actions #falso-verde

## 2026-08-08 — `globalSetup` de Playwright 1.62 corre DESPUÉS del plugin `webServer`, no antes
**Contexto:** el primer deploy real disparó CI de verdad por primera vez (push a
GitHub). El job `Playwright` falló con `[WebServer] Error: Could not find a
production build in the '.next' directory` — el mismo error que
`globalSetup` (`e2e/global-setup.ts`, que corría `npm run build`) existía
específicamente para evitar. Todas las corridas locales anteriores habían
pasado, así que el fallo pareció "solo en CI" al principio.
**Investigación, no suposición:** en vez de asumir una diferencia de entorno,
se reprodujo en local con `.next` borrado y el comando exacto de CI
(`npm run test:e2e`, sin argumentos extra) — falló igual. Se instrumentó
`global-setup.ts` con `console.error` al cargar el módulo y al invocar la
función: **cero salida**, ni siquiera el trace de que el módulo se importó.
Se leyó el código fuente instalado (`node_modules/playwright/lib/runner/index.js`,
`createGlobalSetupTasks`): el array de tareas es
`[removeOutputDirs, ...pluginSetupTasks, ...globalTeardowns, ...globalSetups]`
— el plugin de `webServer` (que arranca los servidores) vive dentro de
`pluginSetupTasks`, que se ejecuta ANTES que `globalSetups` en esa misma lista.
Las corridas "verdes" anteriores solo funcionaban porque ya había un `.next`
de un `npm run build` manual previo en la misma sesión de shell — nunca fue
`globalSetup` lo que lo generaba.
**Error a evitar:** confiar en el orden de ejecución de `globalSetup` vs
`webServer` sin verificarlo contra la versión instalada — la documentación
más antigua/genérica de Playwright describe `globalSetup` corriendo antes de
todo, pero en 1.62.1 el plugin de `webServer` se registra primero en la cola.
**Corrección:** se eliminó `e2e/global-setup.ts` y la clave `globalSetup` de
`playwright.config.ts`. El build ahora se garantiza encadenándolo en el propio
script: `"test:e2e": "npm run build && playwright test"` — determinista,
independiente del orden interno de tareas de Playwright.
**Regla para el futuro:** cuando un mecanismo "debería funcionar" y no lo
hace, instrumentar con trazas (`console.error`) antes de teorizar. Y no
confiar en el orden de hooks de un framework de terceros sin leer el código
fuente de la versión instalada — el comportamiento documentado puede haber
cambiado entre versiones mayores.
**Tags:** #playwright #ci #falso-verde

## 2026-08-08 — El job `lighthouse` de CI nunca instalaba el Chromium que necesitaba
**Contexto:** `scripts/run-lighthouse.mjs` resuelve el Chromium a usar con
`playwright-core`'s `chromium.executablePath()`, para no depender de un
`google-chrome` de sistema (ver la lección anterior sobre por qué). Funcionaba
en local porque ya había corrido `npx playwright install` para los tests
E2E. El job `lighthouse` de `.github/workflows/ci.yml`, en cambio, nunca corre
ese install — solo el job `e2e` lo hace, en su propio runner aislado.
**Error a evitar:** verificar Lighthouse solo en local y asumir que CI se
comporta igual. Cada job de GitHub Actions es un runner limpio; nada instalado
por otro job está disponible.
**Corrección:** se añadió `npx playwright install --with-deps chromium` al job
`lighthouse`, antes de `npm run build`.
**Regla para el futuro:** cualquier script que dependa de un binario de
Playwright necesita su propio paso de instalación en CADA job de CI que lo
use — no se comparte entre jobs.
**Tags:** #ci #playwright #lighthouse

## 2026-08-08 — Una imagen pegada en el chat no tiene ruta de archivo; busca el original en el repo antes de pedir un re-subida
**Contexto:** el usuario pegó 10 capturas de CareLink directamente en el chat para
RF-102. `find` en `/tmp` y rutas típicas de portapapeles no encontró ningún
archivo — las imágenes pegadas así son contenido visual del mensaje, no
archivos en disco accesibles por Bash/Read.
**Error a evitar:** pedir de vuelta el mismo archivo en otro formato cuando el
usuario ya dijo dónde vive el original. El propio README de CareLink apuntaba a
`docs/portfolio/screenshots/` dentro del repo público — los mismos PNG,
descargables por HTTPS con `curl`/`gh api`, sin tocar el repo (solo lectura de
un asset público).
**Corrección:** `gh api repos/.../contents/docs/portfolio/screenshots` listó los
`download_url` de cada imagen; se descargó la relevante directo a
`public/proyectos/`. Cero re-trabajo pedido al usuario.
**Regla para el futuro:** si el usuario pega una imagen y menciona (o la SRS ya
documentó) que el original vive en un repo o URL público, buscar y descargar el
archivo de la fuente en vez de depender del pegado en el chat. Pegar en el chat
sirve para que yo vea el contenido y decida cuál usar, no como mecanismo de
transferencia de archivos.
**Tags:** #tooling #contenido

## 2026-08-08 — Los proyectos de Playwright comparten servidor y comparten IP de origen
**Contexto:** el test de rate limit (RF-104) fallaba de forma intermitente
(2 de 3 corridas) solo en el proyecto `mobile`, siempre en el mismo punto. La
hipótesis inicial fue un doble submit por eventos táctiles sintéticos; se
descartó instrumentando los POST reales de un click (siempre 1, nunca 2).
**Error a evitar:** en `playwright.config.ts`, el array `webServer` arranca UN
proceso por puerto, compartido por TODOS los proyectos (`chromium`, `mobile`).
La emulación "mobile" de Playwright cambia viewport y user agent, pero las
peticiones siguen saliendo de la misma máquina — misma IP 127.0.0.1 — que el
proyecto `chromium`. Contra un servidor dedicado a probar rate limit por IP,
el proyecto que corre segundo hereda la cuota ya gastada por el primero.
**Corrección:** el test de rate limit se salta en todo proyecto que no sea
`chromium` (`e2e/contact-form.spec.ts`), con el motivo explicado en el propio
test. Es una decisión de cobertura correcta, no un recorte: el rate limit es
lógica de servidor por IP, no depende del viewport, así que probarlo una vez
es suficiente.
**Regla para el futuro:** cualquier test contra un servidor dedicado con
estado compartido entre peticiones (rate limit, cuotas, contadores) se corre
en un solo proyecto de Playwright, nunca en la matriz completa — o se le da un
identificador de cliente único por proyecto para no compartir el contador.
**Tags:** #testing #playwright #falso-flaky

## 2026-08-08 — Un archivo `'use server'` no puede exportar un objeto, y ni tsc ni next build lo detectan
**Contexto:** `src/app/actions/contact.ts` exportaba `ContactState` (tipo),
`ContactErrorCode` (tipo) y `initialContactState` (un objeto) junto a la función
async `submitContact`. `npm run typecheck` y `npm run build` pasaron limpios.
El error solo apareció al ejecutar `npx playwright test` de verdad: la página
tiraba abajo con `Error: A "use server" file can only export async functions,
found object.`
**Error a evitar:** Next.js exige que un módulo `'use server'` exporte
ÚNICAMENTE funciones async. Los tipos no cuentan (se borran en compilación, por
eso tsc no protesta) pero una constante como `initialContactState` sí es un
export en runtime y rompe la regla. Ninguna de las capas de verificación
"rápidas" (typecheck, build) lo detecta — hace falta arrancar el servidor y
pedir la página.
**Corrección:** el estado inicial y los tipos se movieron a
`src/lib/contact-state.ts`, un módulo normal sin `'use server'`. El archivo de
la action solo exporta `submitContact`.
**Regla para el futuro:** cualquier archivo `'use server'` se revisa a mano:
¿exporta algo que no sea una función async? Si sí, ese export se muda a otro
archivo antes de dar la Fase por terminada. Un build en verde no es evidencia
suficiente para este error concreto — hace falta correr la app.
**Tags:** #nextjs #server-actions #falso-verde

## 2026-08-07 — Un `<footer>` dentro de `<main>` no expone el landmark `contentinfo`
**Contexto:** en la Fase 1, `page.tsx` renderizaba `<main><Hero/>…<Footer/></main>`
porque parecía lo natural. El test de accesibilidad falló:
`getByRole('contentinfo')` devolvía 0 elementos, en escritorio y en móvil.
**Error a evitar:** `<footer>` solo mapea al rol `contentinfo` cuando su
antecesor más cercano es `<body>`. Anidado dentro de `<main>`, `<section>`,
`<article>` o `<aside>` pasa a ser un pie de esa sección concreta y desaparece
como landmark de página. Visualmente idéntico, así que a ojo no se detecta.
**Corrección:** `<Footer />` es hermano de `<main>`, no hijo. Ver el comentario
en `src/app/page.tsx`, que existe para que nadie lo "arregle" metiéndolo dentro.
**Regla para el futuro:** los landmarks se verifican con `getByRole`, nunca
mirando la página. Un checkbox de accesibilidad marcado a ojo no está verificado.
**Tags:** #accesibilidad #wcag

## 2026-08-07 — La CSP con nonce obliga a renderizado dinámico
**Contexto:** la CSP usa `'nonce-…'` + `'strict-dynamic'` generado por petición
en `src/middleware.ts`. Con el renderizado estático por defecto de Next, el HTML
se genera en build y lleva incrustado un nonce que ya no coincide con el de la
cabecera de esa petición, así que el navegador bloquea los scripts de Next y la
página nunca hidrata.
**Error a evitar:** dar por bueno que "la CSP está puesta" porque la cabecera
aparece en `curl`. La cabecera puede estar perfecta y la página estar rota.
**Corrección:** `export const dynamic = 'force-dynamic'` en `src/app/page.tsx`.
El coste es nulo aquí (la página no hace fetch de nada) y evita tener que
recurrir a `'unsafe-inline'` en `script-src`.
**Regla para el futuro:** toda ruta nueva que se añada bajo esta CSP necesita lo
mismo. `e2e/landing.spec.ts` escucha errores de consola y `pageerror`
precisamente para que un bloqueo de CSP falle el test en vez de pasar inadvertido.
**Tags:** #security #csp #nextjs

## 2026-08-07 — `devices['iPhone SE']` de Playwright es 320x568, no 375
**Contexto:** RF-101 exige que el hero se lea sin scroll en un viewport de
375 px. Se usó el descriptor `devices['iPhone SE']` por parecer el equivalente
obvio; en realidad describe el SE de 1.ª generación: 320x568.
**Error a evitar:** el test habría estado midiendo un ancho más estrecho que el
del criterio. Habría fallado de más (falso positivo, obligando a recortar copy
sin necesidad) y, con otro descriptor, podría fallar de menos y dar por cerrado
un criterio incumplido.
**Corrección:** el viewport se fija a mano en `playwright.config.ts` a
375x667, conservando del descriptor solo la emulación móvil. El test afirma
`toBe(375)`, no `toBeLessThanOrEqual(375)`.
**Regla para el futuro:** si un criterio de la SRS da una cifra, el test compara
contra esa cifra exacta. Un descriptor de dispositivo es una comodidad, no una
fuente de verdad sobre el requisito.
**Tags:** #testing #requisitos

## 2026-08-07 — `tsc --noEmit` con `incremental` repite errores ya corregidos
**Contexto:** tras añadir `"target": "ES2022"` al `tsconfig.json`, `npm run
typecheck` seguía dando el mismo TS2802 de antes del cambio.
**Error a evitar:** buscar el fallo en el código cuando el fallo estaba en la
caché. `tsconfig.tsbuildinfo` no se invalidó al cambiar la configuración.
**Corrección:** borrar `tsconfig.tsbuildinfo` y volver a ejecutar. En CI no
ocurre: el checkout es limpio.
**Regla para el futuro:** ante un error de tipos que sobrevive a un cambio de
`tsconfig.json`, borrar el `.tsbuildinfo` antes de tocar nada más.
**Tags:** #tooling #typescript

## [PENDIENTE: date] — Port the Turnstile fail-closed lesson from koa-landing
**Context:** koa-landing shipped a bug where the contact form could be submitted
before Turnstile delivered its token, causing a 400. It was fixed there
(`fix(waitlist): no permitir submit antes de que Turnstile entregue el token (400)`).
**Error to avoid here:** implementing the contact form without checking that lesson
first and re-discovering the same bug independently.
**Correction:** disable the submit button until the token is present; verified in
Phase 2 of `tasks/todo.md` before, not after, the form ships.
**Rule for the future:** before building a form pattern that already exists
elsewhere in the portfolio (Resend + Turnstile), read that repo's `tasks/lessons.md`
first. Don't relearn a lesson that's already written down.
**Tags:** #security #reused-pattern

<!-- New entries go above this line, most recent first. -->
