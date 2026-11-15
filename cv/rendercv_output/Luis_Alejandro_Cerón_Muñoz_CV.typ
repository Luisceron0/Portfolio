// Import the rendercv function and all the refactored components
#import "@preview/rendercv:0.3.0": *

// Apply the rendercv template with custom configuration
#show: rendercv.with(
  name: "Luis Alejandro Cerón Muñoz",
  title: "Luis Alejandro Cerón Muñoz - CV",
  footer: context { [#emph[Luis Alejandro Cerón Muñoz -- #str(here().page())\/#str(counter(page).final().first())]] },
  top-note: [ #emph[Última actualización Nov 2026] ],
  locale-catalog-language: "es",
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
    day: 14,
  ),
)


= Luis Alejandro Cerón Muñoz

  #headline([Ingeniero de Seguridad de Aplicaciones | Arquitectura Segura | DevSecOps])

#connections(
  [Pasto, Colombia. Híbrido en Medellín o Bogotá. Relocalización a Alemania o España],
  [#link("mailto:luiscerontrabajos@gmail.com", icon: false, if-underline: false, if-color: false)[luiscerontrabajos\@gmail.com]],
  [#link("tel:+57-314-4087963", icon: false, if-underline: false, if-color: false)[+57 314 4087963]],
  [#link("https://portfolio-luisceron.vercel.app/", icon: false, if-underline: false, if-color: false)[portfolio-luisceron.vercel.app]],
  [#link("https://linkedin.com/in/luis-ceronmunoz", icon: false, if-underline: false, if-color: false)[linkedin.com\/in\/luis-ceronmunoz]],
  [#link("https://github.com/Luisceron0", icon: false, if-underline: false, if-color: false)[github.com\/Luisceron0]],
)


== Perfil

Ingeniero de software con más de 3 años construyendo y manteniendo sistemas para salud, comercio y sector público, enfocado en seguridad de aplicaciones. Reviso arquitecturas y flujos de datos con modelado de amenazas, diseño controles de acceso (RBAC, Row Level Security deny-by-default), aplico criptografía (AES-256-GCM por tenant, gestión de secretos) e integro SAST y SCA como gates bloqueantes en CI (CodeQL, Semgrep, audit-ci). Cursando la Especialización en Seguridad de la Información. Inglés C1.

== Experiencia

#regular-entry(
  [
    #strong[I.P.S. San José], Ingeniero de Software (contrato por proyecto) | Villagarzón, Putumayo, Colombia

  ],
  [
    Sep 2026 a Nov 2026

  ],
  main-column-second-row: [
    - Desarrollé y mantuve los sistemas de información de una institución prestadora de servicios de salud, incluida la administración de sus bases de datos.

    - Construí un gestor de inventario y automatizaciones de procesos internos.

    - Inicié un visor de imágenes médicas DICOM, orientado a reconstrucción multiplanar 2D\/3D, fusión PET-CT y conexión como cliente PACS.

  ],
)

#regular-entry(
  [
    #strong[Alcaldía de Pasto], Practicante de Ingeniería de Software Full-Stack | Pasto, Colombia

  ],
  [
    Oct 2025 a Dic 2025

  ],
  main-column-second-row: [
    - Entregué de punta a punta el sistema de gestión de mantenimientos de una entidad pública (interfaz, backend y modelo de datos), operativo en los 3 meses de la práctica.

    - Mitigué inyección SQL y XSS (OWASP Top 10) con consultas parametrizadas, sanitización del lado del servidor y RBAC, en un sistema con información de una entidad pública.

    - Optimicé la capa de acceso a datos y las consultas de las pantallas más usadas cuando los tiempos de respuesta se volvieron el cuello de botella.

  ],
)

#regular-entry(
  [
    #strong[ElevaForge], Cofundador e Ingeniero de Software | Remoto

  ],
  [
    Jun 2025 a la actualidad

  ],
  main-column-second-row: [
    - Cofundé un estudio de software de 3 ingenieros y asumí las decisiones de arquitectura, registradas en ADRs versionados con sus alternativas descartadas.

    - Diseñé la autorización deny-by-default: Row Level Security activa y sin políticas para anon ni authenticated, con todo el acceso a datos pasando por el servidor.

    - Dirigí la migración del sitio corporativo de Angular a Next.js 14 y construí elevaforge.com y los demos KOA (landing y tienda) con un panel de administración multi-cuenta.

    - Configuré la CI del sitio con escaneo de secretos (gitleaks), lint, typecheck, tests, build y e2e en cada push; en los demos KOA, CodeQL, audit-ci y Lighthouse CI (landing) y CodeQL y npm audit (tienda).

  ],
)

#regular-entry(
  [
    #strong[Estación de Servicio Kennedy y clientes freelance], Contratista independiente de software y TI | Pasto, Colombia y remoto

  ],
  [
    Mar 2023 a la actualidad

  ],
  main-column-second-row: [
    - Realicé evaluaciones de seguridad de la información para más de 10 clínicas privadas y pymes, a través de firmas de outsourcing: control de acceso, trazabilidad y custodia de datos.

    - Estación de Servicio Kennedy (Mar 2023 a Mar 2026): desarrollé y mantuve sus sistemas, administré las bases de datos y optimicé el control de inventario y ventas.

    - Freelance a medio tiempo, en paralelo a la carrera: frontend, backend y automatización; migraciones de datos a SAP y Oracle NetSuite, CRM (Salesforce, HubSpot) y reportes con Odoo, Python y PostgreSQL.

  ],
)

== Proyectos de seguridad

  #regular-entry(
  [
    #strong[CareLink, plataforma clínica multi-tenant] | github.com\/Luisceron0\/CareLink

  ],
  [
  ],
  main-column-second-row: [
    #summary[Historia clínica, triage y coordinación entre especialistas para varias instituciones sobre una misma base de datos. Implementación de referencia.]

    - Apliqué cifrado AES-256-GCM con clave derivada por institución y supresión, dentro de la consulta, de agregados con menos de 5 pacientes distintos, contra la re-identificación.

    - Bloqueé la edición de registros firmados con un trigger de PostgreSQL y revalidé el acceso de cada especialista en cada petición, verificado con tests de integración contra PostgreSQL real.

  ],
)

  #regular-entry(
  [
    #strong[Tributary, facturación electrónica multirrégimen] | github.com\/Luisceron0\/Tributary

  ],
  [
  ],
  main-column-second-row: [
    #summary[Facturación electrónica para ventas transfronterizas entre Colombia, España y Alemania. Implementación de referencia, no certificada para producción.]

    - Garanticé la inmutabilidad fiscal con triggers de PostgreSQL y una cadena de hashes SHA-256 cuyo verificador señala el registro alterado.

    - Definí 13 controles de seguridad con criterio binario de verificación y 4 gates independientes en CI; el quickstart levanta todo el stack en menos de 3 minutos.

  ],
)

  #regular-entry(
  [
    #strong[KOA, landing y tienda bilingüe de demostración] | koa.elevaforge.com

  ],
  [
  ],
  main-column-second-row: [
    #summary[Lista de espera pública y tienda con checkout simulado, sin pagos reales.]

    - Recalculé los precios en el servidor contra el catálogo, ignorando cualquier precio o total enviado por el navegador.

    - Protegí el formulario público con Turnstile verificado en el servidor, confirmación por correo y límite de solicitudes por IP.

  ],
)

