# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: AppSec / Product Security hiring managers and technical recruiters** who decide in about 30 seconds whether to read further. Openings in Colombia (hybrid in Medellín or Bogotá) and relocation to Germany or Spain.
- **Non-technical recruiters**, served by the hero and the downloadable CV (ES primary, EN identical).
- **Prospective clients of ElevaForge** (the studio Luis co-founded) looking for someone who builds software and secures it.

Their job: confirm, quickly and without trusting adjectives, that Luis took real software to production and is moving into Application Security, then contact him or open GitHub.

## Product Purpose

A personal portfolio for Luis Alejandro Cerón Muñoz. It turns a visitor's first 30 to 60 seconds into a contact or a click to GitHub. Success: the visitor sees both sides at once (a developer with software in production, and the security work done on it) and every claim can be checked.

## Positioning

A developer who took software to production and is moving into Application Security, and neither side hides the other. Each security control is shown next to the project and the code that implements it, linked to a commit-pinned permalink. No neighboring portfolio can copy that claim without the same repositories behind it.

## Operating Context

- Visitors arrive from a CV, LinkedIn, an application or a referral; many skim on mobile.
- The site is bilingual (Spanish default, English by `?lang=en`), one home plus one page per project at `/casos/<slug>`.
- Projects are grouped by category (security, development, testing) with up to 3 featured; filters are shareable by URL.
- Content lives in one typed file (`src/content.ts`); the CV is generated from `cv/*.yaml` with RenderCV.

## Capabilities and Constraints

- Next.js 14 App Router, Tailwind, TypeScript; CSP with a per-request nonce; no new runtime dependencies without reason.
- Contact form via server action, Turnstile, rate limit; no database, no persisted personal data.
- `[PENDIENTE: ...]` markers only for data that blocks publishing something true; optional improvements go to `tasks/todo.md`.
- Upcoming projects (`upcomingProjects`) and Labs write-ups exist in content but render only once they are real.

## Brand Commitments

- Name: Luis Alejandro Cerón Muñoz. Role line: Application Security Engineer | Secure Software Architecture | DevSecOps.
- Voice: short sentences, active voice, no empty adjectives, no security absolutes ("unbreachable", "100% secure"), no long dashes in visible copy.
- AI tools may be mentioned only as specific, responsible tooling that made a workflow more efficient, never as the builder of the work. Describe the practices (SRS, ADR, contract and mutation tests, evidence-based audit) as Luis's.

## Evidence on Hand

- Public repositories: CareLink, Tributary, ElevaForge, koa-landing, koa-store, SEG (grupogpsi12/SEG), this portfolio. Controls link to commit-pinned files and lines.
- Private client repositories (IPS San José website, rx-gmail-pdf): described without links, internal paths, exact versions or real screenshots.
- Measured figures only with a cited source (for example SEG `auditoria/metricas.json`). No testimonials, client logos or invented metrics exist; do not fabricate them.

## Product Principles

1. Nothing without evidence: every claim points to code, a document or a confirmed fact.
2. Both sides visible: production software and its security, never one hiding the other.
3. Client privacy first: nothing exploitable about a real system in production is published until it is fixed.
4. Honest authorship: team work says "in a team of N" and states what Luis did, measured in Git.

## Accessibility & Inclusion

WCAG 2.1 AA: text contrast of at least 4.5:1 measured by `npm run check:contrast`, visible focus on every surface, full function with `prefers-reduced-motion` and without JavaScript for content. Lighthouse Performance and Accessibility at 95 or more.
