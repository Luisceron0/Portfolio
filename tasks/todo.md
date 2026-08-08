# Active plan: Personal Portfolio Site v1
**Start:** 2026-08-07
**Goal:** deploy a working single-page site meeting RF-101 through RF-105 of the SRS.

## Phase 0: Unblock pending items
> Aplazado por decisión del dueño (2026-08-07): se construye la estructura
> primero y los recursos externos se incorporan después. Ninguno de estos
> puntos se ha dado por resuelto ni se ha rellenado con un valor inventado.
- [ ] Resolve `[PENDIENTE: domain name]` — pick and register a personal domain
- [ ] Capture KOA live screenshot for RF-102 (CareLink's already exists)
- [ ] Confirm portfolio-wide RF-001–003 (GitHub unification, renames, READMEs) are
  done — RF-102/105 of this SRS depend on them, don't build the links first and fix
  the target later
- [ ] **(añadido)** Copiar la captura de CareLink a `public/proyectos/` — la SRS la
  sitúa en `docs/portfolio/screenshots/` de otro repo, y copilot-instructions
  prohíbe tocar ese repo desde aquí
- [ ] **(añadido)** Aportar `luis-ceron-cv-es.pdf` y `luis-ceron-cv-en.pdf` en
  `public/cv/` — RF-103 no cierra con un botón que apunta a un 404
- [ ] **(añadido)** Bandeja de destino del formulario (`CONTACT_TO_EMAIL`) para la Fase 2

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

## Phase 3: Content and polish
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
- [x] Lighthouse Performance ≥95, Accessibility ≥95 → medido localmente:
      100/100, 99/100, 99/100 (3 corridas). **Falta:** confirmar que el job
      `lighthouse` de CI (`.github/workflows/ci.yml`) pasa en GitHub Actions —
      corrido solo en local hasta ahora
- [x] Playwright: happy path, Turnstile-blocked path, server-error path →
      91 tests en verde, 0 fallos, incluido el crítico de fail-closed visto en
      rojo a propósito antes de confiar en él
- [ ] Secrets scan clean in CI → `npm run check:secrets` en verde localmente;
      gitleaks + el job `secrets` de CI **no se han corrido todavía en GitHub
      Actions** — este repo aún no tiene remoto
- [x] CSP header present on every response, verified → capturado con `curl`
      contra una respuesta real (no reconstruido), las 13 directivas presentes,
      nonce distinto en cada petición
- [ ] Cross-check: nothing on this page contradicts the CV, LinkedIn, or repo READMEs
      → bloqueado por Fase 0: no hay contenido real que cotejar todavía (15
      marcadores `[PENDIENTE]` abiertos)

## Completion criteria
- [ ] All RF-101–105 acceptance criteria closed
- [ ] Deployed on the resolved personal domain, TLS valid
- [ ] A non-technical reader confirms the value prop is clear without explanation

## Review
[Complete when the plan closes]