== Educación

#education-entry(
  [
    #strong[Politécnico Grancolombiano], Especialización en Seguridad de la Información | Colombia

  ],
  [
    Ene 2026 a la actualidad

  ],
  main-column-second-row: [
    - En curso, finalización estimada en 2027.

  ],
)

#education-entry(
  [
    #strong[Universidad Cooperativa de Colombia], Ingeniería de Software | Pasto, Colombia

  ],
  [
    Feb 2022 a Dic 2025

  ],
  main-column-second-row: [
    - Proyecto de grado: API REST con apoyo de IA, autenticación JWT y gestión segura de secretos.

    - Cursos relevantes: Arquitectura de Software, Sistemas Distribuidos, Seguridad Informática, Sistemas de Inteligencia Artificial.

  ],
)

== Certificaciones

Ciberseguridad, MinTIC Colombia (Sep 2024)

Network Security, Cisco (Dic 2024)

== Habilidades

#strong[Seguridad:] Modelado de amenazas, OWASP Top 10, RBAC, Row Level Security, JWT (RS256), Criptografía aplicada (AES-256-GCM), Gestión de secretos, SAST (CodeQL, Semgrep), SCA (audit-ci, npm audit, Trivy), Escaneo de secretos (gitleaks), Seguridad de redes

#strong[Arquitectura:] Aislamiento multi-tenant, ADRs, Arquitectura hexagonal, Separación por capas, Diseño de APIs REST, Modelado de datos, Diseño de sistemas escalables

#strong[Backend:] Java, Spring Boot, Python, TypeScript

#strong[Frontend:] React, Next.js, Angular, Vue.js, Astro, JavaScript, Tailwind CSS, HTML5, CSS3

#strong[Cloud y DevOps:] Docker, GitHub Actions (CI\/CD), AWS (EC2, S3), Vercel, Git

#strong[Bases de datos:] PostgreSQL, MySQL, MongoDB, Migraciones versionadas (Flyway)

== Idiomas

#strong[Español:] Nativo

#strong[Inglés:] C1 (EF SET)
