# SRS — Personal Portfolio Site
**Version:** 1.5
**Date:** 2026-08-07
**Author:** Luis Alejandro Cerón Muñoz | **Technical reviewer:** Arch-Sentinel
**Status:** Draft — pending [PENDIENTE] items before build starts

---

## 1. Executive summary

A personal site whose only job is to convert a recruiter's first 60 seconds into
either a contact or a click-through to the unified GitHub profile. **Since v1.4
(2026-11-14)** the site positions Luis as an Application Security engineer who
builds: development is shown as the evidence behind each security decision, not as
a separate skill set. The primary audience is now AppSec / security architecture
hiring managers and technical recruiters; the non-technical recruiter is still
served by the hero and the CV. It is not a second copy of ElevaForge's marketing site and not a repo
browser — those already exist. It exists to answer, in plain language: who is Luis,
what does he build, why does security matter in his work, and how do I reach him.

## 2. Stakeholders and users

| Role | Primary need | Success criterion |
|---|---|---|
| Non-technical recruiter | Understand value prop without reading code | Leaves with a clear one-line answer to "what does this person do" |
| Technical recruiter / hiring manager | Confirm depth quickly, then go deeper | Reaches the GitHub profile in ≤2 clicks from landing |
| Luis (owner) | Update content without redeploying code | Copy lives in one structured file, not hardcoded in JSX |

## 3. Scope

**In scope:**
- Landing page (hero, "what I do" pillars, security case summaries, "how I work"
  process, experience, skills, education and certifications, contact CTA).
- **One detail page per security case** at `/casos/<slug>` (v1.4, see RF-111). The
  summary of each case stays on the landing page; the detail lives at its own URL.
- `sitemap.xml`, `robots.txt`, JSON-LD `Person` and a generated Open Graph image
  (v1.4, see RF-112).
- Downloadable CV (ES/EN, generated from the RenderCV YAML per RF-006 of the
  portfolio-wide SRS — this site only *links* to the PDFs, it does not generate them).
- Contact form → email, with spam protection.
- Deploy on a domain the user owns.

**Out of scope (explicit):**
- Blog and any page type other than the landing page and the case pages of RF-111.
  ~~Case-study pages~~ **moved into scope in v1.4 (2026-11-14)** at the owner's
  request: a clean, linkable URL per case (`/casos/carelink`) is what a security
  hiring manager shares and what a search engine indexes. Each case page is static
  content from `src/content.ts`, same discipline as the landing page.
- CMS / admin panel. Content is a static config file edited via PR, same discipline
  as the rest of the portfolio repos.
- ~~Multilingual toggle (ES/EN switch on the site itself).~~ **Moved into scope in
  v1.2 (2026-08-09)** at the owner's request. See RF-109. Still no new routes: the
  language is a query parameter on the same single page, not a `/en` route.
- Any account system, database, or user-generated content beyond the contact form.

## 4. Functional requirements

### RF-101: Hero + value proposition
- **Description:** above the fold: the headline (Application Security Engineer |
  Secure Software Architecture | DevSecOps), one supporting line about the stack he
  builds with, and two CTAs (projects, CV download) plus GitHub and LinkedIn.
- **Changed in v1.4:** the audience is now security hiring managers, so standard
  role terms (AppSec, DevSecOps) are allowed in the headline. The supporting line
  stays in plain language.
- **Acceptance criteria:**
  - [ ] Readable without scrolling on a 375px viewport.
  - [ ] No security absolutes ("unbreachable", "100% secure").

### RF-102: Projects (count derived from the content, never hardcoded)
- **Description:** CareLink, Tributary, ElevaForge, KOA Landing and KOA Store,
  each with a blurb, a screenshot, a technology list, and links to the live site
  and/or the repository.
- **Scope change (v1.1, 2026-08-09):** was "2 max" (CareLink + a single combined
  ElevaForge/KOA entry). The owner asked for the four projects to be shown
  separately, since KOA Landing and KOA Store are distinct deliverables with
  distinct live URLs, and ElevaForge is the studio itself. Widening this is a
  deliberate scope decision, not scope creep — recorded here before building.
- **Scope change (v1.3, 2026-08-18):** Tributary added at the owner's request, so
  the count goes from four to five. It is the first project with **no live URL at
  all and no intention of having one** (its own ADR-011 explains why), which the
  acceptance criteria below now account for: the "every live link resolves"
  criterion cannot be read as "every project has a live link".
