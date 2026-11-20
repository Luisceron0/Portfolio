// Import the rendercv function and all the refactored components
#import "@preview/rendercv:0.3.0": *

// Apply the rendercv template with custom configuration
#show: rendercv.with(
  name: "Luis Alejandro Cerón Muñoz",
  title: "Luis Alejandro Cerón Muñoz - CV",
  footer: context { [#emph[Luis Alejandro Cerón Muñoz -- #str(here().page())\/#str(counter(page).final().first())]] },
  top-note: [ #emph[Last updated in Nov 2026] ],
  locale-catalog-language: "en",
  text-direction: ltr,
  page-size: "a4",
  page-top-margin: 0.5in,
  page-bottom-margin: 0.5in,
  page-left-margin: 0.5in,
  page-right-margin: 0.5in,
  page-show-footer: false,
  page-show-top-note: false,
  colors-body: rgb(0, 0, 0),
  colors-name: rgb(0, 0, 0),
  colors-headline: rgb(0, 0, 0),
  colors-connections: rgb(0, 0, 0),
  colors-section-titles: rgb(0, 0, 0),
  colors-links: rgb(0, 0, 0),
  colors-footer: rgb(128, 128, 128),
  colors-top-note: rgb(128, 128, 128),
  typography-line-spacing: 0.6em,
  typography-alignment: "left",
  typography-date-and-location-column-alignment: right,
  typography-font-family-body: "XCharter",
  typography-font-family-name: "XCharter",
  typography-font-family-headline: "XCharter",
  typography-font-family-connections: "XCharter",
  typography-font-family-section-titles: "XCharter",
  typography-font-size-body: 10pt,
  typography-font-size-name: 25pt,
  typography-font-size-headline: 10pt,
  typography-font-size-connections: 9pt,
  typography-font-size-section-titles: 1.3em,
  typography-small-caps-name: false,
  typography-small-caps-headline: false,
  typography-small-caps-connections: false,
  typography-small-caps-section-titles: false,
  typography-bold-name: true,
  typography-bold-headline: false,
  typography-bold-connections: false,
  typography-bold-section-titles: true,
  links-underline: false,
  links-show-external-link-icon: false,
  header-alignment: center,
  header-photo-width: 3.5cm,
  header-space-below-name: 0.5cm,
  header-space-below-headline: 0.5cm,
  header-space-below-connections: 0.5cm,
  header-connections-hyperlink: true,
  header-connections-show-icons: false,
  header-connections-display-urls-instead-of-usernames: true,
  header-connections-separator: "•",
  header-connections-space-between-connections: 0.4cm,
  section-titles-type: "centered_with_centered_partial_line",
  section-titles-line-thickness: 0.5pt,
  section-titles-space-above: 0.5cm,
  section-titles-space-below: 0.2cm,
  sections-allow-page-break: true,
  sections-space-between-text-based-entries: 0.3em,
  sections-space-between-regular-entries: 1em,
  entries-date-and-location-width: 4.15cm,
  entries-side-space: 0.2cm,
  entries-space-between-columns: 0.1cm,
  entries-allow-page-break: false,
  entries-short-second-row: false,
  entries-degree-width: 1cm,
  entries-summary-space-left: 0cm,
  entries-summary-space-above: 0cm,
  entries-highlights-bullet:  "•" ,
  entries-highlights-nested-bullet:  "•" ,
  entries-highlights-space-left: 0.15cm,
  entries-highlights-space-above: 0cm,
  entries-highlights-space-between-items: 0cm,
  entries-highlights-space-between-bullet-and-text: 0.5em,
  date: datetime(
    year: 2026,
    month: 11,
    day: 19,
  ),
)


= Luis Alejandro Cerón Muñoz

  #headline([Application Security Engineer | Secure Software Architecture | DevSecOps])

#connections(
  [Pasto, Colombia. Hybrid in Medellín or Bogotá. Relocation to Germany or Spain],
  [#link("mailto:luiscerontrabajos@gmail.com", icon: false, if-underline: false, if-color: false)[luiscerontrabajos\@gmail.com]],
  [#link("tel:+57-314-4087963", icon: false, if-underline: false, if-color: false)[+57 314 4087963]],
  [#link("https://portfolio-luisceron.vercel.app/", icon: false, if-underline: false, if-color: false)[portfolio-luisceron.vercel.app]],
  [#link("https://linkedin.com/in/luis-ceronmunoz", icon: false, if-underline: false, if-color: false)[linkedin.com\/in\/luis-ceronmunoz]],
  [#link("https://github.com/Luisceron0", icon: false, if-underline: false, if-color: false)[github.com\/Luisceron0]],
)


== Profile

Application security engineer with more than 3 years building and deploying software for healthcare, the public sector and commerce. Threat modeling, access control, applied cryptography, WAF and SAST\/SCA in CI, on a full-stack foundation (Java\/Spring Boot, Python\/Django, React\/Next.js).

== Experience

#regular-entry(
  [
    #strong[I.P.S. San José], Software Engineer (project-based contract) | Villagarzón, Putumayo, Colombia

  ],
  [
    Sep 2026 to Nov 2026

  ],
  main-column-second-row: [
    - Built, in a 2-person team, the new institutional website with an admin panel (Astro, Cloudflare Workers, D1, Better Auth), now in production: panel authentication, end-to-end patient requests, locations and configurable data retention.

    - Developed a tool that converts emailed panoramic X-rays to PDF without re-encoding, with sender verification (DKIM and DMARC), image validation, secrets in the OS credential store and fidelity checked with SHA-256.

    - Added security gates to the website CI (gitleaks across the full history, a static SQL rule, pnpm audit, coverage) and closed the findings of an internal audit.

    - Managed the databases, built an inventory manager and internal automations, and started a DICOM medical imaging viewer (in progress).

  ],
)

#regular-entry(
  [
    #strong[Alcaldía de Pasto (City Government)], Full-Stack Software Engineering Intern | Pasto, Colombia

  ],
  [
    Oct 2025 to Dec 2025

  ],
  main-column-second-row: [
    - Co-developed (2-person team) an equipment maintenance management system (Django REST, Next.js, MySQL, JWT) and deployed it on Apache to the municipality’s server with production hardening: environment-based secrets, DEBUG off by default, HTTPS and CSRF trusted origins.

    - Delivered the system in operation within the 3 months of the internship, with PDF and Excel report generation.

  ],
)

#regular-entry(
  [
    #strong[ElevaForge], Co-Founder and CTO (architecture and security) | Remote

  ],
  [
    Jun 2025 to present

  ],
  main-column-second-row: [
    - Co-founded a 3-engineer software studio and owned the architecture decisions, recorded in versioned ADRs with their discarded alternatives.

    - Designed deny-by-default authorization: Row Level Security enabled with no policies for anon or authenticated, and all data access routed through the server.

    - Led the migration of the corporate site from Angular to Next.js 14 and built elevaforge.com and the KOA demos (landing page and store) with a multi-account admin panel.

    - Set up the site CI with gitleaks, lint, typecheck, tests, build and e2e; on the KOA demos, CodeQL, audit-ci and Lighthouse CI (landing) and CodeQL and npm audit (store).

  ],
)

#regular-entry(
  [
    #strong[Estación de Servicio Kennedy], IT and Systems Contractor (full-time) | Pasto, Colombia

  ],
  [
    Mar 2023 to Mar 2026

  ],
  main-column-second-row: [
    - Developed and maintained the information systems of an operating fuel station; managed the databases and optimized inventory and sales control.

  ],
)

#regular-entry(
  [
    #strong[Freelance], Full-Stack Software Developer (part-time) | Remote

  ],
  [
    Mar 2023 to present

  ],
  main-column-second-row: [
    - Performed information security assessments for more than 10 private clinics and SMEs, through outsourcing firms: access control, traceability and data custody.

    - Projects alongside my degree: data migrations to SAP and Oracle NetSuite, CRM (Salesforce, HubSpot) and reporting with Odoo, Python and PostgreSQL.

  ],
)

== Security Projects

  #regular-entry(
  [
    #strong[SEG, JML workforce access system] | github.com\/grupogpsi12\/SEG

  ],
  [
  ],
  main-column-second-row: [
    #summary[Postgraduate project with professional practices; fictitious company and data.]

    - Led the design and build (206 of 209 commits) of a system connecting HR and IT through GLPI 11: hexagonal Django 5.2 behind a ModSecurity\/OWASP CRS 4 WAF, password plus TOTP and Docker secrets.

    - Verified it with 2,574 unit tests, 97.7\% branch coverage and a 97.8\% mutation score on the domain, and a dashboard p95 of 786 ms with 20 concurrent users.

    - Self-audited 39 DREAD-scored findings mapped to ASVS L2, each fix proven red to green, plus ZAP and sqlmap with no injectable parameters.

  ],
)

  #regular-entry(
  [
    #strong[Tributary, multi-regime e-invoicing engine] | github.com\/Luisceron0\/Tributary

  ],
  [
  ],
  main-column-second-row: [
    #summary[Sales across Colombia, Spain and Germany. Reference implementation, not certified.]

    - Guaranteed fiscal immutability with PostgreSQL triggers and a SHA-256 hash chain whose verifier points at the altered record.

    - Defined 13 security controls with a binary criterion and 4 independent CI gates; the quickstart brings everything up in under 3 minutes.

  ],
)

  #regular-entry(
  [
    #strong[KOA Store, bilingual demo store] | store.koa.elevaforge.com

  ],
  [
  ],
  main-column-second-row: [
    - Recalculated prices on the server against the catalog, ignoring any price or total sent by the browser; simulated checkout, no real payments.

  ],
)

  #regular-entry(
  [
    #strong[CareLink, multi-tenant clinical platform] | github.com\/Luisceron0\/CareLink

  ],
  [
  ],
  main-column-second-row: [
    #summary[Clinical history and triage for several institutions. Reference implementation.]

    - Applied AES-256-GCM encryption with a per-institution derived key and in-query suppression of aggregates with fewer than 5 distinct patients.

    - Blocked edits to signed records with a PostgreSQL trigger and revalidated each specialist access on every request.

  ],
)

