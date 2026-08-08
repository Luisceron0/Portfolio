# Plan — Sitio personal v1

**Creado:** 2026-08-07 (a posteriori: la Fase 1 se implementó sin este documento;
ver "Deuda de proceso" al final).
**Cierra la fase `plan` del ciclo** constitution → specify → clarify → **plan** →
tasks → implement.

Este archivo contiene las decisiones que `tasks/todo.md` da por supuestas. Si una
decisión de aquí cambia, se actualiza aquí antes de tocar código.

---

## 1. Decisiones de arquitectura

| # | Decisión | Alternativa descartada | Por qué |
|---|---|---|---|
| D-01 | Una sola ruta (`/`) | Multi-página | Regla 1 de la constitución; más páginas es scope creep de v1 |
| D-02 | Todo el copy en `src/content.ts` | Texto en JSX | Regla 2: el dueño edita un archivo, no busca strings |
| D-03 | CSP con nonce por petición vía middleware | CSP estática con `'unsafe-inline'` | `'unsafe-inline'` en `script-src` anula la defensa contra XSS |
| D-04 | `force-dynamic` en la página | Render estático | Un nonce prerenderizado en build no coincide con el de la petición |
| D-05 | Fuentes del sistema | `next/font` + Google Fonts | Cero descarga externa, cero bytes de fuente, `font-src 'self'` estricto |
| D-06 | Resend vía `fetch` a su API REST | Paquete `resend` de npm | Una dependencia menos en la única superficie con secretos |
| D-07 | Validación escrita a mano | `zod` | El shape es de 3 campos; una dependencia en el camino del secreto no se justifica |
| D-08 | Rate limit en memoria por instancia | Redis / Upstash | Sin infra externa en v1. **Limitación asumida y documentada**, ver D-08b |
| D-08b | El rate limit es defensa en profundidad, **no** el control primario | — | En serverless cada instancia tiene su propio contador. El control primario contra abuso es Turnstile |
| D-09 | Transporte de correo inyectable (`resend` / `dry-run` / ninguno) | Clave real en desarrollo | Sección 1 del protocolo: sin credencial real, el envío falla en el punto de integración |
| D-10 | Claves de prueba **oficiales** de Turnstile en test | Desactivar Turnstile en test | Desactivarlo haría falso cualquier resultado de "está protegido" |

## 2. Superficie de seguridad

Solo dos lugares. Todo lo demás es HTML estático.

1. **`src/middleware.ts` + `src/lib/csp.ts`** — cabeceras.
2. **`src/app/actions/contact.ts`** — la única entrada de datos del sitio.

Fuera de estos dos archivos no hay input de usuario ni secretos. Cualquier PR que
introduzca una tercera superficie actualiza este plan primero.

### Modelo de confianza del formulario

```
navegador (no confiable)
   │  name, email, message, turnstileToken
   ▼
server action  ─── 1. rate limit por IP        → 429
                ── 2. validar los 3 campos     → error de validación
                ── 3. verificar token con CF   → rechazo genérico  ◄── fail-closed
                ── 4. enviar por Resend        → error visible al usuario
                └── 5. responder estado estático (nunca eco del input)
```

El orden importa: el token se verifica **antes** de gastar cuota de Resend, y el
rate limit **antes** de todo, para que un atacante no pueda forzar llamadas a
Cloudflare. Ninguno de los pasos escribe en disco ni en base de datos.

## 3. Estrategia de verificación por capa

| Capa | Qué verifica | Herramienta |
|---|---|---|
| Context-load | La app arranca sin env vars y no revienta | Playwright (`context-load.spec.ts`) |
| Unit | Validación, rate limit, selección de transporte | Playwright sin navegador |
| Contrato | Shape del server action con datos de borde (vacío, 50k, Unicode, CRLF) | Playwright unit |
| Cabeceras | CSP y demás en la **respuesta real** | Playwright `request` contra build de producción |
| Navegador real | CSP que bloquea sin error JS, hidratación, fail-closed de Turnstile | agent-browser + Playwright |
| SAST | Patrones prohibidos en todo el repo | Semgrep con reglas propias |
| Secretos | Credenciales en el árbol y en el historial | gitleaks + `scripts/check-secrets.mjs` |
| Rendimiento / a11y | Gate ≥95 / ≥95 | Lighthouse CI |