- **Scope change (v1.4, 2026-11-14):** projects become **security cases**, in this
  order: CareLink, ElevaForge, Tributary, KOA (KOA Landing and KOA Store merged into
  one case with two subsections: business logic security and anti-automation).
  Every case follows a fixed template: problem, stack, status (in production /
  demo / repository), data flow and sensitive assets, main threats, chosen controls
  and why (each linked to a file or line of its repository), how it was verified,
  and links. STRIDE categories appear only where the project repository publishes
  a threat model that backs them; otherwise the field is a `[PENDIENTE]`.
- **Scope change (v1.5, 2026-11-21):** the section is titled **Projects**. Each
  project has one or more categories (security, development, testing) and up to
  3 are featured. Filters (Featured by default, Security, Development, Testing)
  are accessible buttons with `aria-pressed`, the URL reflects the filter
  (`?categoria=`) and, without JavaScript, the full list is shown. Every case
  states its role with authorship measured in Git. A real system in production
  never shows an exploitable open point until it is fixed; it then returns as a
  dated before and after inside its controls.
- **Precondition:** the unified GitHub account (portfolio SRS RF-001) exists, since
  both project links ultimately point there.
- **Acceptance criteria:**
  - [ ] Each project answers "what problem, what stack, what's the security angle" in
    the blurb.
  - [ ] Screenshot present for all five, captured against the real live site (or,
    for CareLink and Tributary, which have no public deploy, from their own repo's
    evidence/screenshots docs).
  - [ ] Every live/demo link that exists resolves (HTTP 200), verified — not
    assumed. A project without a live URL links only to its repository; it never
    gets a placeholder or a dead demo link.
  - [ ] No claim on this page that isn't backed by the linked repo or demo.

### RF-106: Professional profile and career timeline
- **Description:** a profile paragraph plus a chronological timeline of experience
  and education, sourced from the owner's RenderCV YAML so the site and the CV
  cannot drift apart.
- **Added in v1.1 (2026-08-09)** at the owner's request: the v1 page carried the
  value prop but nothing about who Luis is professionally, which left a technical
  recruiter with no way to assess depth without leaving the page.
- **Acceptance criteria:**
  - [ ] Every role and study entry matches the CV YAML — no invented dates, titles
    or employers.
  - [ ] Entries are ordered most-recent-first and state their date range.
  - [ ] Nothing here contradicts the CV or LinkedIn (cross-check of §9).

### RF-107: Skills
- **Description:** technology and language competencies, grouped by category,
  sourced from the same CV YAML as RF-106.
- **Added in v1.1 (2026-08-09).**
- **Acceptance criteria:**
  - [ ] Groups and items match the CV YAML exactly.
  - [ ] Rendered as scannable chips, not a wall of prose.

### RF-111: Case detail pages
- **Description:** `/casos/<slug>` renders the full template of one security case
  (RF-102). The landing page shows the summary and links to it.
- **Added in v1.4 (2026-11-14)** at the owner's request.
- **Acceptance criteria:**
  - [ ] One URL per case, slug from `src/content.ts`; unknown slugs return 404.
  - [ ] Same bilingual mechanism as the landing page (`?lang=en`), with canonical
    and hreflang per case.
  - [ ] One H1 per page; CSP and security headers present (same middleware).

### RF-112: Discoverability
- **Description:** title ≤60 and meta description ≤155 characters per language,
  Open Graph and Twitter Card with a generated image (name + headline only),
  JSON-LD `Person` (name, jobTitle, address locality, url, sameAs, knowsAbout,
  alumniOf), `sitemap.xml`, `robots.txt`.
- **Added in v1.4.** No phone, personal email, age or street address in metadata.
- **Acceptance criteria:**
  - [ ] Lighthouse SEO ≥95 and Accessibility ≥95, Performance not below its
    previous level.

### RF-108: In-page navigation
- **Description:** a sticky in-page nav linking to the sections of the single page.
- **Added in v1.1 (2026-08-09).** This does **not** introduce routes: every target
  is an anchor on the same page, so the "one page" constraint of §3 holds.
- **Acceptance criteria:**
  - [ ] Every nav item targets an anchor that exists on the page.
  - [ ] Keyboard reachable, and it never covers the skip-to-content link.

### RF-103: CV download
- **Description:** one button, auto-detects nothing — offers both ES and EN PDFs
  explicitly labeled, no guessing the visitor's language.
- **Acceptance criteria:**
  - [ ] Both PDFs open/download without a broken link.
  - [ ] File names are descriptive (`luis-ceron-cv-en.pdf`, not `cv (3).pdf`).

### RF-104: Contact form
- **Description:** name, email, message. Submits via server action → Resend → Luis's
  inbox. No data persisted beyond the email itself (no database).
