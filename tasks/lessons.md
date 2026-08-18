# Lessons learned

## 2026-08-18 — Declarar el dominio rompió el hreflang, y el fallo solo existía CON el dominio puesto
**Contexto:** al cerrar el `[PENDIENTE]` de `site.url` con la URL de Vercel, las
etiquetas canónicas y de idioma pasaron de correctas a rotas. Antes, sin origen
declarado, Next emitía `<link rel="canonical" href="/?lang=en">` y un hreflang
por idioma, todo relativo pero correcto. Al declarar el origen, los dos idiomas
empezaron a declarar EXACTAMENTE la misma URL.
**Causa, en el código de Next, no en el nuestro:** con `metadataBase` puesto,
toda URL de metadatos pasa por `resolveAbsoluteUrlWithPathname`
(`next/dist/lib/metadata/resolvers/resolve-url.js`), que termina en:

    resolvedUrl = result.pathname === "/" ? result.origin : result.href

Este sitio es UNA sola página, así que el pathname es siempre `/`, y esa rama
devuelve el origen pelado: el `?lang=en` desaparece. Pasar la URL ya absoluta no
sirve de nada, porque el resolvedor se ejecuta igual.
**Solución:** no declarar `metadataBase` y resolver las URLs a mano con
`new URL(path, siteUrl)`. Sin `metadataBase`, Next deja pasar la cadena tal cual
y el parámetro sobrevive. `metadataBase` solo hace falta para resolver imágenes
relativas de Open Graph, y aquí no hay ninguna.
**Lo que esto enseña, que es lo que importa:** resolver un `[PENDIENTE]` no es
rellenar un hueco, es **activar** todo el código que estaba en la rama "todavía
no hay dato". Ese código nunca se había ejecutado, así que nunca se había
probado. Un valor por defecto que parece inofensivo (`metadataBase` ausente)
puede estar tapando el fallo que aparece justo el día que se pone el valor real.
Al cerrar un pendiente hay que verificar la SALIDA, no el hecho de haberlo
rellenado: aquí, mirar el HTML emitido en los dos idiomas.
Queda fijado en `e2e/content.spec.ts` con un test que compara las dos canónicas
y exige que sean distintas: si alguien vuelve a añadir `metadataBase`, se pone
rojo.
**Tags:** #nextjs #seo #pendientes #verificacion #falso-verde

## 2026-08-18 — Un PDF de CV se ve perfecto y se extrae roto: mirarlo no es verificarlo
**Contexto:** al adaptar el CV a formato Harvard optimizado para ATS, la
pregunta no era de diseño sino de mecanismo: un ATS no ve el PDF, extrae su
capa de texto. Los dos PDF anteriores se veían impecables en pantalla y el
texto extraído con `pypdf` estaba lleno de defectos que nadie habría visto
abriéndolos.
**Lo que salía roto, todo medido, no supuesto:**
- **Palabras clave partidas por la justificación.** Typst justificaba y
  activaba partición: el texto extraído decía `inte-grating`, `verti-cal`,
  `peri-odic`, `formal-icé`. Una palabra clave partida no la encuentra ningún
  buscador. `typography.alignment: left` lo deja en cero.
- **Orden de lectura invertido.** El tema `classic` maqueta la entrada en dos
  columnas, y el texto salía con las viñetas PRIMERO y la empresa, el lugar y
  las fechas DESPUÉS. Un parser que asocia fechas por proximidad se las pega a
  la entrada equivocada. El tema `harvard` pone todo eso en una sola línea
  antes de las viñetas.
- **El título de grado partido en vertical.** Iba en una columna estrecha
  propia: el inglés extraía `Post­grad­uate Spe­cial­iza­tion` con guiones
  blandos, y el español pegaba `IngenieríaUniversidad` sin espacio.
  `templates.education_entry.degree_column: null` lo mete en la misma línea.
- **El teléfono sin país.** `phone_number_format` vale `national` por defecto
  y el PDF imprimía `314 4087963`, sin el `+57`, en un CV que ofrece
  relocalización. Sale en el PDF, no solo en la extracción.
- **Iconos en vez de texto.** Los iconos de contacto no dejan texto al
  extraer, así que `luis-ceronmunoz` aparecía suelto sin nada que dijera que
  era LinkedIn. Con `display_urls_instead_of_usernames` sale el dominio.
- **El pie de página colándose dentro del contenido.** `Nombre – 1/2` aparecía
  EN MEDIO del texto extraído, partiendo la sección de Educación en dos.
