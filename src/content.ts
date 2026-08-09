/**
 * Contenido del sitio. Fuente única de verdad, en español e inglés.
 *
 * Regla 2 de .github/copilot-instructions.md: el dueño edita ESTE archivo, no
 * va a buscar strings dentro de los componentes. Ningún componente puede
 * contener copy visible al usuario.
 *
 * Regla 3: ninguna afirmación sin enlace que la respalde. Si un dato todavía no
 * se puede respaldar, se escribe como `[PENDIENTE: ...]` y nunca se inventa.
 * `scripts/check-pending.mjs` falla si queda alguno antes de un despliegue.
 *
 * RF-109: cada texto visible es un `Localized`, es decir, un objeto con `es` y
 * `en` obligatorios. Olvidar una traducción es un error de tipo en tiempo de
 * compilación, no un hueco silencioso que se descubre en producción.
 *
 * FUENTES DE ESTE ARCHIVO (nada aquí es inventado):
 *  - Perfil, trayectoria, educación, certificaciones y habilidades: el YAML de
 *    RenderCV del dueño (RF-106/107). Si el CV cambia, este archivo cambia.
 *  - Proyectos: los README públicos de cada repo y las URLs en vivo, todas
 *    verificadas con HTTP 200 antes de escribirlas aquí (RF-102).
 *
 * NOTA DE ESTILO: no se usan rayas largas en el copy visible. Se prefieren
 * comas, dos puntos o paréntesis.
 */

// ---------------------------------------------------------------------------
// Idioma
// ---------------------------------------------------------------------------

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** Idioma por defecto (D-06 de la SRS del portafolio: español primero). */
export const DEFAULT_LOCALE: Locale = 'es'

/** Un texto visible. Ambos idiomas son obligatorios: falta uno, no compila. */
export type Localized = Readonly<Record<Locale, string>>

/** Una lista de textos visibles, en ambos idiomas. */
export type LocalizedList = Readonly<Record<Locale, readonly string[]>>

/**
 * Normaliza cualquier valor de entrada a un idioma soportado.
 * Un `?lang=` desconocido, vacío o manipulado cae al idioma por defecto: nunca
 * produce una página en blanco (criterio de aceptación de RF-109).
 */
export function toLocale(value: unknown): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE
}

/** Etiqueta del atributo `lang` del documento, por idioma. */
export const HTML_LANG: Readonly<Record<Locale, string>> = {
  es: 'es',
  en: 'en',
}

// ---------------------------------------------------------------------------
// Mecanismo [PENDIENTE]
// ---------------------------------------------------------------------------

/** Marca de dato aún no aportado por el dueño. Convención del glosario de la SRS. */
export type Pending = `[PENDIENTE: ${string}]`

/** Un valor que puede estar todavía sin resolver. */
export type MaybePending<T extends string = string> = T | Pending

export function isPending(value: string | null | undefined): value is Pending {
  return typeof value === 'string' && value.startsWith('[PENDIENTE:')
}

/**
 * Devuelve el valor solo si está resuelto. Los componentes usan esto para NO
 * renderizar un enlace roto ni una afirmación sin respaldo.
 */