== Education

#education-entry(
  [
    #strong[Universidad Cooperativa de Colombia], BEng in Software Engineering | Pasto, Colombia

  ],
  [
    Feb 2022 to Dec 2025

  ],
  main-column-second-row: [
    - Final degree project: AI-assisted REST API with JWT authentication and secure secrets management.

    - Relevant coursework: Software Architecture, Distributed Systems, Computer Security, Artificial Intelligence Systems.

  ],
)

#education-entry(
  [
    #strong[Politécnico Grancolombiano], Postgraduate Specialization in Information Security Project Management | Colombia

  ],
  [
    Jan 2026 to present

  ],
  main-column-second-row: [
    - In progress, estimated completion in 2027.

    - SEG project: led the design and build of a JML system with hexagonal architecture behind a WAF, audited against ASVS level 2.

  ],
)

== Certifications

Cybersecurity, MinTIC Colombia (Sep 2024)

Network Security, Cisco (Dec 2024)

== Skills

#strong[Security:] Threat modeling, OWASP Top 10, OWASP ASVS, RBAC, Row Level Security, JWT (RS256), Applied cryptography (AES-256-GCM), Secrets management, SAST (CodeQL, Semgrep, bandit), SCA (audit-ci, npm audit, Trivy, pip-audit), DAST (OWASP ZAP, sqlmap), WAF (ModSecurity, OWASP CRS), Secret scanning (gitleaks), Network security

#strong[Architecture:] Hexagonal architecture, Multi-tenant isolation, ADRs, Layered separation, REST API design, Data modeling, Scalable system design

#strong[Backend:] Java, Spring Boot, Python, Django, Django REST Framework, TypeScript

#strong[Frontend:] React, Next.js, Angular, Vue.js, Astro, JavaScript, Tailwind CSS, HTML5, CSS3

#strong[Cloud and DevOps:] Docker, GitHub Actions (CI\/CD), Cloudflare Workers, Apache, AWS (EC2, S3), Vercel, Git

#strong[Databases:] PostgreSQL, MySQL, MongoDB, SQLite, Versioned migrations (Flyway)

== Languages

Spanish: native. English: C1 (EF SET).