**Regla para el futuro:** un artefacto que otra máquina va a leer se verifica
leyéndolo como esa máquina, no mirándolo. El comando es
`python3 -c "from pypdf import PdfReader; print('\n'.join(p.extract_text() for p in PdfReader('public/cv/luis-ceron-cv-es.pdf').pages))"`
y lo que hay que comprobar es: cero `\u00ad` (guión blando), cero `-\n` sobre
una palabra clave, el `+57` presente, y empresa/cargo/fechas en la misma línea
que precede a sus viñetas. Es el mismo principio que ya aplicamos a las reglas
de Semgrep: una comprobación que nunca se ha visto fallar no demuestra nada.
**Segundo hallazgo, el mismo de siempre:** `show_time_spans_in` había vuelto a
su valor por defecto (`['experience']`) al quedarse los YAML sin bloque
`design`, así que el PDF en inglés mostraba "3 months" bajo cada fecha y el
español no. Es exactamente la lección del 2026-08-10, repetida. Ahora el
bloque `design` vive dentro de cada YAML y está comentado opción por opción,
que es la única forma de que no se caiga otra vez sin que nadie lo note.
**Tags:** #cv #ats #rendercv #verificacion #falso-verde

## 2026-08-10 — RenderCV: mismo nombre de salida en dos renders se sobrescribe, y `show_time_spans_in` depende del título literal de la sección
**Contexto:** al generar los dos PDF del CV con RenderCV, dos gotchas que
costaron una vuelta cada una.
**Gotcha 1 — salida con el mismo nombre.** `rendercv render es.yaml` y
`rendercv render en.yaml` escriben ambos a
`rendercv_output/{cv.name}_CV.pdf` por defecto. Como el nombre de la persona
es igual en los dos YAML, el segundo render sobrescribió al primero sin
avisar. **Solución:** `--pdf-path` con el nombre final exacto en cada
render, y ojo con `--dont-generate-typst`: deshabilita el PDF también
("Disabling Typst generation implicitly disables PDF and PNG"), así que ese
flag no se puede usar si se quiere el PDF.
**Gotcha 2 — `design.sections.show_time_spans_in` no es un booleano global.**
Por defecto vale `['experience']` y compara contra el TÍTULO LITERAL de la
sección. La sección en inglés se llama "Experience" (coincide, muestra "3
months" bajo las fechas); la española se llama "Experiencia" (no coincide,
no muestra nada). Sin fijarlo a mano, los dos PDF quedan con maquetación
distinta sin que nada lo declare. **Solución:** `show_time_spans_in: []`
explícito en el bloque `design` de ambos YAML, para que el comportamiento
sea idéntico independientemente del idioma del título de sección.
**Regla para el futuro:** al generar contenido en dos idiomas con la misma
herramienta, cualquier opción de diseño que dependa de coincidir con un
título de sección hay que fijarla a mano en ambos, no confiar en el default:
el default puede depender del idioma del propio título, no ser realmente
neutral.
**Tags:** #rendercv #cv #falso-verde

## 2026-08-09 — `reuseExistingServer` convierte un servidor zombi en un falso verde
**Contexto:** tras el refactor bilingüe, la suite reportó `93 passed` en 8,4
minutos. Antes eran `114 passed` en 1,3 minutos. Menos tests de los que había,
y seis veces más lento, con exit code 0: verde mentiroso.
**Causa:** `playwright.config.ts` usa `reuseExistingServer: !process.env.CI`, o
sea `true` en local. Habían quedado vivos los `next start` de pruebas
manuales anteriores en los mismos puertos. Playwright los reutilizó en vez de
arrancar los suyos, así que **la suite entera se ejecutó contra un build
antiguo**, sin el código que se acababa de escribir. La corrida siguiente
falló con `EADDRINUSE`, que fue la pista que destapó el problema.
**Por qué importa:** el modo reuse existe para iterar rápido, pero significa
que un servidor olvidado puede hacer pasar (o fallar) tests por motivos que no
tienen nada que ver con el código actual. En CI no ocurre porque `CI=true`
fuerza servidores nuevos; el riesgo es exclusivamente local, que es justo donde
se toman las decisiones de "esto ya está listo para commitear".
**Cómo matarlos, y el detalle que cuesta media hora:** `pkill -f "next-server"`
**se mata a sí mismo**, porque la línea de comandos del propio `bash -c` que lo
ejecuta contiene la cadena "next-server" y el patrón la encuentra. Se manifiesta
como exit code 143 o 144 sin ningún mensaje. La solución es el truco de
corchetes: `pkill -f "[n]ext-server"`. El regex `[n]ext-server` casa con
"next-server" pero NO con el literal "[n]ext-server" de la propia línea.
**Regla para el futuro:** antes de fiarse de una corrida local, comprobar que
los puertos están libres. Si el número de tests o la duración cambian de forma
inexplicable respecto a la corrida anterior, sospechar del servidor antes que
del código.
**Tags:** #playwright #falso-verde #tooling