export function resolved(value: string | null | undefined): string | null {
  return typeof value === 'string' && value.length > 0 && !isPending(value) ? value : null
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface ExternalLink {
  /** Texto del enlace. Regla 4: nombra el recurso exacto, nunca "Ver más". */
  label: Localized
  /**
   * Destino. Puede ser un solo valor, o uno por idioma cuando existe de verdad
   * una versión localizada (verificada con HTTP 200, no supuesta).
   */
  href: MaybePending | Readonly<Record<Locale, MaybePending>>
}

/** Resuelve el destino de un enlace para un idioma concreto. */
export function linkHref(link: ExternalLink, locale: Locale): MaybePending {
  return typeof link.href === 'string' ? link.href : link.href[locale]
}

export interface ProjectImage {
  src: MaybePending
  /** Texto alternativo descriptivo. Requisito de accesibilidad WCAG AA. */
  alt: Localized
}

export interface Project {
  id: string
  /** Nombre propio del proyecto: no se traduce. */
  name: string
  kicker: Localized
  /** Qué problema resuelve, en lenguaje llano. Criterio RF-102. */
  problem: Localized
  /** Stack técnico real, como chips. Son nombres propios: no se traducen. */
  stack: readonly string[]
  /** Ángulo de seguridad o de ingeniería. Criterio RF-102. */
  security: Localized
  /** Detalles técnicos verificables, en viñetas. */
  highlights: LocalizedList
  screenshot: ProjectImage
  links: readonly ExternalLink[]
}

export interface TimelineEntry {
  id: string
  kind: 'trabajo' | 'estudio'
  title: Localized
  /** Nombre de la organización: no se traduce. */
  organization: string
  location: Localized
  period: Localized
  highlights: LocalizedList
}

export interface SkillGroup {
  label: Localized
  /** Nombres de tecnologías: no se traducen, salvo los idiomas. */
  items: LocalizedList
}

export interface CvDownload {
  language: Locale
  /** Etiqueta explícita del idioma: RF-103 prohíbe adivinar el del visitante. */
  label: Localized
  href: MaybePending
  fileName: string
}

export interface NavItem {
  label: Localized
  href: string
}

// ---------------------------------------------------------------------------
// Sitio
// ---------------------------------------------------------------------------

export const site = {
  /**
   * Dominio propio. T-104: cualquier URL absoluta del servidor sale de aquí,
   * JAMÁS del header `Host`. Mientras esté [PENDIENTE], `metadataBase` queda
   * sin definir en lugar de inventarse un dominio.
   */
  url: '[PENDIENTE: dominio propio, pendiente de registrar]' as MaybePending,
  title: {
    es: 'Luis Alejandro Cerón Muñoz, Ingeniero de Software Full-Stack',
    en: 'Luis Alejandro Cerón Muñoz, Full-Stack Software Engineer',
  } satisfies Localized,
  description: {
    es: 'Ingeniero de software full-stack. Construyo aplicaciones web completas y las diseño para que sean seguras desde el primer día.',
    en: 'Full-stack software engineer. I build complete web applications and design them to be secure from day one.',
  } satisfies Localized,
} as const

/** RF-108/109: navegación interna y selector de idioma. */
export const nav = {
  brand: 'LC',
  items: [
    { label: { es: 'Perfil', en: 'Profile' }, href: '#perfil' },
    { label: { es: 'Trayectoria', en: 'Career' }, href: '#trayectoria' },
    { label: { es: 'Proyectos', en: 'Projects' }, href: '#proyectos' },
    { label: { es: 'Habilidades', en: 'Skills' }, href: '#habilidades' },
    { label: { es: 'Contacto', en: 'Contact' }, href: '#contacto' },
  ] satisfies readonly NavItem[],
  language: {
    /** Etiqueta accesible del grupo de botones de idioma. */
    label: { es: 'Idioma', en: 'Language' } satisfies Localized,
    /** Texto alternativo que anuncia a dónde lleva cada opción. */
    switchTo: {
      es: 'Ver esta página en español',
      en: 'View this page in English',
    } satisfies Localized,
  },
} as const

// ---------------------------------------------------------------------------
// RF-101 — Hero
// ---------------------------------------------------------------------------

export const hero = {
  /** Nombre propio: idéntico en ambos idiomas. */
  name: 'Luis Alejandro Cerón Muñoz',
  role: {
    es: 'Ingeniero de Software Full-Stack',
    en: 'Full-Stack Software Engineer',
  } satisfies Localized,
  /**
   * RF-101: máximo dos frases, legibles sin hacer scroll en 375 px.
   * Sin jerga que obligue a buscar un término.
   *
   * La longitud NO es libre: e2e/landing.spec.ts mide que el hero completo
   * entre en 375x667. Si alargas esto, ese test falla. Es intencionado.
   */
  pitch: {
    es: 'Construyo aplicaciones web completas y las diseño desde el principio para que resistan a quien intente romperlas. Entrego producto que funciona, sin dejarte un problema de seguridad detrás.',
    en: 'I build complete web applications and design them from the start to hold up against anyone trying to break them. I deliver working product, without leaving a security problem behind.',
  } satisfies Localized,
  location: {
    es: 'Pasto, Nariño, Colombia',
    en: 'Pasto, Nariño, Colombia',
  } satisfies Localized,
  availability: {
    es: 'Disponible para relocalización',
    en: 'Open to relocation',
  } satisfies Localized,
  /** RF-105: visible sin pasar del hero. Enlace al perfil, no a un repo suelto. */
  githubLink: {
    label: { es: 'Ver mi perfil de GitHub', en: 'View my GitHub profile' },
    href: 'https://github.com/Luisceron0',
  } satisfies ExternalLink,
  contactCta: {
    label: { es: 'Escríbeme', en: 'Get in touch' },
    /** Ancla interna a la sección de contacto. Una sola página (regla 1). */
    href: '#contacto',
  } satisfies ExternalLink,
} as const

// ---------------------------------------------------------------------------
// RF-106 — Perfil profesional
// ---------------------------------------------------------------------------

export const profile = {
  heading: { es: 'Perfil', en: 'Profile' } satisfies Localized,
  /** Texto del CV, sin reescribir: si el CV cambia, esto cambia. */
  summary: {
    es: 'Ingeniero de Software Full-Stack con experiencia en desarrollo de aplicaciones web escalables (React, Vue, Spring Boot, Django), integración de protocolos de seguridad (RBAC, JWT) y despliegue en la nube (AWS, Docker). Egresado de la Universidad Cooperativa de Colombia, actualmente cursando una especialización en Seguridad de la Información en el Politécnico Grancolombiano. Bilingüe (inglés C1), con disponibilidad para relocalización.',
    en: 'Full-Stack Software Engineer with experience building scalable web applications (React, Vue, Spring Boot, Django), integrating security protocols (RBAC, JWT) and deploying to the cloud (AWS, Docker). Graduate of Universidad Cooperativa de Colombia, currently studying a postgraduate specialization in Information Security at Politécnico Grancolombiano. Bilingual (English C1), open to relocation.',
  } satisfies Localized,
  facts: [
    {
      label: { es: 'Ubicación', en: 'Location' },
      value: { es: 'Pasto, Nariño, Colombia', en: 'Pasto, Nariño, Colombia' },
    },
    {
      label: { es: 'Correo', en: 'Email' },
      value: { es: 'luiscerontrabajos@gmail.com', en: 'luiscerontrabajos@gmail.com' },
    },
    {
      label: { es: 'Formación', en: 'Education' },
      value: {
        es: 'Ing. de Software, Esp. en Seguridad de la Información (en curso)',
        en: 'Software Engineering, Information Security specialization (in progress)',
      },
    },
    {
      label: { es: 'Idiomas', en: 'Languages' },
      value: {
        es: 'Español nativo, inglés C1 (EF SET)',
        en: 'Native Spanish, English C1 (EF SET)',
      },
    },
  ],
  links: [
    {
      label: { es: 'LinkedIn: luis-ceronmunoz', en: 'LinkedIn: luis-ceronmunoz' },
      href: 'https://www.linkedin.com/in/luis-ceronmunoz',
    },
    {
      label: { es: 'GitHub: Luisceron0', en: 'GitHub: Luisceron0' },
      href: 'https://github.com/Luisceron0',
    },
  ] satisfies readonly ExternalLink[],
} as const

// ---------------------------------------------------------------------------
// RF-106 — Trayectoria (más reciente primero)
// ---------------------------------------------------------------------------

export const timeline = {
  heading: { es: 'Trayectoria', en: 'Career' } satisfies Localized,
  intro: {
    es: 'Experiencia y formación, en orden cronológico inverso. Todo lo de aquí sale del mismo CV que puedes descargar más abajo.',
    en: 'Experience and education, most recent first. Everything here comes from the same CV you can download below.',
  } satisfies Localized,
  /** Etiquetas de tipo de entrada. */
  kinds: {
    trabajo: { es: 'Trabajo', en: 'Work' } satisfies Localized,
    estudio: { es: 'Estudio', en: 'Education' } satisfies Localized,
  },
  entries: [
    {
      id: 'especializacion',
      kind: 'estudio',
      title: {
        es: 'Especialización en Seguridad de la Información',
        en: 'Postgraduate Specialization in Information Security',
      },
      organization: 'Politécnico Grancolombiano',
      location: { es: 'Colombia', en: 'Colombia' },
      period: { es: 'Ene 2026, en curso', en: 'Jan 2026, in progress' },
      highlights: {
        es: ['En curso. Finalización estimada: 2027.'],
        en: ['In progress. Estimated completion: 2027.'],
      },
    },
    {
      id: 'alcaldia',
      kind: 'trabajo',
      title: {
        es: 'Practicante de Ingeniería de Software Full-Stack',
        en: 'Full-Stack Software Engineering Intern',
      },
      organization: 'Alcaldía de Pasto',
      location: { es: 'Pasto, Colombia', en: 'Pasto, Colombia' },
      period: { es: 'Oct 2025 a Dic 2025', en: 'Oct 2025 to Dec 2025' },
      highlights: {
        es: [
          'Desarrollé un sistema full-stack de gestión de mantenimientos para una entidad pública, construyendo la interfaz de usuario y la lógica backend.',
          'Implementé Control de Acceso Basado en Roles (RBAC) y sanitización de entradas para prevenir inyecciones SQL y ataques XSS.',
          'Optimicé consultas de base de datos y arquitectura backend para mejorar los tiempos de respuesta del sistema.',
        ],
        en: [
          'Built a full-stack maintenance management system for a public sector entity, covering both the user interface and the backend logic.',
          'Implemented Role-Based Access Control (RBAC) and input sanitisation to prevent SQL injection and XSS attacks.',
          'Optimised database queries and backend architecture to improve system response times.',
        ],
      },
    },
    {
      id: 'universidad',
      kind: 'estudio',
      title: { es: 'Ingeniería de Software', en: 'Software Engineering' },
      organization: 'Universidad Cooperativa de Colombia',
      location: { es: 'Pasto, Colombia', en: 'Pasto, Colombia' },
      period: { es: 'Feb 2022 a Dic 2025', en: 'Feb 2022 to Dec 2025' },
      highlights: {
        es: [
          'Proyecto de grado: API REST para gestión de espacios físicos utilizando IA, con autenticación JWT y gestión segura de secretos.',
          'Cursos relevantes: Arquitectura de Sistemas Escalables, Desarrollo Back-End, Metodologías Ágiles (Scrum), Ciberseguridad, Seguridad de Redes.',
        ],
        en: [
          'Final degree project: REST API for physical space management using AI, with JWT authentication and secure secret handling.',
          'Relevant coursework: Scalable Systems Architecture, Back-End Development, Agile Methodologies (Scrum), Cybersecurity, Network Security.',
        ],
      },
    },
    {
      id: 'freelance',
      kind: 'trabajo',
      title: {
        es: 'Desarrollador de Software Full-Stack',
        en: 'Full-Stack Software Developer',
      },
      organization: 'Freelance',
      location: { es: 'Remoto', en: 'Remote' },
      period: { es: 'Mar 2023 a la actualidad', en: 'Mar 2023 to present' },
      highlights: {
        es: [
          'Trabajo desarrollado en modalidad de medio tiempo, en paralelo a la carrera universitaria y, posteriormente, a la práctica en la Alcaldía de Pasto.',
          'Ejecución de migraciones de datos hacia SAP y Oracle NetSuite, aplicando cifrado y respaldo de información.',
          'Implementación de soluciones CRM personalizadas (Salesforce, HubSpot) para negocios de e-commerce, incluyendo configuración de controles de acceso.',
          'Desarrollo de sistemas de reportes automatizados con Odoo, Python y PostgreSQL para procesamiento de datos en tiempo real.',
        ],
        en: [
          'Part-time work carried out alongside my degree and, later, alongside the internship at Alcaldía de Pasto.',
          'Data migrations to SAP and Oracle NetSuite, applying encryption and information backup.',
          'Custom CRM implementations (Salesforce, HubSpot) for e-commerce businesses, including access control configuration.',
          'Automated reporting systems built with Odoo, Python and PostgreSQL for real time data processing.',
        ],
      },
    },
  ] satisfies readonly TimelineEntry[],
} as const

// ---------------------------------------------------------------------------
// RF-102 — Proyectos (4)
// ---------------------------------------------------------------------------

export const projectsSection = {
  heading: { es: 'Proyectos', en: 'Projects' } satisfies Localized,
  intro: {
    es: 'Cuatro sistemas que construí de principio a fin. Cada uno enlaza a su código y, cuando existe, al sitio en vivo: nada de lo que afirmo aquí queda sin respaldo.',
    en: 'Four systems I built end to end. Each one links to its code and, where it exists, to the live site: nothing I claim here is left unbacked.',
  } satisfies Localized,
  /** Etiquetas reutilizadas dentro de cada tarjeta. */
  labels: {
    technologies: { es: 'Tecnologías', en: 'Technologies' } satisfies Localized,
    securityAngle: {
      es: 'El ángulo de seguridad',
      en: 'The security angle',
    } satisfies Localized,
    newTab: {
      es: ' (se abre en una pestaña nueva)',
      en: ' (opens in a new tab)',
    } satisfies Localized,
  },
} as const

export const projects: readonly Project[] = [
  {
    id: 'carelink',
    name: 'CareLink',
    kicker: {
      es: 'Plataforma clínica multi-tenant, implementación de referencia',
      en: 'Multi-tenant clinical platform, reference implementation',
    },
    // Fuente: README de github.com/Luisceron0/CareLink (repo público).
    problem: {
      es: 'Un hospital necesita llevar historia clínica, triage y coordinación entre médicos sin que nadie, ni siquiera un administrador, pueda alterar un registro después de firmado, ni ver el historial de un paciente que no le corresponde.',
      en: 'A hospital needs to keep clinical records, triage and coordination between doctors without anyone, not even an administrator, being able to alter a record once signed, or see the history of a patient outside their care.',
    },
    stack: ['Java', 'Spring Boot', 'PostgreSQL 16', 'React 18', 'Vite', 'Docker', 'Flyway'],
    security: {
      es: 'Un encuentro clínico firmado es inmutable a nivel de trigger de PostgreSQL: ni la aplicación ni un acceso directo a la base pueden editarlo. La captura muestra el intento de edición rechazado con 409.',
      en: 'A signed clinical encounter is immutable at the PostgreSQL trigger level: neither the application nor direct database access can edit it. The screenshot shows the edit attempt rejected with a 409.',
    },
    highlights: {
      es: [
        'Aislamiento por schema-per-tenant, con filtro por servicio dentro del WHERE de la consulta, no sobre filas ya traídas.',
        'El acceso de un especialista vía interconsulta se revalida en cada request: el mismo JWT pasa de 200 a 403 al cerrarse, sin volver a iniciar sesión.',
        'El motor de conocimiento suprime resultados con menos de 5 pacientes distintos, dentro de la propia query, para evitar la re-identificación.',
        'Cifrado de PHI con AES-256-GCM, IV aleatorio por operación y clave derivada por tenant.',
        'Auditoría de seguridad de extremo a extremo: reglas Semgrep propias validadas contra código deliberadamente vulnerable, sqlmap contra la instancia real, y un hallazgo de severidad alta corregido con evidencia.',
      ],
      en: [
        'Schema-per-tenant isolation, with the service filter inside the query WHERE clause, not applied to rows already fetched.',
        'A specialist’s access through a referral is revalidated on every request: the same JWT goes from 200 to 403 once it closes, with no re-login.',
        'The knowledge engine suppresses results with fewer than 5 distinct patients, inside the query itself, to prevent re-identification.',
        'PHI encrypted with AES-256-GCM, a random IV per operation and a key derived per tenant.',
        'End to end security audit: custom Semgrep rules validated against deliberately vulnerable code, sqlmap against the real instance, and one high severity finding fixed with evidence.',
      ],
    },
    screenshot: {
      // Descargada del repo público de CareLink (asset público, no se tocó el repo).
      src: '/proyectos/carelink.png',
      alt: {
        es: 'Pantalla de CareLink mostrando el intento de editar un encuentro clínico ya firmado, rechazado con un error 409 por un trigger de la base de datos.',
        en: 'CareLink screen showing an attempt to edit an already signed clinical encounter, rejected with a 409 error by a database trigger.',
      },
    },
    links: [
      {
        label: {
          es: 'Ver las capturas del sistema',
          en: 'See the system screenshots',
        },
        href: 'https://github.com/Luisceron0/CareLink/blob/main/docs/portfolio/SCREENSHOTS.md',
      },
      {
        label: { es: 'Código en GitHub', en: 'Code on GitHub' },
        href: 'https://github.com/Luisceron0/CareLink',
      },
    ],
  },
  {
    id: 'elevaforge',
    name: 'ElevaForge',
    kicker: {
      es: 'Agencia de software, sitio corporativo con panel de administración',
      en: 'Software agency, corporate site with an admin panel',
    },
    // Fuente: README de github.com/Luisceron0/ElevaForge y el sitio en vivo.
    problem: {
      es: 'Una agencia de software necesita captar clientes potenciales y poder editar el contenido de su propio sitio (paquetes, proyectos, equipo) sin llamar a un desarrollador cada vez.',
      en: 'A software agency needs to capture leads and edit its own site content (packages, projects, team) without calling a developer every time.',
    },
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel'],
    security: {
      es: 'Las tablas de Supabase tienen Row Level Security activado y deny-by-default: ninguna tiene policies para usuarios anónimos o autenticados, a propósito. Todo el acceso pasa por el servidor, nunca por la clave pública del navegador.',
      en: 'The Supabase tables have Row Level Security enabled and deny-by-default: none of them has policies for anonymous or authenticated users, deliberately. All access goes through the server, never through the browser’s public key.',
    },
    highlights: {
      es: [
        'Panel de administración con múltiples cuentas, altas y bajas gestionadas desde la propia interfaz.',
        'La semilla de sesión del panel es un secreto propio y dedicado; el arranque avisa si quedan credenciales legacy activas.',
        'Contenido editable desde el panel: paquetes, proyectos y sección de equipo, sin tocar código.',
        'Bandeja de leads de contacto y diagnóstico, con estado revisable desde el panel.',
      ],
      en: [
        'Admin panel with multiple accounts, created and deactivated from the interface itself.',
        'The panel’s session seed is its own dedicated secret; startup warns if legacy credentials are still active.',
        'Content editable from the panel: packages, projects and the team section, without touching code.',
        'Inbox of contact and diagnostic leads, with status reviewable from the panel.',
      ],
    },
    screenshot: {
      src: '/proyectos/elevaforge.png',
      alt: {
        es: 'Página de inicio de ElevaForge con el titular "Forjamos el motor digital de tu empresa".',
        en: 'ElevaForge home page with the headline "Forjamos el motor digital de tu empresa".',
      },
    },
    links: [
      {
        label: { es: 'Ver elevaforge.com', en: 'Visit elevaforge.com' },
        href: 'https://www.elevaforge.com',
      },
      {
        label: { es: 'Código en GitHub', en: 'Code on GitHub' },
        href: 'https://github.com/Luisceron0/ElevaForge',
      },
    ],
  },
  {
    id: 'koa-landing',
    name: 'KOA Landing',
    kicker: {
      es: 'Lanzamiento de producto, captación de lista de espera',
      en: 'Product launch, waitlist capture',
    },
    // Fuente: README de github.com/luisCeron0Portfolio/koa-landing y el sitio en vivo.
    problem: {
      es: 'Captar la lista de espera de un lanzamiento de producto sin que el formulario se convierta en una puerta abierta para spam ni en un ataque de fuerza bruta contra la bandeja de correo.',
      en: 'Capture the waitlist for a product launch without the form becoming an open door for spam or a brute force attack against the inbox.',
    },
    stack: ['Astro 7', 'React', 'TypeScript', 'Neon Postgres', 'Resend', 'Upstash', 'Turnstile'],
    security: {
      es: 'El envío se bloquea hasta que Cloudflare Turnstile confirma que no es un bot: el mismo patrón fail-closed que reutilicé en el formulario de este sitio, después de corregir una condición de carrera real.',
      en: 'Submission is blocked until Cloudflare Turnstile confirms it is not a bot: the same fail-closed pattern I reused in this site’s contact form, after fixing a real race condition.',
    },
    highlights: {
      es: [
        'Validación en servidor y flujo de confirmación por token antes de dar por buena una suscripción.',
        'Límite de envíos por IP con Upstash: la IP se almacena con hash, nunca en claro.',
        'Contenido de las secciones gestionado desde un CMS, editable sin desplegar.',
        'Cobertura con tests unitarios (Vitest) y de extremo a extremo (Playwright), incluidos los caminos de bot y de límite de envíos.',
      ],
      en: [
        'Server-side validation and a token confirmation flow before a subscription counts as valid.',
        'Per-IP rate limiting with Upstash: the IP is stored hashed, never in plain text.',
        'Section content managed from a CMS, editable without a deploy.',
        'Covered by unit tests (Vitest) and end to end tests (Playwright), including the bot and rate limit paths.',
      ],
    },
    screenshot: {
      src: '/proyectos/koa-landing.png',
      alt: {
        es: 'Página de inicio de KOA Landing, con el producto KOA Buds y el llamado a unirse a la lista de espera.',
        en: 'KOA Landing home page, showing the KOA Buds product and the call to join the waitlist.',
      },
    },
    links: [
      {
        label: { es: 'Ver koa.elevaforge.com', en: 'Visit koa.elevaforge.com' },
        // Este sitio no tiene versión en inglés: /en devuelve 404, comprobado.
        href: 'https://koa.elevaforge.com/',
      },
      {
        label: { es: 'Código en GitHub', en: 'Code on GitHub' },
        href: 'https://github.com/luisCeron0Portfolio/koa-landing',
      },
    ],
  },
  {
    id: 'koa-store',
    name: 'KOA Store',
    kicker: {
      es: 'Tienda de producto, catálogo bilingüe y simulación de compra',
      en: 'Product store, bilingual catalogue and checkout simulation',
    },
    // Fuente: README de github.com/luisCeron0Portfolio/koa-store y el sitio en vivo.
    problem: {
      es: 'Mostrar un catálogo de producto completo, en dos idiomas, con un flujo de compra realista de principio a fin, pero sin procesar pagos reales ni retener datos de nadie.',
      en: 'Show a complete product catalogue, in two languages, with a realistic end to end purchase flow, but without processing real payments or retaining anyone’s data.',
    },
    stack: ['Astro', 'TypeScript', 'Content Collections', 'PostgreSQL', 'Vitest', 'Vercel'],
    security: {
      es: 'El precio se valida en el servidor, no se confía en lo que llega del carrito. El carrito es anónimo y de sesión, y la tienda incluye una vía explícita de borrado de datos.',
      en: 'Prices are validated on the server, never trusting what arrives from the cart. The cart is anonymous and session based, and the store includes an explicit data erasure path.',
    },
    highlights: {
      es: [
        'Catálogo bilingüe (español e inglés) con páginas de producto y selección de variantes.',
        'Simulación de checkout con validación de precios en servidor: no se procesa ningún pago real.',
        'SEO completo: sitemap, robots.txt, datos estructurados JSON-LD y metadatos por página.',
        'Cabeceras de seguridad y CSP gestionadas para el despliegue en Vercel.',
      ],
      en: [
        'Bilingual catalogue (Spanish and English) with product pages and variant selection.',
        'Checkout simulation with server-side price validation: no real payment is processed.',
        'Full SEO: sitemap, robots.txt, JSON-LD structured data and per-page metadata.',
        'Security headers and CSP managed for the Vercel deployment.',
      ],
    },
    screenshot: {
      src: '/proyectos/koa-store.png',
      alt: {
        es: 'Tienda KOA con el titular "Seis productos. Ninguno de más." y el selector de idioma español e inglés.',
        en: 'KOA store with the headline "Seis productos. Ninguno de más." and the Spanish/English language switcher.',
      },
    },
    links: [
      {
        label: {
          es: 'Ver store.koa.elevaforge.com',
          en: 'Visit store.koa.elevaforge.com',
        },
        /*
         * Único enlace localizado del sitio: esta tienda SÍ tiene versión en
         * inglés (comprobado, /en devuelve 200). Los otros dos proyectos
         * devuelven 404 en /en, así que su enlace no se localiza.
         */
        href: {
          es: 'https://store.koa.elevaforge.com/es',
          en: 'https://store.koa.elevaforge.com/en',
        },
      },
      {
        label: { es: 'Código en GitHub', en: 'Code on GitHub' },
        href: 'https://github.com/luisCeron0Portfolio/koa-store',
      },
    ],
  },
] as const

// ---------------------------------------------------------------------------
// RF-107 — Habilidades
// ---------------------------------------------------------------------------

export const skills = {
  heading: { es: 'Habilidades', en: 'Skills' } satisfies Localized,
  intro: {
    es: 'Las tecnologías con las que trabajo, agrupadas como aparecen en mi CV.',
    en: 'The technologies I work with, grouped as they appear in my CV.',
  } satisfies Localized,
  groups: [
    {
      label: { es: 'Desarrollo', en: 'Development' },
      items: {
        es: [
          'React',
          'Vue.js',
          'Angular',
          'Spring Boot',
          'Django',
          'JavaScript',
          'TypeScript',
          'Java',
          'Python',
          'C#',
        ],
        en: [
          'React',
          'Vue.js',
          'Angular',
          'Spring Boot',
          'Django',
          'JavaScript',
          'TypeScript',
          'Java',
          'Python',
          'C#',
        ],
      },
    },
    {
      label: { es: 'Seguridad y DevOps', en: 'Security and DevOps' },
      items: {
        es: [
          'RBAC',
          'JWT',
          'Prácticas de código seguro',
          'Docker',
          'AWS (EC2, S3)',
          'CI/CD',
          'Seguridad de redes',
        ],
        en: [
          'RBAC',
          'JWT',
          'Secure coding practices',
          'Docker',
          'AWS (EC2, S3)',
          'CI/CD',
          'Network security',
        ],
      },
    },
    {
      label: { es: 'Bases de datos', en: 'Databases' },
      items: {
        es: ['PostgreSQL', 'MySQL', 'MongoDB'],
        en: ['PostgreSQL', 'MySQL', 'MongoDB'],
      },
    },
    {
      label: { es: 'Idiomas', en: 'Languages' },
      items: {
        es: ['Español (nativo)', 'Inglés (C1, EF SET Certified)'],
        en: ['Spanish (native)', 'English (C1, EF SET Certified)'],
      },
    },
  ] satisfies readonly SkillGroup[],
  certificationsHeading: {
    es: 'Certificaciones',
    en: 'Certifications',
  } satisfies Localized,
  certifications: {
    es: [
      'Ciberseguridad, MinTIC Colombia (Sept 2024)',
      'Network Security, Cisco (Dic 2024)',
      'Desarrollo de Software Ágil y Scrum, IBM (Ene 2025)',
      'Building Scalable Systems, IBM (Feb 2025)',
      'Introduction to Back-End Development, Meta (Feb 2025)',
      'Certificaciones en IA y Productividad, Microsoft y LinkedIn (Feb 2025)',
    ],
    en: [
      'Cybersecurity, MinTIC Colombia (Sept 2024)',
      'Network Security, Cisco (Dec 2024)',
      'Agile Software Development and Scrum, IBM (Jan 2025)',
      'Building Scalable Systems, IBM (Feb 2025)',
      'Introduction to Back-End Development, Meta (Feb 2025)',
      'AI and Productivity certifications, Microsoft and LinkedIn (Feb 2025)',
    ],
  } satisfies LocalizedList,
} as const

// ---------------------------------------------------------------------------
// RF-103 — CV
// ---------------------------------------------------------------------------

export const cv = {
  heading: { es: 'Descarga mi CV', en: 'Download my CV' } satisfies Localized,
  intro: {
    es: 'El mismo contenido de esta página, en un PDF que puedes guardar o reenviar.',
    en: 'The same content as this page, in a PDF you can save or forward.',
  } satisfies Localized,
  /** RF-103: los dos idiomas etiquetados de forma explícita, sin autodetección. */
  downloads: [
    {
      language: 'es',
      label: { es: 'CV en español (PDF)', en: 'CV in Spanish (PDF)' },
      href: '[PENDIENTE: añadir /cv/luis-ceron-cv-es.pdf generado con RenderCV]',
      fileName: 'luis-ceron-cv-es.pdf',
    },
    {
      language: 'en',
      label: { es: 'CV en inglés (PDF)', en: 'CV in English (PDF)' },
      href: '[PENDIENTE: añadir /cv/luis-ceron-cv-en.pdf generado con RenderCV]',
      fileName: 'luis-ceron-cv-en.pdf',
    },
  ] satisfies readonly CvDownload[],
} as const

// ---------------------------------------------------------------------------
// RF-104 — Contacto
// ---------------------------------------------------------------------------

export const contact = {
  heading: { es: 'Hablemos', en: 'Let’s talk' } satisfies Localized,
  intro: {
    es: 'Cuéntame qué necesitas y te respondo. No guardo tus datos: el mensaje llega a mi correo y nada más.',
    en: 'Tell me what you need and I will reply. I do not store your data: the message reaches my inbox and nothing else.',
  } satisfies Localized,
  labels: {
    name: { es: 'Nombre', en: 'Name' } satisfies Localized,
    email: { es: 'Correo electrónico', en: 'Email' } satisfies Localized,
    message: { es: 'Mensaje', en: 'Message' } satisfies Localized,
    submit: { es: 'Enviar mensaje', en: 'Send message' } satisfies Localized,
    submitting: { es: 'Enviando…', en: 'Sending…' } satisfies Localized,
  },
  hints: {
    message: {
      es: 'Entre 10 y 5000 caracteres.',
      en: 'Between 10 and 5000 characters.',
    } satisfies Localized,
  },
  /**
   * Estados del widget antifraude. El primero explica por qué el botón está
   * deshabilitado: un botón inerte sin explicación se lee como una web rota.
   */
  captcha: {
    pending: {
      es: 'Comprobando que no eres un robot. El botón se activa al terminar.',
      en: 'Checking that you are not a robot. The button activates when it finishes.',
    } satisfies Localized,
    unavailable: {
      es: 'La verificación antifraude no está disponible ahora mismo, así que el formulario está deshabilitado. Escríbeme por GitHub mientras tanto.',
      en: 'The anti-fraud check is unavailable right now, so the form is disabled. Reach me through GitHub in the meantime.',
    } satisfies Localized,
  },
  /**
   * T-103: todos los mensajes son texto estático. Nunca se devuelve a la página
   * nada de lo que el visitante haya escrito.
   */
  successMessage: {
    es: 'Mensaje enviado. Te responderé al correo que indicaste.',
    en: 'Message sent. I will reply to the address you gave.',
  } satisfies Localized,
  /** Un código de error del servidor a un texto. El motivo técnico no se expone. */
  errors: {
    VALIDATION: {
      es: 'Revisa los campos marcados y vuelve a intentarlo.',
      en: 'Check the highlighted fields and try again.',
    },
    CAPTCHA: {
      es: 'No se pudo completar la verificación antifraude. Recarga la página e inténtalo otra vez.',
      en: 'The anti-fraud check could not be completed. Reload the page and try again.',
    },
    RATE_LIMITED: {
      es: 'Has enviado varios mensajes seguidos. Espera unos minutos antes de volver a intentarlo.',
      en: 'You have sent several messages in a row. Wait a few minutes before trying again.',
    },
    SEND_FAILED: {
      es: 'No se pudo enviar el mensaje. Vuelve a intentarlo o escríbeme directamente por GitHub.',
      en: 'The message could not be sent. Try again or reach me directly through GitHub.',
    },
  } satisfies Readonly<Record<string, Localized>>,
  /** Un código de validación a un texto. Nunca se repite lo que escribió el visitante. */
  fieldErrors: {
    REQUIRED: { es: 'Este campo es obligatorio.', en: 'This field is required.' },
    TOO_SHORT: { es: 'Es demasiado corto.', en: 'This is too short.' },
    TOO_LONG: { es: 'Es demasiado largo.', en: 'This is too long.' },
    INVALID_EMAIL: {
      es: 'No parece una dirección de correo válida.',
      en: 'This does not look like a valid email address.',
    },
    CONTROL_CHARS: {
      es: 'Contiene caracteres que no se admiten.',
      en: 'It contains characters that are not allowed.',
    },
  } satisfies Readonly<Record<string, Localized>>,
} as const

export const footer = {
  note: {
    es: 'Sitio propio, sin cookies de terceros ni analítica que te siga.',
    en: 'My own site, with no third-party cookies and no analytics following you.',
  } satisfies Localized,
  skipToContent: {
    es: 'Saltar al contenido',
    en: 'Skip to content',
  } satisfies Localized,
} as const
