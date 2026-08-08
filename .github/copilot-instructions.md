# Instructions for GitHub Copilot

## Project context
Single-page personal portfolio site for Luis Alejandro Cerón Muñoz, a full-stack
developer with a security-engineering angle. Its only job: convert a non-technical
recruiter's first 60 seconds into a contact or a click to his GitHub. It is not a
second ElevaForge marketing site and not a repo browser.

## Tech stack
- Next.js 14 (App Router), matching the ElevaForge codebase for consistency.
- Tailwind CSS.
- Resend for the contact form.
- Cloudflare Turnstile for spam protection.
- Playwright for E2E tests.
- Vercel for hosting.
- Node.js 18+.

## Code principles
1. One page. Do not add routes, a blog, or a CMS unless the SRS scope changes first.
2. Content (project blurbs, links) lives in a single typed config file, never
   hardcoded inline in JSX — the owner edits content via a config change, not by
   hunting through components.
3. No claim on this page without a backing link. If a project highlight can't point
   to a real repo, screenshot, or live demo, it doesn't go on the page.
4. Every external link opens the exact resource named — no vague "Learn more" that
   could point anywhere.

## Mandatory architecture patterns
- Server actions for the contact form submission — no client-side-only handling of
  the send.
- All form validation duplicated server-side even if it also exists client-side.
  Client validation is UX, not security.
- Static content typed via a single `content.ts` (or `.json`) config, imported by
  the page — see RF-101/102/103 of the SRS for what belongs there.

## Security — non-negotiable rules
- Resend API key: `.env` only, never committed. Verify with a secrets scanner in CI
  before every merge — this is not optional.
- Contact form is fail-closed: if the Turnstile token hasn't arrived, the submit
  button stays disabled. Do not allow submission and reject server-side only — that
  reintroduces the exact bug already fixed and documented in koa-landing's history
  (see `tasks/lessons.md` below, to be filled once that lesson is ported).
- Never render raw user input back to the page. Any confirmation message after
  submit is static text, not an echo of what the user typed.
- Never derive any URL, redirect, or link from the `Host` header. If an absolute URL
  is needed server-side, hardcode the domain.
- CSP headers with explicit directives (`default-src`, `script-src`, `frame-src` for
  Turnstile, `connect-src` for the form endpoint) — never a bare "CSP enabled" claim
  without directives.
- Error logging: endpoint + generic message only. Never log form content or the
  visitor's email address.
- No database, no persisted PII. The contact form payload passes through to email
  and is not retained anywhere else.

## Task management
Read `tasks/todo.md` before starting work. Update it as tasks complete. If a bug or
non-obvious gotcha is found and fixed, write it to `tasks/lessons.md` in the same
turn — don't defer it to "later," it doesn't get written later.

## Development workflow
- Plan before implementing anything touching the contact form or headers — those are
  the only two places this project has real security surface.
- Definition of Done for any task: tests pass, Lighthouse Performance and
  Accessibility both ≥95, no secrets in the diff, CSP present on every response.

## Environment commands
- Tests: `npx playwright test`
- Lint: `npm run lint`
- Build: `npm run build`
- CI: GitHub Actions, triggered on PR to `main`

## Boundaries
- Do not add pages, a CMS, or an account system without first updating the SRS scope
  section — this is a deliberate v1 constraint, not an oversight.
- Do not touch the ElevaForge, CareLink, koa-landing, or koa-store repos from this
  project. This is a separate, standalone site.
- When in doubt about scope, ask — don't guess and build past the SRS.