## 2026-08-09 — Una animación "reveal on scroll" no puede ser requisito para leer la página
**Contexto:** al añadir animaciones de aparición se hizo lo que hace casi todo
tutorial: `.reveal { opacity: 0 }` en CSS, y un IntersectionObserver que añade
la clase que lo muestra. Se verificó con una captura de pantalla completa: el
encabezado "Perfil" aparecía y **todo lo demás estaba en blanco**. Consultando
el DOM: de 10 bloques `.reveal`, **9 seguían en `opacity: 0`** después de
recorrer la página entera.
**Dos fallos, uno encima del otro:**
1. *Del método de prueba:* el sitio tiene `scroll-behavior: smooth`, así que un
   bucle de `window.scrollTo(0, y)` se interrumpe a sí mismo — la página nunca
   pasa de verdad por las secciones y el observer no dispara. Un test que
   scrollea así mide su propio artefacto.
2. *Del diseño, y este es el grave:* poner el contenido en `opacity: 0` por
   defecto convierte la animación en un **requisito para leer la página**.
   Falla con un crawler o Lighthouse que renderiza sin hacer scroll, con
   JavaScript lento o bloqueado, y con cualquier salto de scroll que no active
   el observer. Un `<noscript><style>` tapa solo el caso "sin JS" y deja fuera
   todos los demás.
**Corrección:** se invirtió el estado por defecto. El servidor renderiza todo
con `data-reveal="static"`, que no lleva ningún estilo de ocultación: visible.
Solo al montar en el cliente, y solo para bloques que están POR DEBAJO del
viewport (que nadie está mirando todavía), el componente pasa a `hidden` y los
observa. El peor caso posible pasó a ser "no hay animación" en vez de "no hay
contenido".
**Regla para el futuro:** cualquier efecto que oculte contenido debe ocultarlo
desde el cliente y solo donde el usuario no lo esté viendo. Si el HTML que sale
del servidor ya trae contenido invisible, el efecto dejó de ser decoración y
pasó a ser un punto único de fallo. El test que lo cubre comprueba el HTML del
servidor directamente (`page.request.get`), sin ejecutar JavaScript.
**Tags:** #animaciones #accesibilidad #progressive-enhancement #falso-verde

## 2026-08-08 — Dos gotchas de `agent-browser` que cuestan tiempo si no se conocen
**Contexto:** usado repetidamente para verificación visual (checkpoint del
formulario, capturas de KOA en vivo, QA del rediseño).
**Gotcha 1 — `screenshot <selector>` puede devolver un PNG en blanco.**
`agent-browser screenshot "#contacto" archivo.png` guardó una imagen
completamente en blanco más de una vez, sin error. No investigado a fondo
(¿el elemento fuera del viewport en el momento de la captura, aunque
`scrollintoview` ya se hubiera corrido?). **Solución de trabajo:**
`screenshot --full` (página completa) siempre funciona; si hace falta solo una
sección, recortarla después con Pillow (`Image.crop`) en vez de confiar en el
selector.
**Gotcha 2 — el viewport NO se fija con `agent-browser viewport <w> <h>`.**
Ese comando no existe (`Unknown command: viewport`), aunque aparece así en un
fragmento de `--help`. El comando real está bajo el grupo "Browser Settings":
`agent-browser set viewport <w> <h>`.
**Regla para el futuro:** para capturas de verificación visual, preferir
`screenshot --full` + recorte posterior sobre `screenshot <selector>`. Para
fijar viewport, `agent-browser set viewport <w> <h>`, no `agent-browser
viewport <w> <h>`.
**Tags:** #agent-browser #tooling

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

## 2026-08-10 — `agent-browser screenshot --full` no dispara las revelaciones por scroll
**Contexto:** al verificar visualmente la tarjeta terminal y los iconos nuevos
de RF-110 (Fase 3e), una captura de página completa (`--full`) inmediatamente
después de `open` mostró casi todo el contenido bajo el hero en blanco: cajas
vacías del tamaño correcto pero sin texto.
**Error a evitar:** interpretarlo como una regresión y ponerse a depurar
componentes que en realidad estaban bien. `--full` cambia el tamaño del
viewport para capturar todo el documento, pero no hace scroll real por la
página, así que el `IntersectionObserver` de `Reveal` (ver la entrada de
"`.reveal{opacity:0}` por defecto" más abajo) nunca dispara para el contenido
bajo el pliegue inicial: se queda en `data-reveal="hidden"`.
**Corrección:** antes de una captura de página completa con fines de QA
visual, hacer scroll manual por toda la página primero (`agent-browser scroll
down <px>` varias veces) para que el observer marque todo como
`data-reveal="shown"`, y solo entonces capturar.
**Regla para el futuro:** cualquier verificación visual de una página con
animaciones de aparición-al-scroll necesita un scroll real antes de la
captura, sea con `agent-browser` o cualquier otra herramienta. Un `--full` o
equivalente que solo redimensiona el viewport no basta.
**Tags:** #testing #agent-browser #rf-110

