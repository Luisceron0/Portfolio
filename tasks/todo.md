# Active plan: Personal Portfolio Site v1
**Start:** 2026-08-07
**Goal:** deploy a working single-page site meeting RF-101 through RF-105 of the SRS.

## Phase 0: Unblock pending items
- [x] Resolve `[PENDIENTE: domain name]` → **cerrado como bloqueante
  (2026-08-18)**: `site.url` declara la URL de Vercel que ya sirve el sitio, así
  que no queda ningún `[PENDIENTE]` en `content.ts` y `check:pending` pasa en
  verde. La estrategia acordada el 2026-08-08 se cumple tal cual: desplegar
  primero, registrar el dominio después. Registrarlo es cambiar UNA línea de
  `content.ts` y apuntar el DNS; ya no bloquea nada
- [x] Capture KOA live screenshot for RF-102 (CareLink's already exists) →
  **completo (2026-08-08)**, ver Phase 3
- [ ] Confirm portfolio-wide RF-001–003 (GitHub unification, renames, READMEs) are
  done — RF-102/105 of this SRS depend on them, don't build the links first and fix
  the target later
- [x] **(añadido)** Copiar la captura de CareLink a `public/proyectos/` →
  **completo (2026-08-08)**, ver Phase 3
- [x] **(añadido)** Aportar `luis-ceron-cv-es.pdf` y `luis-ceron-cv-en.pdf` en
  `public/cv/` → **completo (2026-08-10)**, generados con RenderCV desde
  `cv/*.yaml`, ver Phase 4c
- [x] **(añadido)** Bandeja de destino del formulario (`CONTACT_TO_EMAIL`) →
  confirmada por el dueño: `luiscerontrabajos@gmail.com`. Pendiente solo
  configurarla en Vercel (ver Phase 4)

## Phase 1: Scaffold — COMPLETA (2026-08-07)
- [x] Next.js 14 + Tailwind project init, matching ElevaForge conventions
      → `npm run lint`, `npm run typecheck` y `npm run build` en verde
- [x] Single `content.ts` config for hero copy, project blurbs, links (RF-101/102/103)
      → `src/content.ts`; ningún componente contiene texto visible
- [x] CSP headers configured with explicit directives from day one, not added later
      → `src/lib/csp.ts` + `src/middleware.ts`; 13 directivas explícitas
      verificadas contra el build de producción por `e2e/security-headers.spec.ts`
- [x] **(añadido)** Guardia `[PENDIENTE]`: `npm run check:pending` impide que un
      placeholder llegue a un despliegue (15 marcadores abiertos ahora mismo)
- [x] **(añadido)** CI en `.github/workflows/ci.yml`: lint, tipos, build, gitleaks +
      escáner local de secretos, Playwright
- [x] **(añadido)** Suite E2E: 22 tests en verde, 2 saltados por viewport

## Phase 2: Contact form — COMPLETA (2026-08-08), pendiente de checkpoint humano
- [x] Server action + Resend integration → `src/app/actions/contact.ts` +
      `src/lib/mailer.ts` (fetch a la API REST de Resend, sin paquete npm)
- [x] Turnstile integration, fail-closed (submit disabled until token present) →
      `src/lib/turnstile.ts` (servidor) + `src/components/contact-form.tsx`
      (cliente). Verificado en navegador real con agent-browser: botón
      `[disabled]` en el árbol de accesibilidad mientras Turnstile no entrega
      token; capturas en el checkpoint del chat
- [x] Server-side validation on all fields → `src/lib/validation.ts`, sin
      dependencias, 12 casos de borde cubiertos en
      `e2e/contact-validation.unit.spec.ts`
- [x] Rate limiting per IP → `src/lib/rate-limit.ts`, ventana deslizante en
      memoria, IP hasheada (nunca en claro). Documentado como defensa en
      profundidad, no control primario — ver `tasks/plan.md` D-08b
- [x] Explicit success/error UI states — no silent failure → 4 códigos de error
      (VALIDATION, CAPTCHA, RATE_LIMITED, SEND_FAILED), todos con texto visible
      en `src/content.ts`; verificado en navegador real, no solo en el código
- [x] Port the koa-landing lesson into this repo's `tasks/lessons.md` before writing
  the form, not after → leída antes de empezar; solo le falta la fecha real del
  fix original en koa-landing
- [x] **(añadido)** 18 escenarios Gherkin de RF-104 en `tests/rf-104.feature`,
      implementados en `e2e/contact-form.spec.ts` (navegador real) y
      `e2e/contact-validation.unit.spec.ts` (unitario) — 91 tests en verde, 0 fallos
- [x] **(añadido)** Protocolo de neutralización de efectos: `CONTACT_TEST_MODE`
      (claves de prueba oficiales de Turnstile) + `CONTACT_DRY_RUN` (correo a
      memoria). Verificado: sin ninguna de las dos, el envío falla en el punto
      de integración — nunca gasta cuota real ni manda correo real
- [x] **(añadido)** Semgrep con 4 reglas propias, validadas contra
      `semgrep-rules/security.ts` (`npm run verify:semgrep`)
- [x] **(añadido)** Regla ESLint de T-104 corregida y validada contra un fixture
      vulnerable (`npm run verify:guardrails`) — la primera versión de la regla
      no detectaba nada; ver `tasks/lessons.md`
- [x] **(añadido)** Lighthouse CI, gate ≥95/≥95: medido 100/100, 99/100, 99/100
      en 3 corridas contra el build real; mecanismo de aserción verificado en
      rojo con un umbral imposible antes de confiar en el verde

## Phase 4f: URL del despliegue cambiada y ruido en consola (2026-08-18)
- [x] El alias de Vercel pasa a `portfolio-luisceron.vercel.app`. El anterior
      devuelve **404**, así que `site.url` y el enlace de los dos CV apuntaban a
      una URL muerta. Actualizado en `content.ts`, en los dos YAML y en los dos
      PDF regenerados
- [x] Eso explica el `110200` de Turnstile: el widget tenía permitido el alias
      viejo y el navegador cargaba el nuevo. Se comprobó midiendo, no
      suponiendo: desde fuera, el alias viejo NO daba 110200
- [x] `interest-cohort=()` fuera de `Permissions-Policy`: FLoC ya no existe y
      Chrome imprime "Unrecognized feature" en la consola de cada visitante. Una
      cabecera que solo genera ruido despista a quien depura otra cosa
- [ ] **Pendiente del dueño en Cloudflare:** añadir `portfolio-luisceron.vercel.app`
      a Hostname Management del widget de Turnstile

## Phase 4e: Origen declarado y portafolio funcional (2026-08-18)
- [x] `site.url` = la URL de Vercel (verificada con HTTP 200). Cierra el último
      `[PENDIENTE]`: `check:pending` pasa en verde por primera vez
- [x] **Fallo real encontrado al cerrarlo:** con el origen declarado, Next se
      comía el `?lang=en` de la canónica y del hreflang, y los dos idiomas
      pasaban a declarar la misma URL. Causa y solución en `tasks/lessons.md`;
      fijado con un test nuevo en `e2e/content.spec.ts`
- [x] Canónica, hreflang y `og:url` verificados en el HTML emitido, en los dos
      idiomas, contra el build de producción y no en teoría
- [x] Calcos del inglés corregidos en el CV ("before the first file",
      "point of return", "public-sector data") y viñeta de alcance genérico en
      Freelance: frontend, backend, desarrollos completos, procesos internos y
      auditorías de seguridad, con la confidencialidad dicha en voz alta en vez
      de dejar la generalidad sin explicar
- [x] Dos palabras clave que se partían solas al final de línea ("full-stack",
      "end-to-end") reescritas sin compuesto: la palabra ya está en el cargo y
      en las habilidades, así que la viñeta no pierde nada
- [ ] **Solo lo puede hacer el dueño:** las cinco variables de entorno del panel
      de Vercel. Comprobado en la URL en vivo: sin
      `NEXT_PUBLIC_TURNSTILE_SITE_KEY` el formulario se renderiza deshabilitado
      con el aviso de verificación no disponible

## Phase 4d: CV en formato Harvard, optimizado para ATS (2026-08-18)
- [x] Diagnóstico ANTES de tocar nada: texto extraído de los dos PDF con
      `pypdf`, que es como lo lee un ATS. Seis defectos reales, ninguno visible
      abriendo el PDF (palabras clave partidas por la justificación, orden de
      lectura invertido, título de grado partido en vertical, teléfono sin
      `+57`, contactos sin texto, pie de página dentro del contenido).
      Detalle completo en `tasks/lessons.md`
- [x] Bloque `design` en ambos YAML, comentado opción por opción con el defecto
      que corrige cada una: tema `harvard`, `alignment: left`,
      `phone_number_format: international`, `display_urls_instead_of_usernames`,
      sin pie ni nota superior, `degree_column: null`, `allow_page_break: false`
- [x] `show_time_spans_in: []` de vuelta: había regresado a su valor por defecto
      y los dos PDF volvían a tener maquetación distinta (el inglés mostraba
      "3 months" y el español no). Misma lección del 2026-08-10, repetida
- [x] `locale` explícito por idioma: el PDF en español imprimía los meses en
      inglés ("Oct 2025 – Dec 2025") y "present" en vez de "presente"
- [x] Contenido reescrito con método STAR (situación, acción y resultado en cada
      viñeta), girado hacia arquitectura de software por decisión del dueño, con
      el titular y el perfil cargados de las palabras clave del puesto objetivo
- [x] **Sin cifras inventadas**, por decisión explícita del dueño: solo lo ya
      documentado (3 ingenieros, los 4 gates de CI, los tres meses de la
      práctica, C1 EF SET). El resto de resultados van en cualitativo concreto
- [x] Enlace al portafolio (`portfolio-luisceron.vercel.app`) en la cabecera
      de ambos CV, verificado con HTTP 200
- [x] Grupo "Arquitectura" nuevo en habilidades, y de vuelta Next.js, que el CV
      había perdido mientras la trayectoria seguía hablando de la migración a
      Next.js 14
- [x] Trayectoria y habilidades del sitio sincronizadas con las viñetas nuevas
      (RF-106: si el CV cambia, `content.ts` cambia)
- [ ] **Pendiente de decisión del dueño:** el `[PENDIENTE]` de `site.url` sigue
      abierto. La URL de Vercel ya existe y está en el CV, pero no es el dominio
      propio que ese marcador espera

## Phase 3j: Quinto proyecto (Tributary) y sincronización con el CV (2026-08-18)
- [x] Perfil reescrito a tres párrafos (los tres ángulos, la estructura antes del
      código, la seguridad desde el diseño). `profile.summary` pasa de
      `Localized` a `LocalizedList` y el componente renderiza un `<p>` por
      párrafo; el número de párrafos lo manda el contenido, no el componente
- [x] Página sincronizada con los cambios del dueño en `cv/*.yaml`: ElevaForge
      entra en la trayectoria como puesto (cofundador, jun 2025 a la actualidad),
      el bullet de reportes de Freelance deja de decir "tiempo real", y Nuxt sale
      de habilidades. **Next.js se queda** aunque el CV ya no lo liste en
      "Desarrollo": lo respaldan la entrada de ElevaForge, el stack del proyecto
      y este mismo sitio, y quitarlo dejaría la lista contradiciendo la trayectoria
- [x] Los dos PDF de `public/cv/` regenerados con RenderCV desde los YAML nuevos
      (son los que descarga el visitante: un CV sin ElevaForge servido desde una
      página que sí lo muestra es la contradicción que RF-106 prohíbe)
- [x] **RF-102 de 4 a 5 proyectos: entra Tributary** (motor de facturación
      electrónica multi-régimen, CO/ES/DE), contenido escrito contra el README y
      `docs/portfolio.md` del repo, ambas URL verificadas con HTTP 200. SRS
      actualizada a v1.3 ANTES de tocar el contenido
- [x] Captura tomada de la evidencia del propio repo (`docs/evidence/chain-broken.png`),
      la única del sitio que no mide 1280x577 → `ProjectImage` acepta `width`/`height`
      opcionales en vez de recortar la evidencia para que encaje
- [x] Quinto tono de proyecto (`rust`): la paleta tiene exactamente cinco, así que
      cinco proyectos siguen sin repetir color
- [x] Es el primer proyecto **sin URL en vivo y sin intención de tenerla** (su
      propio ADR-011). El criterio de aceptación de RF-102 deja de leerse como
      "todo proyecto tiene demo", y la tarjeta lo dice en una viñeta en vez de
      dejar el hueco sin explicar

## Phase 3i: Perfil unificado en un solo párrafo (2026-08-10)
- [x] Los cuatro párrafos del perfil (resumen del CV más los tres de forma de
      trabajar) fundidos en uno solo, reescrito y comprimido en vez de
      concatenado, en español e inglés
- [x] **Cambia una garantía anterior y queda anotado en el código:** el resumen
      YA NO es la copia literal del "Perfil Profesional" del YAML del CV.
      Página y PDF siguen sin contradecirse (mismos hechos: full-stack,
      DevSecOps y AppSec, mismo stack, inglés C1), pero ya no son el mismo
      texto. Si cambian los HECHOS de uno, hay que tocar el otro
- [x] La disponibilidad para relocalización sale del párrafo a propósito: ya
      estaba en `hero.availability` y repetirla restaba
- [x] 132 tests en verde

## Phase 3h: Contenido desarrollado y fondo ASCII animado (2026-08-10)
> Tres peticiones del dueño: perfil y proyectos mejor redactados y con los
> aspectos técnicos más desarrollados; que la mirada de arquitectura se entienda
> de forma implícita en vez de anunciarse; y un ASCII menos genérico, animado y
> de fondo.
- [x] **Fuera el bloque etiquetado "Cómo trabajo" (DEV / ARCH / SEC).** Una
      taxonomía con etiquetas se lee como un organigrama de uno mismo. Las tres
      disciplinas pasan a tres párrafos de prosa en el perfil, sin nombrarse, y
      quedan demostradas en el ángulo de seguridad de cada proyecto
- [x] Los cuatro proyectos reescritos por completo (problema, ángulo de
      seguridad y viñetas, en los dos idiomas). El criterio: cada viñeta explica
      el mecanismo Y por qué se eligió, no solo qué se usó. Ejemplos: por qué
      filtrar dentro del WHERE y no después (los datos ya salieron de la base),
      por qué la autorización vive en el estado y no en el token, por qué
      deny-by-default no es una lista de permisos con huecos
- [x] Ningún hecho técnico nuevo inventado: es reescritura de lo que ya estaba
      respaldado por los README y las URLs verificadas, con la explicación que
      antes faltaba
- [x] `summary` sigue intacto, palabra por palabra desde el YAML del CV. Los
      párrafos nuevos son contenido propio del sitio, así que el PDF descargable
      y la página siguen sin contradecirse
- [x] **Fondo ASCII animado, tercera versión.** Las dos anteriores fallaron por
      motivos distintos y ambos quedan anotados en el código: la 1ª era
      abstracta pero estática y ocupaba sitio como si fuera contenido; la 2ª
      (diagrama de capas) tenía forma pero es el dibujo de cualquier
      presentación de infraestructura. Esta es abstracta otra vez, y ahora sí
      funciona, porque se mueve y está detrás del contenido
- [x] Animación sin JavaScript ni frames apilados: el campo se genera con un
      periodo vertical exacto y se dibujan dos periodos, así que desplazarlo un
      50% de su altura equivale a un periodo completo y el bucle no tiene
      costura. Un solo elemento animando `transform`, compuesto por GPU
- [x] Movimiento verificado de verdad, no supuesto: dos capturas separadas 6
      segundos con hash distinto
- [x] La opacidad del fondo NO es libre y está documentado por qué: el texto del
      hero se lee encima, así que decide el fondo efectivo. Par nuevo en
      `check:contrast` con el caso peor (carácter más denso a plena cobertura):
      5.97:1 para `ink-muted`. 35 pares en total, todos AA
- [x] 132 tests en verde, Lighthouse 100/100 y 100/100 en las 3 corridas: el
      fondo animado no cuesta rendimiento medible

## Phase 3g: ASCII con forma, y profundidad de arquitecto (2026-08-10)
> Tres peticiones del dueño en el mismo mensaje: el ASCII "no parece tener
> forma de nada", añadir Next y Nuxt, y dar profundidad al perfil de arquitecto
> de software y de seguridad además de desarrollador full-stack.
- [x] **ASCII rehecho.** El campo de densidad generado se retira: tenía razón el
      dueño, a ese tamaño se leía como ruido de compresión y no representaba
      nada. Lo sustituye un diagrama reconocible de las capas de una aplicación
      con el control que le toca a cada una (WWW / TLS / CSP·WAF / API·JWT·RBAC
      / DB·RLS). Doble beneficio: es ASCII con forma Y demuestra la mirada de
      arquitectura que pedía la tercera petición
- [x] **Solo acrónimos técnicos** en el dibujo, y es deliberado: WWW, TLS, CSP,
      WAF, API, JWT, RBAC, DB y RLS se escriben igual en español y en inglés.
      Es lo que permite un único dibujo en las dos versiones sin convertirlo en
      copy sin traducir, que RF-109 no permite
- [x] **Animación de barrido** (`.ascii-scan`): una banda de luz recorre el
      diagrama como el barrido de un escáner. Solo anima `transform`, que
      compone la GPU y no fuerza recálculo de layout. Bajo
      `prefers-reduced-motion` NO se ralentiza, se oculta: la regla global deja
      las animaciones en 0.01ms y eso la habría congelado como una mancha en
      una posición arbitraria. Lighthouse 100/100 en las 3 corridas, así que la
      animación infinita no cuesta nada medible
- [x] Next.js y Nuxt añadidos al grupo de frameworks, cada meta-framework
      detrás de su base (Next tras React, Nuxt tras Vue) para que el orden
      comunique la relación
- [x] **CV regenerado para no contradecir al sitio.** Añadir tecnologías solo
      en la página habría dejado el PDF descargable diciendo otra cosa, que es
      justo lo que prohíbe el criterio del §9. Se actualizaron los dos YAML y
      se volvieron a generar ambos PDF con RenderCV, verificando con extracción
      de texto real (pypdf) que "Next.js" y "Nuxt" están dentro. Un primer
      intento de verificación con un extractor casero dio falso negativo: los
      PDF de Typst usan fuentes subconjunto y el texto no está en claro
- [x] **Profundidad de arquitecto** como bloque nuevo en el perfil (`practices`):
      tres disciplinas, no tres cargos, con un tono cada una. Cada afirmación es
      comprobable contra un proyecto enlazado en la misma página (permisos por
      fila, fallo cerrado, cabeceras), ninguna es una cualidad genérica
- [x] `summary` se deja intacto, palabra por palabra como está en el YAML del
      CV: el bloque nuevo es contenido propio del sitio, no una reescritura del
      resumen. Reescribirlo habría vuelto a separar la página del PDF
- [x] `hero.role` pasa a nombrar las tres disciplinas. Era el cambio con riesgo
      real, porque se renderiza encima del titular y cuenta para el presupuesto
      vertical de RF-101: verificado en verde a 375px antes de seguir
- [x] 132 tests en verde, Lighthouse 100/100 y 100/100

## Phase 3f: Rediseño oscuro, suizo y de ficha técnica (2026-08-10)
> Cuarta petición del dueño, y la primera que da una dirección estética
> concreta en vez de referencias sueltas: "colores oscuros, ascii art, estilo
> swiss style, contraste y tech spec". Las tres rondas anteriores fueron
> retoques incrementales sobre un lienzo claro y ninguna terminó de convencer,
> así que esta vez se cambia el sistema entero en lugar de ajustarlo.
- [x] **Inversión completa a oscuro.** El lienzo de papel cálido desaparece.
      No hay tema claro, ni conmutador, ni consulta a `prefers-color-scheme`:
      es una decisión de diseño, y tratarla como preferencia obligaría a
      mantener y medir DOS paletas. `color-scheme: dark` y `themeColor` para
      que el navegador pinte también sus propios cromos
- [x] Los nombres de token NO cambiaron (`ink`, `surface`, `hairline`, `tone`,
      `accent`, `warn`), solo sus valores: la inversión es un cambio de paleta
      y no una reescritura componente a componente
- [x] Desaparece el mapa `TONE_TEXT_BRIGHT` y los tokens `console.*` /
      `toneBright.*` de la fase anterior: sobre lienzo oscuro los tonos ya son
      las variantes claras, así que un solo juego sirve para todo
- [x] **Contraste medido ANTES de aplicar nada**, no después: 33 pares en
      verde, incluidos los casos invertidos (letra oscura sobre relleno claro
      en botones) y el color REAL compuesto de las tarjetas semitransparentes
      (`#111112`). El token `deco` se documenta explícitamente como
      decorativo-y-solo-decorativo porque no alcanza AA, y se detectó y
      corrigió un uso indebido suyo en el pie antes de commitear
- [x] **Estilo suizo:** ángulo recto en todo el sistema (el override de
      `borderRadius` en el tema invalida cualquier `rounded-*` olvidado),
      Helvetica/Arial como familia (100% del sistema, D-05 intacta, cero
      descargas), jerarquía de cartel con contraste extremo de escala, y la
      rejilla de habilidades dibujada con `gap-px` sobre fondo `hairline`
- [x] **Ficha técnica:** monoespaciada del sistema para etiquetas, datos y
      chips; referencias `PRJ-01`; marcas de corte en las esquinas
      (`.crop-marks`, un pseudo-elemento, sin marcado extra); rejilla de dibujo
      en el lienzo; la tabla de datos del perfil como `<dl>` real
- [x] **ASCII art generativo** (`src/components/ascii.tsx`): campo de densidad
      calculado con una función pura de la posición. Sin `Math.random`, que
      sería un error de hidratación; sin texto, que sería copy sin traducir en
      un sitio bilingüe; `aria-hidden`, porque para un lector de pantalla una
      retícula de bloques Unicode es ruido. Oculto por debajo de `lg` para no
      gastar el presupuesto de RF-101
- [x] El panel de ángulo de seguridad deja de ser una "tarjeta terminal": ese
      recurso funcionaba por ser el único bloque oscuro de una página clara y
      con el sitio entero en oscuro ya no distingue nada. El énfasis pasa a la
      estructura (bloque hundido, regla de tono, monoespaciada)
- [x] Favicon rehecho en clave suiza, sobre fondo oscuro, para que en una
      pestaña oscura no se vea como un recorte blanco
- [x] Un defecto de maquetación encontrado y corregido en la verificación
      visual, no después: con 5 grupos en una rejilla de 2 columnas quedaba una
      celda vacía donde se veía el fondo del contenedor como un bloque gris
      suelto. Relleno condicional y documentado
- [x] 132 tests en verde (RF-101 a 375px incluido, que era el riesgo real de
      subir el tamaño del titular), Lighthouse 98-100/100 Performance y
      100/100 Accessibility en 3 corridas

## Phase 3e: Tercera ronda de referencias visuales (2026-08-10)
> El dueño trajo 3 referencias nuevas (Shelby Kay, Impossible Foods, Cake
> Equity), cada una con su DESIGN.md. Síntesis, no copia: se extrajeron
> principios compatibles con un portafolio de seguridad y se rechazó lo que no
> lo era (tema oscuro global, radio 0, tipografía externa, quitar los botones).
- [x] Tarjeta "consola" oscura para el ángulo de seguridad de cada proyecto
      (idea de la "Midnight Surface" de Cake Equity, reinterpretada con
      estética de terminal: encaja con el perfil de seguridad del sitio en vez
      de sentirse importada). Único momento oscuro del sitio, a propósito.
      Paleta `console.*` / `toneBright.*` nueva en `tailwind.config.ts`,
      medida en `check:contrast` ANTES de aplicarla (13 pares nuevos, los 27
      totales en verde)
- [x] Glifos SVG propios por sección (`src/components/icons.tsx`): 5 iconos
      trazados a mano, `currentColor`, sin librería ni fuente de iconos. Cero
      bytes de red
- [x] Subrayado animado en la nav: cada enlace usa el tono de la sección a la
      que apunta (mismo orden que los números 01-05), reforzando el sistema de
      orientación por color que ya existía en vez de añadir uno nuevo
- [x] Hero: tracking más cerrado en pantallas ≥640px y un salto de tamaño
      extra en `lg` (`text-8xl`), inspirado en la energía tipográfica de
      Impossible Foods sin llegar a sus tamaños extremos. RF-101 (375px sin
      scroll) verificado en verde, sin tocar las clases base
- [x] Franja de 3px con los 5 tonos reales, fija en el borde superior — firma
      de marca a coste cero (gradiente CSS, ninguna imagen)
- [x] Verificación visual en navegador real con `agent-browser`: confirmado
      que el patrón de aparición-al-scroll (RF-110 ya existente) sigue
      funcionando con los componentes nuevos — una captura de página completa
      sin scroll previo muestra secciones vacías por diseño (`.reveal`
      oculto hasta que el observer dispara); tras recorrer la página con
      scroll, todo el contenido nuevo se ve correctamente
- [x] 132 tests en verde (sin cambios de conteo: cambios puramente visuales),
      Lighthouse 100/100 Performance y Accessibility en 3 corridas

## Phase 4c: PDFs del CV generados con RenderCV (2026-08-10)
- [x] RenderCV instalado (`pip install "rendercv[full]"`, v2.8) y validado
      contra los dos YAML en `cv/`. No es un CMS ni una función del sitio en
      tiempo de ejecución: es una herramienta de código abierto corrida una
      vez para producir un archivo estático, exactamente lo que RF-006 de la
      SRS del portafolio describe ("generated from the RenderCV YAML")
- [x] Dos defectos reales de maquetación encontrados y corregidos ANTES de
      dar los PDF por buenos, no después:
      - Columna "Ingeniería"/"Especialización" demasiado angosta, el texto se
        cortaba letra por letra → `design.entries.degree_width: 2.6cm`
      - El PDF en inglés mostraba "3 months"/"3 years 6 months" bajo las
        fechas y el español no: el default de RenderCV busca una sección
        llamada "Experience" para calcular la duración, y solo coincidía con
        el título en inglés → `design.sections.show_time_spans_in: []`
        explícito en ambos, para que el comportamiento sea idéntico
- [x] `luis-ceron-cv-es.pdf` y `luis-ceron-cv-en.pdf` en `public/cv/`,
      verificados con firma binaria `%PDF` y peso real (no un archivo vacío)
- [x] `src/content.ts`: los dos `[PENDIENTE]` de RF-103 resueltos con las
      rutas reales. Solo queda 1 de los 3 originales: el dominio
- [x] **(añadido)** Test nuevo para el criterio literal de RF-103 ("ambos PDF
      abren/descargan sin un enlace roto"): HTTP 200, `Content-Type:
      application/pdf`, firma `%PDF`, y el botón de la página apuntando a la
      ruta exacta. No existía ningún test que lo comprobara hasta ahora
- [x] 132 tests en verde (antes 128), Lighthouse 98-99/100 y 100/100 con los
      PDF reales servidos

## Phase 3d: Paleta multicolor y CV actualizado (2026-08-09)
- [x] Contenido actualizado desde el PDF del CV nuevo: grupos de habilidades
      ampliados con C++, Dart, HTML5, CSS3, Astro, Bootstrap, Tailwind, Git y
      pruebas de penetración, más la entrada de voluntariado
- [x] **(revisión del dueño, 2026-08-09)** Retiradas las métricas cuantificadas
      (20% de mejora, +10 clientes PYME, 100% de integridad, cero downtime): con
      un modelo freelance no son sostenibles como afirmación pública, y la regla
      3 del proyecto prohíbe cualquier afirmación sin respaldo. Retirado también
      el grupo "IA y ciencia de datos" con Anaconda, YOLO, OpenCV y Random
      Forest. Quedan 5 grupos de habilidades
- [x] Resumen del perfil actualizado al enfoque DevSecOps y AppSec del CV nuevo
- [x] RF-110 paleta multicolor: 5 tonos (índigo, verde azulado, ciruela,
      terracota, ocre). Un tono por sección, uno por proyecto y uno por grupo
      de habilidades. El color pasa de decoración a orientación
- [x] Fondo rehecho: fuera la malla de puntos genérica, dentro cuatro campos de
      color fijos de la propia paleta más una trama diagonal fina
- [x] Favicon rehecho: escudo con la "L" calada y degradado de los cuatro tonos,
      en vez del monograma plano de generador
- [x] Contraste medido en los 20 pares, incluidos los 4 tonos nuevos sobre los
      dos fondos donde aparecen. Todos AA
- [x] 128 tests en verde, Lighthouse 97-98/100 y 100/100

## Phase 3c: Bilingüe y dinamismo visual (2026-08-09)
> Tercera petición del dueño. La SRS subió a v1.2 ANTES de tocar código: RF-109
> (bilingüe) sale de la lista de "fuera de alcance" del §3, y se añade RF-110
> (dinamismo visual). Sigue siendo una sola página y una sola ruta.
- [x] Sin rayas largas en el copy visible, con guardián propio
      (`npm run check:dashes`) verificado en rojo plantando una a propósito
- [x] RF-109 bilingüe ES/EN. Decisión de diseño: el idioma es un parámetro de
      query (`/?lang=en`) resuelto en el SERVIDOR, no una ruta nueva ni un
      intercambio en el cliente. Así el `<html lang>` es correcto en la primera
      respuesta y el idioma elegido es compartible
      - Cada texto visible es un `Localized` con `es` y `en` obligatorios:
        olvidar una traducción es un error de compilación, no un hueco silencioso
      - Un `?lang=` desconocido cae a español, nunca a una página en blanco
      - Enlaces localizados solo donde existe la versión de verdad: KOA Store
        tiene `/en` (HTTP 200, comprobado); koa-landing y elevaforge devuelven
        404 en `/en`, así que sus enlaces NO se localizan
- [x] RF-110 dinamismo visual, solo CSS, cero peticiones nuevas: halos radiales
      fijos que cambian de tono al hacer scroll sin animar nada, textura de
      papel en malla de puntos, tarjetas semitransparentes que dejan pasar el
      fondo, y estados hover en chips, tarjetas, botones y puntos de la
      trayectoria
- [x] Contraste re-medido incluyendo el color REAL compuesto de las tarjetas
      semitransparentes (`#fefbf7`), no el hex nominal
- [x] `check:contrast` y `check:dashes` añadidos al job de calidad de CI
- [x] 128 tests en verde (antes 114), Lighthouse 98-99/100 y 100/100

## Phase 3b: Ampliación de alcance y rediseño dinámico (2026-08-09)
> El dueño pidió más contenido y un diseño más vivo. La SRS se actualizó a la
> v1.1 ANTES de escribir código (RF-102 de 2→4 proyectos; nuevos RF-106
> perfil/trayectoria, RF-107 habilidades, RF-108 nav interna). Sigue siendo una
> sola página, sin CMS y sin rutas: la lista de "out of scope" del §3 no cambió.
- [x] SRS actualizada a v1.1 con el cambio de alcance registrado y justificado
- [x] RF-102 → 4 proyectos: ElevaForge, CareLink, KOA Landing, KOA Store, cada
      uno con kicker, problema, chips de stack, ángulo de seguridad, viñetas
      técnicas y enlaces a demo + código. Las 4 URLs en vivo verificadas con
      HTTP 200 antes de escribirlas; capturas tomadas contra los sitios reales
- [x] Enlaces de KOA actualizados a los dominios definitivos
      (`koa.elevaforge.com` y `store.koa.elevaforge.com/es`)
- [x] RF-106 → perfil + trayectoria (4 entradas) desde el YAML del CV
- [x] RF-107 → habilidades en 4 grupos + 6 certificaciones, desde el mismo YAML
- [x] RF-108 → nav pegajosa con anclas internas; ninguna ruta nueva
- [x] Animaciones de aparición al hacer scroll, sin dependencias nuevas
      (IntersectionObserver + CSS): +0,2 kB de JS. Un bug real encontrado y
      corregido en el proceso — ver `tasks/lessons.md`, el contenido nunca puede
      depender de que la animación corra
- [x] Cobertura nueva en `e2e/content.spec.ts` para RF-102/106/107/108 y para
      las animaciones, escrita contra `src/content.ts` en vez de literales

## Phase 3: Content and polish
- [x] **(añadido, 2026-08-08)** Rediseño visual — lienzo cálido tipo papel
      (`surface`), índigo profundo como único color ancla (`accent`), bordes
      finos en vez de sombras (`hairline`), esquinas generosas, botones
      píldora, tipografía de hero más grande. Síntesis de 5 referencias de
      diseño pedidas por el dueño, adaptada a un portafolio de seguridad: sin
      ilustraciones, sin tipografía externa (D-05 se mantiene), sin gradientes.
      Contraste WCAG AA medido de nuevo con la paleta nueva (`npm run
      check:contrast`, todos los pares OK); RF-101 (375px sin scroll) sigue en
      verde con el hero más grande; Lighthouse 97-99/100 Performance, 100/100
      Accessibility; suite completa 91/91 en verde
- [x] Hero + value prop copy (RF-101) → `src/content.ts` (`hero.pitch`), texto
      real desde la Fase 1. Verificado por `e2e/landing.spec.ts` (legible sin
      scroll en 375px, sin jerga)
- [x] Project highlights: CareLink, ElevaForge/KOA (RF-102) → **completo
      (2026-08-08)**. Contenido extraído de los READMEs públicos de
      `Luisceron0/CareLink` y `luisCeron0Portfolio/koa-landing` (repos
      confirmados públicos con `gh repo view`), no inventado:
      - CareLink: problema/stack/seguridad del propio README; captura real
        (`07-encounter-edit-409.png`) descargada de
        `docs/portfolio/screenshots/` del repo (asset público, el repo no se
        tocó); enlace a `docs/portfolio/SCREENSHOTS.md`
      - KOA: problema/stack/seguridad del README de koa-landing; demo en vivo
        confirmada con `curl` (200) en `https://demo-landing-delta.vercel.app`
        (URL tomada del campo `homepage` del repo, no adivinada); captura
        tomada en vivo contra ese despliegue real con `agent-browser`
      - Lighthouse re-medido con las imágenes reales: 97/99/99 Performance,
        100/100/100 Accessibility — sigue sobre el gate ≥95/≥95
- [ ] CV download buttons, ES + EN (RF-103) → **sigue bloqueado**: el dueño
      aportó el YAML de contenido del CV, pero renderizarlo a PDF es RF-006 de
      la SRS del portafolio, en otro repo (RenderCV) — fuera de alcance de
      este proyecto por diseño (copilot-instructions: "no añadir CMS/generación
      sin cambiar el alcance primero"). Faltan los PDFs ya generados, o sus URLs
- [x] GitHub profile link, visible above the fold (RF-105) → `src/content.ts`
      (`hero.githubLink`), apunta a `https://github.com/Luisceron0`. Verificado
      por `e2e/landing.spec.ts` (visible en el hero, apunta al perfil no a un repo)
- [x] **(añadido)** Favicon (`src/app/icon.svg`) — monograma "LC", sin recursos
      externos, generado por la convención de App Router. No dependía de
      ningún dato pendiente de Fase 0

## Phase 4: Verification
- [x] Lighthouse Performance ≥95, Accessibility ≥95 → medido localmente
      (100/100, 99/100, 99/100) **y confirmado en CI real** (GitHub Actions,
      run 31283391049): job en verde, gate cumplido
- [x] Playwright: happy path, Turnstile-blocked path, server-error path →
      91 tests en verde localmente **y en CI real** (52.6s, mismo resultado)
- [x] Secrets scan clean in CI → confirmado en GitHub Actions real: escáner
      local + gitleaks, ambos en verde (run 31283391049)
- [x] CSP header present on every response, verified → capturado con `curl`
      contra una respuesta real, las 13 directivas presentes, nonce distinto
      en cada petición
- [ ] Cross-check: nothing on this page contradicts the CV, LinkedIn, or repo READMEs
      → parcial: el usuario de GitHub del YAML del CV coincide con
      `hero.githubLink`. Falta cotejar contra LinkedIn (no aportado) y contra
      el resto de repos del portafolio cuando existan

## Phase 4b: Deploy (2026-08-08)
- [x] Push a GitHub — commit `e93a512` reemplaza el PoS en `Luisceron0/Portfolio`
      main con el sitio nuevo; commits siguientes `a467512`/`b2f8b1e` corrigen CI
- [x] CI verde en un run real de GitHub Actions (no solo local) →
      run 31283391049, todos los jobs en verde salvo `content-readiness`
      (rojo esperado por diseño: 2 `[PENDIENTE]` reales, `continue-on-error: true`)
- [x] Dos bugs reales de CI encontrados y corregidos, verificados en runs
      reales (no solo localmente): orden de build de Playwright vs `webServer`,
      y `include-hidden-files` en el artifact de Lighthouse. Detalle completo
      en `tasks/lessons.md`
- [ ] Conectar el repo en el dashboard de Vercel — **requiere la sesión
      autenticada del dueño, no ejecutable por el asistente**. Checklist
      entregada en el chat
- [ ] Configurar `CONTACT_TO_EMAIL=luiscerontrabajos@gmail.com` en Vercel
      (confirmado por el dueño, no es secreto)
- [x] `site.url` apuntando a la URL de Vercel (2026-08-18), verificada con
      HTTP 200. Con esto `metadataBase`, la canónica, los `hreflang` y la URL de
      Open Graph dejan de ser relativas
- [ ] Registrar el dominio propio y conectarlo en Vercel; después, cambiar
      `site.url`. Mejora, ya no bloqueante
- [ ] **Solo lo puede hacer el dueño:** las cinco variables de entorno en el
      panel de Vercel. Sin `NEXT_PUBLIC_TURNSTILE_SITE_KEY` el formulario de
      contacto se renderiza deshabilitado en producción, con el aviso de
      "verificación antifraude no disponible" (comprobado en la URL en vivo el
      2026-08-18). Las cinco están listadas en `.env.example`

## Completion criteria
- [ ] All RF-101–105 acceptance criteria closed
- [ ] Deployed on the resolved personal domain, TLS valid
- [ ] A non-technical reader confirms the value prop is clear without explanation

## Review
[Complete when the plan closes]
