# Active plan: Personal Portfolio Site v1
**Start:** 2026-08-07
**Goal:** deploy a working single-page site meeting RF-101 through RF-105 of the SRS.

## Phase 0: Unblock pending items
- [ ] Resolve `[PENDIENTE: domain name]` — **estrategia acordada (2026-08-08):
  desplegar primero en Vercel, registrar el dominio con la URL real como
  referencia, apuntar DNS después.** El sitio ya está desplegado (ver Phase 4);
  falta que el dueño registre el dominio y lo conecte en el dashboard de Vercel
- [x] Capture KOA live screenshot for RF-102 (CareLink's already exists) →
  **completo (2026-08-08)**, ver Phase 3
- [ ] Confirm portfolio-wide RF-001–003 (GitHub unification, renames, READMEs) are
  done — RF-102/105 of this SRS depend on them, don't build the links first and fix
  the target later
- [x] **(añadido)** Copiar la captura de CareLink a `public/proyectos/` →
  **completo (2026-08-08)**, ver Phase 3
- [ ] **(añadido)** Aportar `luis-ceron-cv-es.pdf` y `luis-ceron-cv-en.pdf` en
  `public/cv/` — RF-103 no cierra con un botón que apunta a un 404. El dueño
  confirmó que los aportará cuando estén actualizados
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
- [ ] Registrar el dominio una vez exista la URL de Vercel; conectar dominio
      personalizado; actualizar `site.url` en `src/content.ts`

## Completion criteria
- [ ] All RF-101–105 acceptance criteria closed
- [ ] Deployed on the resolved personal domain, TLS valid
- [ ] A non-technical reader confirms the value prop is clear without explanation

## Review
[Complete when the plan closes]