## 2026-08-10 — `pkill` con el patrón equivocado deja vivo al zombi y lo disimula
**Contexto:** durante el rediseño oscuro, tras reconstruir se relanzó el
servidor con `pkill -f "[n]ext start"` delante. La captura resultante mostraba
el diseño ANTERIOR, y el arranque había devuelto `Exit 1` de fondo.
**Causa:** el proceso no se llama `next start`, se llama `next-server (v14...)`.
`next start` es solo el comando que lo lanza, y desaparece de la tabla de
procesos en cuanto arranca al hijo. Así que el patrón no casaba con nada, el
servidor viejo siguió escuchando en el puerto, el nuevo murió con `EADDRINUSE`
y `agent-browser` fotografió tranquilamente el build antiguo.
**Por qué es peor que el zombi de la entrada anterior:** aquí no hubo ningún
síntoma llamativo. La página cargó, el título era correcto y la captura salió
bien; solo el diseño estaba desactualizado. Es exactamente el fallo que hace
dar por bueno un cambio que no se ha visto nunca.
**Corrección:** matar por el nombre real del proceso (`[n]ext-server`, con el
truco de corchetes de la entrada anterior) y, sobre todo, **verificar el puerto
después de matar y antes de arrancar**: `ss -tlnp | grep <puerto>`. Si sigue
ocupado, no se arranca nada ni se cree ninguna captura.
**Regla para el futuro:** matar un proceso no es comprobar que murió.
Cualquier reinicio local que preceda a una verificación visual lleva su
comprobación de puerto en medio, no un `sleep` y fe.
**Tags:** #tooling #falso-verde #agent-browser

## 2026-08-10 — Un extractor casero de PDF da falso negativo con fuentes subconjunto
**Contexto:** tras añadir Next.js y Nuxt al CV y regenerar los PDF con RenderCV,
se comprobó el resultado con un script propio que descomprime los `stream` del
PDF y busca el texto. Devolvió "NO ENCONTRADO" en los dos archivos.
**Error a evitar:** concluir que el cambio no se aplicó y ponerse a depurar el
YAML o RenderCV. El cambio SÍ estaba: lo confirmó `pypdf`, que encontró
"Next.js" y "Nuxt" en ambos.
**Causa:** los PDF que genera Typst incrustan fuentes en subconjunto y dibujan
el texto por identificador de glifo, no como cadenas legibles. Descomprimir el
stream y hacer `grep` no puede funcionar salvo por casualidad. Hace falta una
librería que resuelva el mapa de codificación de la fuente.
**Cómo se distinguió del fallo real:** contrastando contra el `.typ` intermedio
que RenderCV deja en `cv/rendercv_output/`, que sí es texto plano y ya contenía
las dos tecnologías. Eso separó "el pipeline no recogió el cambio" de "mi
verificación no sabe leer el formato".
**Regla para el futuro:** para afirmar que algo está DENTRO de un PDF, usar un
extractor de verdad (`pypdf`, `pdftotext`). Un negativo de un parser casero no
es evidencia de ausencia, y en un proyecto que exige verificar antes de afirmar
eso es peor que no comprobar nada, porque parece una comprobación.
**Tags:** #verificacion #falso-negativo #rendercv

## 2026-08-10 — La sesión de agent-browser sirve la página cacheada tras un redeploy
**Contexto:** tras unificar el perfil en un solo párrafo, reconstruir y
relanzar el servidor, la captura seguía mostrando los CUATRO párrafos
anteriores.
**Error a evitar:** dar por hecho que el cambio no se aplicó y volver a editar
el contenido, o peor, "arreglar" algo que ya estaba bien. El puerto estaba
comprobado y el build era nuevo, así que la sospecha se fue al código.
**Cómo se aisló, en tres comprobaciones baratas:** (1) `grep` en la fuente:
la frase vieja ya no estaba; (2) `grep` sobre el HTML servido con `curl`: la
frase nueva SÍ estaba y la vieja no; (3) por tanto el servidor era correcto y
el desfase estaba en el cliente. Era la sesión persistente del navegador
sirviendo su copia cacheada.
**Corrección:** navegar con un parámetro que rompa la caché
(`?cb=$(date +%s)`) antes de capturar.
**Regla para el futuro:** cuando una captura contradice al código, comprobar
primero QUÉ está sirviendo el servidor con `curl`, y solo después mirar el
código. Separa en un comando "el build está mal" de "lo que veo está mal", que
son dos problemas completamente distintos. Es la tercera vez en este proyecto
que una verificación visual engaña por una capa intermedia (servidor zombi,
patrón de pkill equivocado, y ahora caché del navegador): la captura es la
última comprobación, nunca la única.
**Tags:** #agent-browser #falso-negativo #verificacion

<!-- New entries go above this line, most recent first. -->