- **Flujos alternativos:** submit fails → user sees a clear error, not a silent fail
  (documented lesson already learned in koa-landing's own commit history — reuse it,
  don't relearn it).
- **Acceptance criteria:**
  - [ ] Submission blocked until Turnstile token is present (same fix already applied
    in koa-landing — see `tasks/lessons.md` of that repo).
  - [ ] Server-side validation on all fields — never trust client-side only.
  - [ ] Rate-limited per IP.
  - [ ] Success and failure states are both explicit to the user.

### RF-105: Link to GitHub
- **Description:** one clearly-labeled link/button to the unified `Luisceron0` GitHub
  profile, positioned for a technical visitor who wants to skip the marketing copy.
- **Acceptance criteria:**
  - [ ] Visible without scrolling past the hero.
  - [ ] Points to the profile, not to a single repo.

### RF-109: Bilingual content (ES / EN)
- **Description:** every visible string on the page is available in Spanish and
  English, with a visible switch. Spanish stays the default (D-06 of the portfolio
  SRS).
- **Added in v1.2 (2026-08-09)**, moved out of §3's out-of-scope list at the owner's
  request.
- **Design constraint that keeps §3 intact:** the language is selected by a query
  parameter on the same page (`/?lang=en`), **not** by a new route. One page, one
  route, as before. The parameter is read server-side so the language is correct in
  the first response, not after a client-side swap.
- **Acceptance criteria:**
  - [ ] No visible string exists in only one language: a missing translation must be
    a type error, not a silent fallback to Spanish.
  - [ ] `<html lang>` matches the language actually rendered, set server-side.
  - [ ] The switch is a real link, so the chosen language is shareable and
    bookmarkable.
  - [ ] An unrecognised or absent `lang` value renders Spanish, never a blank page.
  - [ ] Project links that have a real localized version point to it; ones that do
    not keep their original URL. Verified per URL, never assumed.

### RF-110: Visual liveliness
- **Description:** the page should read as designed and alive rather than as a
  document, without decoration that competes with the content.
- **Added in v1.2 (2026-08-09)** at the owner's request ("demasiado plana y sin
  vida").
- **Constraint:** whatever is added must not cost the Lighthouse gate (≥95/≥95), must
  not introduce an external dependency or asset, and must keep every text/background
  pair at WCAG AA.
- **Acceptance criteria:**
  - [ ] Lighthouse Performance and Accessibility both still ≥95, measured.
  - [ ] Contrast still AA on every pair, measured, including any new surface.
  - [ ] No new network request: decoration is CSS, not images or fonts.

## 5. Non-functional requirements

### Performance
- Lighthouse Performance ≥ 95, matching the ElevaForge baseline. A portfolio site
  that's slow undercuts the "verifiable metrics" claim made elsewhere in the
  portfolio.

### Accessibility
- Lighthouse Accessibility ≥ 95. WCAG AA on contrast and keyboard navigation.

### Security
- **Authentication/authorization:** none — no accounts, no protected routes.
- **Sensitive data identified:** contact form submissions (name, email, message —
  low sensitivity, but still PII). Never logged to disk or DB; passed straight to the
  email provider over TLS.
- **Headers:** CSP with explicit directives (not "CSP enabled" as a bare claim — list
  `default-src`, `script-src`, `frame-src` for Turnstile, `connect-src` for the
  Resend/form endpoint).
- **Input validation:** every form field validated server-side; the header-as-SQL-sink
  pattern (CWE-89-H) doesn't apply here (no SQL, no DB) but the same discipline
  applies to anything logged — nothing free-text goes into a log line unsanitized.

### Logging
- Errors (5xx, failed sends) logged with endpoint + generic message, never with form
  content or the visitor's email.

## 6. Data model

No persistent data store. The only "data" is the static content config (project
copy, links) and the ephemeral contact-form payload that passes through to email and
is not retained.

## 7. Threat model (STRIDE)

### Assets
| Asset | Sensitivity | Consequence if compromised |
|---|---|---|
| Resend API key | High | Attacker sends email as Luis / exhausts quota |
| Contact form | Low-Medium | Spam, or used as an open relay if unprotected |
| Site content | Low | Defacement — reputational, not data-loss |

### Threats
| ID | Threat | STRIDE | Asset | Mitigation |
|---|---|---|---|---|
| T-101 | API key committed to repo | Information Disclosure | Resend key | `.env` only, gitignored, verified via the same `secrets scanning` discipline used elsewhere (RF-104 depends on this) |
| T-102 | Form abused for spam/relay | Denial of Service (of Luis's inbox) | Contact form | Turnstile + rate limit (RF-104) |
| T-103 | XSS via unsanitized form echo (if a confirmation page ever renders submitted content) | Tampering | Site content | Never render raw user input; if a confirmation message exists, it's static text, not an echo |
| T-104 | Host header used in any server-side redirect/link generation | Tampering | Site integrity | If using server-side absolute URLs, hardcode the domain — never derive from `Host` |

## 8. External dependencies

| Dependency | Purpose | Risk if unavailable |
|---|---|---|
| Resend | Contact form delivery | Form silently fails — must degrade to visible error (RF-104) |
| Turnstile | Spam protection | Form should fail closed (block submit) if the token never arrives, not fail open |
| Hosting (Vercel, matching the rest of the portfolio) | Deploy | Standard — no special handling needed |
| Domain registrar | Not contracted yet. The site serves from its Vercel URL, declared in `site.url` | Not blocking: absolute URLs resolve against `site.url`, so the day a domain exists only that line changes |

## 9. Testing plan

- **Unit:** form validation logic (client and server).
- **E2E:** Playwright — happy path submit, Turnstile-blocked submit, server error
  path. Same tooling already in use across the other repos — no new dependency.
- **Security:** secrets scanning in CI (mandatory, not optional), CSP header present
  on every response.
- **Performance:** Lighthouse CI gate at ≥95, same pattern as ElevaForge.

## 10. Risks and mitigations

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-101 | Site built before GitHub unification (RF-001–003) finishes, links point to a fragmented profile | Medium | Medium | Explicit precondition on RF-102/105 | Luis |
| R-102 | Contact form repeats the exact bug already fixed in koa-landing (submit before Turnstile token) | Low if lessons.md is read first | Medium | RF-104 references that lesson directly | Luis |

## 11. Glossary

- **Turnstile** — Cloudflare's CAPTCHA alternative, already used in koa-landing.
- **[PENDIENTE]** — marks information not yet provided; must be resolved before the
  corresponding acceptance criterion can close.

## 12. Pending items

- ~~`[PENDIENTE: domain name]`~~ — **closed as a blocker (2026-08-18).** The site
  is live on its Vercel URL and `site.url` now declares it, so every absolute URL
  the server emits has a real origin behind it. A personal domain (not
  `elevaforge.com` — this site is Luis individually, not the studio) is still
  wanted, but it is now an upgrade and not a precondition: registering it means
  changing one line in `src/content.ts` and pointing DNS.
- `[PENDIENTE: KOA live screenshot]` — needs to be captured for RF-102 (CareLink's
  already exists in `docs/portfolio/screenshots/`).

## 13. Revision history

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-08-07 | Arch-Sentinel + Luis | Initial version, split from the portfolio-wide SRS per user request |
| 1.1 | 2026-08-09 | Luis | Scope widened at the owner's request: RF-102 goes from 2 to 4 projects (ElevaForge, CareLink, KOA Landing, KOA Store shown separately); new RF-106 (profile + career timeline), RF-107 (skills), RF-108 (in-page nav). Still one page, still no CMS, still no routes — §3's out-of-scope list is unchanged. |
| 1.2 | 2026-08-09 | Luis | RF-109 (bilingüe ES/EN por query param, sin rutas nuevas) y RF-110 (dinamismo visual) añadidos a petición del dueño. El toggle multilingüe sale de la lista de fuera de alcance del §3. |
| 1.5 | 2026-11-21 | Luis | Portfolio v2: Projects section with categories, featured projects and shareable filters; outcome and built fields; mandatory role; no exploitable open points of production systems; prepared (unrendered) upcoming projects and a Labs section that appears only with at least one write-up. |
| 1.4 | 2026-11-14 | Luis | Repositioning towards Application Security / secure architecture. Case-study pages move into scope (RF-111, `/casos/<slug>`), discoverability added (RF-112). RF-102 becomes 4 security cases with a fixed template (KOA Landing and KOA Store merged). RF-101 audience changes to security hiring managers. Still no CMS, no blog, no accounts. |
| 1.3 | 2026-08-18 | Luis | RF-102 pasa de 4 a 5 proyectos: entra Tributary (motor de facturación electrónica multi-régimen), a petición del dueño. Es el primer proyecto sin URL en vivo y sin intención de tenerla, así que el criterio de aceptación de los enlaces deja de asumir que todo proyecto tiene demo. Sigue siendo una sola página, sin CMS y sin rutas nuevas. |
