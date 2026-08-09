# SRS — Personal Portfolio Site
**Version:** 1.0
**Date:** 2026-08-07
**Author:** Luis Alejandro Cerón Muñoz | **Technical reviewer:** Arch-Sentinel
**Status:** Draft — pending [PENDIENTE] items before build starts

---

## 1. Executive summary

A single-page personal site whose only job is to convert a non-technical recruiter's
first 60 seconds into either a contact or a click-through to the unified GitHub
profile. It is not a second copy of ElevaForge's marketing site and not a repo
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
- Single landing page (hero, value prop, profile, career timeline, 4 project
  highlights, skills, contact CTA).
- Downloadable CV (ES/EN, generated from the RenderCV YAML per RF-006 of the
  portfolio-wide SRS — this site only *links* to the PDFs, it does not generate them).
- Contact form → email, with spam protection.
- Deploy on a domain the user owns.

**Out of scope (explicit):**
- Blog, case-study pages, multi-page navigation. One page is the spec; more pages is
  scope creep for a v1.
- CMS / admin panel. Content is a static config file edited via PR, same discipline
  as the rest of the portfolio repos.
- Multilingual toggle (ES/EN switch on the site itself). Spanish-first per D-06 of the
  portfolio SRS; English version is a v2 candidate, not v1.
- Any account system, database, or user-generated content beyond the contact form.

## 4. Functional requirements

### RF-101: Hero + value proposition
- **Description:** above the fold, in ≤2 sentences: what Luis builds and the security
  angle that differentiates him.
- **Acceptance criteria:**
  - [ ] Readable and understood without scrolling on a 375px viewport.
  - [ ] No jargon that a non-technical recruiter has to look up.

### RF-102: Project highlights (4)
- **Description:** ElevaForge, CareLink, KOA Landing and KOA Store, each with a
  blurb, a screenshot, a technology list, and links to the live site and/or the
  repository.
- **Scope change (v1.1, 2026-08-09):** was "2 max" (CareLink + a single combined
  ElevaForge/KOA entry). The owner asked for the four projects to be shown
  separately, since KOA Landing and KOA Store are distinct deliverables with
  distinct live URLs, and ElevaForge is the studio itself. Widening this is a
  deliberate scope decision, not scope creep — recorded here before building.
- **Precondition:** the unified GitHub account (portfolio SRS RF-001) exists, since
  both project links ultimately point there.
- **Acceptance criteria:**
  - [ ] Each project answers "what problem, what stack, what's the security angle" in
    the blurb.
  - [ ] Screenshot present for all four, captured against the real live site (or,
    for CareLink which has no public deploy, from its own repo's screenshots doc).
  - [ ] Every live/demo link resolves (HTTP 200), verified — not assumed.
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
| Domain registrar | `[PENDIENTE: domain name]` | Blocks RF-105 acceptance criteria until resolved |

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

- `[PENDIENTE: domain name]` — needs a personal domain (not `elevaforge.com` — this
  site is Luis individually, not the studio). Suggest checking availability of
  something short tied to his name before starting RF-105/deploy config.
- `[PENDIENTE: KOA live screenshot]` — needs to be captured for RF-102 (CareLink's
  already exists in `docs/portfolio/screenshots/`).

## 13. Revision history

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-08-07 | Arch-Sentinel + Luis | Initial version, split from the portfolio-wide SRS per user request |
| 1.1 | 2026-08-09 | Luis | Scope widened at the owner's request: RF-102 goes from 2 to 4 projects (ElevaForge, CareLink, KOA Landing, KOA Store shown separately); new RF-106 (profile + career timeline), RF-107 (skills), RF-108 (in-page nav). Still one page, still no CMS, still no routes — §3's out-of-scope list is unchanged. |