**Regla de falsabilidad:** ninguna de estas capas cuenta como verificada hasta que
se la vio en rojo al menos una vez. Los fixtures que lo demuestran viven en
`security-fixtures/` y `.semgrep/tests/`.

## 4. Gates entre fases

- **Fase 1 → 2:** build limpio, CSP en respuesta real, suite en verde. ✅ cerrado 2026-08-07.
- **Fase 2 → 3:** los escenarios Gherkin de RF-104 en verde, el crítico visto en
  rojo a propósito, capturas de los 3 estados en navegador real, Semgrep validado
  contra su fixture. **Requiere confirmación humana.**
- **Fase 3 → 4:** bloqueado por `clarify` (dominio, capturas, PDFs, inbox).
- **Antes del primer deploy:** purple-team de la sección 5 del protocolo.

## 5. Lo que este plan NO autoriza

- `strix` o cualquier prueba en volumen mientras el protocolo de neutralización de
  efectos no esté cerrado y verificado.
- Rellenar un `[PENDIENTE]` con un valor inventado.
- Marcar una tarea como hecha con "compila" o "los tests pasan" como única evidencia.

## 5b. Toolchain de verificación — estado real (2026-08-08)

| Herramienta | Rol | Evidencia de que funciona |
|---|---|---|
| ESLint (`no-restricted-syntax`) | Bloquea T-104 en cada PR | `npm run verify:guardrails` la ejecuta contra `security-fixtures/t104-host-header.ts` y falla si no detecta las 3 violaciones plantadas |
| Semgrep (`semgrep-rules/`) | 4 reglas propias (T-104, PII en logs, secreto público, fuga de error interno) | `npm run verify:semgrep` corre `semgrep --test` + confirma que cada regla tiene al menos un caso vulnerable cubierto en `semgrep-rules/security.ts` |
| `scripts/check-secrets.mjs` | Red de seguridad local sin red, corre en cada commit potencial | Escanea árbol + no-versionados no ignorados; complementa a gitleaks en CI |
| Playwright (unit + navegador real) | Los 18 escenarios de `tests/rf-104.feature` | Ver §5c |
| Lighthouse CI (`npm run lighthouse`) | Gate ≥95 Performance / ≥95 Accessibility | Corrido en frío contra el build real, con `chromePath` resuelto desde el Chromium que ya trae Playwright (`scripts/run-lighthouse.mjs`); el mecanismo de aserción se probó exigiendo un score >100% y viéndolo fallar |
| `agent-browser` | Instalado, pendiente de uso para las capturas del checkpoint | — |

## 5c. Notas de la implementación de Fase 2

- El rate limit se probó únicamente en el proyecto `chromium` de Playwright, no
  en `mobile`: los dos proyectos comparten el mismo proceso de servidor y la
  misma IP de origen (127.0.0.1), así que correr el mismo test de cuota en los
  dos hace que el segundo hereda el estado del primero. Es lógica de servidor
  por IP, no depende del viewport — una sola verificación es la cobertura
  correcta. Detalle completo en `tasks/lessons.md`.
- Un archivo `'use server'` de Next.js solo puede exportar funciones async;
  el estado inicial y los tipos del formulario viven en `src/lib/contact-state.ts`,
  no en `src/app/actions/contact.ts`. `tsc` y `next build` NO detectan esta
  regla — solo se manifiesta al correr la app. Detalle en `tasks/lessons.md`.

## 6. Deuda de proceso (reconocida)

La Fase 1 se implementó saltando de `specify` a `implement`, sin este plan y sin el
checkpoint `plan → implement`. Consecuencia medible: se incorporó una regla ESLint
para T-104 que no detectaba nada y se reportó como control activo. Está en
`tasks/lessons.md`. Este documento existe para que la Fase 2 no repita el patrón.
