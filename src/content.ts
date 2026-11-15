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
  /**
   * Dimensiones reales del archivo. Solo hace falta declararlas cuando NO son
   * las 1280x577 del resto de capturas: el componente reserva el espacio con
   * estos números, así que un valor que no coincide con el PNG produce un salto
   * de maquetación al cargar la imagen (CLS), que es justo lo que Lighthouse CI
   * mide en el gate. Si recortas una captura, actualiza esto en el mismo commit.
   */
  width?: number
  height?: number
}


/**
 * Identificadores de los casos de seguridad (RF-102/RF-111). Son también el
 * segmento de su URL: `/casos/<slug>`. El orden de este array NO es el orden de
 * la página; ese lo manda `securityCases`.
 */
export const CASE_SLUGS = ['carelink', 'elevaforge', 'tributary', 'koa'] as const
export type CaseSlug = (typeof CASE_SLUGS)[number]

/** Nombre visible de cada caso: nombre propio, igual en los dos idiomas. */
export const CASE_NAMES: Readonly<Record<CaseSlug, string>> = {
  carelink: 'CareLink',
  elevaforge: 'ElevaForge',
  tributary: 'Tributary',
  koa: 'KOA',
}

/**
 * Un punto de un pilar de "Qué hago", con los casos que lo demuestran. Un punto
 * sin caso que lo respalde lleva `pending` (regla 3: ninguna afirmación sin
 * enlace).
 */
export interface PillarPoint {
  label: Localized
  cases: readonly CaseSlug[]
  pending?: Pending
}

export interface Pillar {
  id: string
  title: Localized
  lead: Localized
  points: readonly PillarPoint[]
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
   * Origen del sitio. T-104: cualquier URL absoluta del servidor sale de AQUÍ,
   * JAMÁS del header `Host`. Es la única línea que hay que tocar el día que
   * exista un dominio propio: `metadataBase`, la canónica, los `hreflang` y la
   * URL de Open Graph se derivan todas de este valor.
   *
   * Es la URL de Vercel, no un dominio propio, y es la estrategia acordada en
   * `tasks/todo.md` (Fase 0): desplegar primero, registrar el dominio con la
   * URL real ya funcionando, apuntar el DNS después. Estuvo como [PENDIENTE]
   * mientras no había NINGUNA URL verificada; ahora sí la hay (HTTP 200
   * comprobado), y dejarla como pendiente significaba emitir metadatos con
   * URLs relativas y ningún canónico absoluto en un sitio que ya está en
   * producción, que es peor que declarar el origen que de verdad sirve la
   * página.
   *
   * Sin barra final: `new URL()` la añade donde hace falta, y duplicarla
   * genera canónicas con `//`.
   */
  url: 'https://portfolio-luisceron.vercel.app' as MaybePending,
  title: {
    es: 'Luis Alejandro Cerón Muñoz, Ingeniero de Software Full-Stack',
    en: 'Luis Alejandro Cerón Muñoz, Full-Stack Software Engineer',
  } satisfies Localized,
  description: {
    es: 'Ingeniero de software full-stack especializado en arquitectura y seguridad de aplicaciones. Diseño y desarrollo de aplicaciones web con arquitectura preparada para escalar y seguridad incorporada desde el diseño, no añadida al final. El resultado: sistemas en producción, sostenibles en el tiempo, sin deuda de seguridad oculta.',
    en: 'Full-stack software engineer specialised in application architecture and security. Design and development of web applications with architecture built to scale and security engineered in from the start, not added at the end. The result: production systems that hold up over time, with no hidden security debt.',
  } satisfies Localized,
} as const

/** RF-108/109: navegación interna y selector de idioma. */
export const nav = {
  brand: 'LC',
  items: [
    { label: { es: 'Qué hago', en: 'What I do' }, href: '#seguridad' },
    { label: { es: 'Trayectoria', en: 'Career' }, href: '#trayectoria' },
    { label: { es: 'Casos', en: 'Cases' }, href: '#casos' },
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
  /**
   * Titular del rol (SRS v1.4). Es el mismo texto que el `headline` del CV y
   * que el `jobTitle` del JSON-LD: si cambia aquí, cambia allí.
   *
   * Las cintas cruzadas de page.tsx lo parten por "|", así que cada disciplina
   * va separada por esa barra.
   *
   * OJO: esto se renderiza encima del titular, así que cuenta para el
   * presupuesto vertical de RF-101 (hero completo en 375x667). Si lo alargas,
   * verifica `e2e/landing.spec.ts` antes de darlo por bueno.
   */
  role: {
    es: 'Ingeniero de Seguridad de Aplicaciones | Arquitectura Segura | DevSecOps',
    en: 'Application Security Engineer | Secure Software Architecture | DevSecOps',
  } satisfies Localized,
  /**
   * RF-101: la propuesta de valor, en una frase. Sin absolutos de seguridad
   * ("imposible de vulnerar", "100 % seguro"): la seguridad se decide y se
   * verifica, no se promete.
   *
   * La longitud NO es libre: e2e/landing.spec.ts mide que el hero completo
   * entre en 375x667. Si alargas esto, ese test falla. Es intencionado.
   */
  pitch: {
    es: 'Diseño aplicaciones web con la seguridad decidida desde la arquitectura, no añadida al final.',
    en: 'I design web applications with security decided at the architecture stage, not added at the end.',
  } satisfies Localized,
  /**
   * Línea de apoyo: el desarrollo como evidencia de la seguridad. Nombra solo
   * el stack que aparece en los casos de seguridad (decisión del dueño,
   * 2026-11-14): Python/Django salió porque ningún caso lo usa.
   */
  support: {
    es: 'Construyo el software que aseguro: full-stack con Java/Spring Boot, React/Next.js, TypeScript y PostgreSQL.',
    en: 'I build the software I secure: full-stack with Java/Spring Boot, React/Next.js, TypeScript and PostgreSQL.',
  } satisfies Localized,
  location: {
    es: 'Pasto, Nariño, Colombia',
    en: 'Pasto, Nariño, Colombia',
  } satisfies Localized,
  availability: {
    es: 'Híbrido en Medellín o Bogotá · Relocalización a Alemania o España',
    en: 'Hybrid in Medellín or Bogotá · Relocation to Germany or Spain',
  } satisfies Localized,
  /** CTA principal: lleva a los casos de seguridad de esta misma página. */
  casesCta: {
    label: { es: 'Ver casos de seguridad', en: 'View security cases' },
    href: '#casos',
  } satisfies ExternalLink,
  /**
   * CTA secundario: descarga directa del CV en el idioma de la página. El otro
   * idioma sigue disponible en la sección de CV.
   */
  cvCta: {
    label: { es: 'Descargar CV', en: 'Download CV' },
    href: { es: '/cv/luis-ceron-cv-es.pdf', en: '/cv/luis-ceron-cv-en.pdf' },
  } satisfies ExternalLink,
  /** RF-105: visible sin pasar del hero. Enlace al perfil, no a un repo suelto. */
  githubLink: {
    label: { es: 'GitHub', en: 'GitHub' },
    href: 'https://github.com/Luisceron0',
  } satisfies ExternalLink,
  linkedinLink: {
    label: { es: 'LinkedIn', en: 'LinkedIn' },
    href: 'https://www.linkedin.com/in/luis-ceronmunoz',
  } satisfies ExternalLink,
  /**
   * Menú de pausa del hero, al estilo de P3R. Son las mismas anclas de la nav
   * más la del CV: no introduce destinos nuevos. Va DEBAJO de los CTA, así que
   * no consume el presupuesto vertical de RF-101.
   */
  menu: {
    title: { es: 'Menú', en: 'Menu' } satisfies Localized,
    label: { es: 'Ir a una sección', en: 'Jump to a section' } satisfies Localized,
    extra: { label: { es: 'CV', en: 'CV' }, href: '#cv' } satisfies NavItem,
    hint: { es: 'Elige una sección', en: 'Choose a section' } satisfies Localized,
  },
} as const

// ---------------------------------------------------------------------------
// RF-106 — Perfil profesional
// ---------------------------------------------------------------------------

export const profile = {
  heading: { es: 'Perfil', en: 'Profile' } satisfies Localized,
  /**
   * TONO (decisión del dueño, 2026-11-14, SRS v1.4): primera persona IMPLÍCITA,
   * sin pronombre ("Reviso…", "Diseño…", nunca "yo"). En inglés, estilo de CV
   * sin pronombre ("Review…", "Design…"). Sustituye a la decisión anterior de un
   * texto impersonal: no la reviertas sin hablar con el dueño.
   *
   * Es una adaptación del "Perfil" del CV (cv/*.yaml): mismos hechos, sin
   * añadir ninguno. Si cambian los HECHOS de uno, se revisa el otro.
   *
   * Vocabulario fijo en todo el sitio y el CV: "modelado de amenazas" (nunca
   * "análisis de amenazas"), "threat modeling" en inglés.
   */
  summary: {
    es: [
      'Ingeniero de software con más de 3 años construyendo y manteniendo sistemas para salud, comercio y sector público, enfocado en seguridad de aplicaciones.',
      'Reviso arquitecturas y flujos de datos con modelado de amenazas, diseño controles de acceso (RBAC, Row Level Security deny-by-default), aplico criptografía (AES-256-GCM por tenant, gestión de secretos) e integro SAST y SCA como gates bloqueantes en CI (CodeQL, Semgrep, audit-ci).',
      'Cursando la Especialización en Seguridad de la Información. Inglés C1.',
    ],
    en: [
      'Software engineer with more than 3 years building and maintaining systems for healthcare, commerce and the public sector, focused on application security.',
      'Review architectures and data flows with threat modeling, design access controls (RBAC, deny-by-default Row Level Security), apply cryptography (per-tenant AES-256-GCM, secrets management) and integrate SAST and SCA as blocking CI gates (CodeQL, Semgrep, audit-ci).',
      'Pursuing a Postgraduate Specialization in Information Security. English C1.',
    ],
  } satisfies LocalizedList,
} as const

// ---------------------------------------------------------------------------
// "Qué hago": tres pilares de igual peso (SRS v1.4)
// ---------------------------------------------------------------------------

export const pillars = {
  heading: { es: 'Qué hago', en: 'What I do' } satisfies Localized,
  /** Rótulo de los enlaces a casos que respaldan cada punto. */
  evidenceLabel: { es: 'Lo demuestra', en: 'Shown in' } satisfies Localized,
  items: [
    {
      id: 'seguridad-aplicaciones',
      title: { es: 'Seguridad de aplicaciones', en: 'Application security' },
      lead: {
        es: 'Qué puede fallar, quién puede abusar y qué control lo detiene.',
        en: 'What can fail, who can abuse it and which control stops it.',
      },
      points: [
        {
          label: { es: 'Modelado de amenazas', en: 'Threat modeling' },
          cases: ['tributary', 'carelink', 'koa'],
        },
        {
          label: {
            es: 'OWASP Top 10: inyección SQL, XSS, XXE, control de acceso roto',
            en: 'OWASP Top 10: SQL injection, XSS, XXE, broken access control',
          },
          cases: ['tributary', 'carelink', 'koa'],
        },
        {
          label: {
            es: 'Controles de acceso: RBAC, autorización revalidada en cada petición',
            en: 'Access control: RBAC, authorization revalidated on every request',
          },
          cases: ['carelink', 'tributary', 'elevaforge'],
        },
        {
          label: {
            es: 'Revisión de dependencias (SCA) y SAST como gates de CI',
            en: 'Dependency review (SCA) and SAST as CI gates',
          },
          cases: ['tributary', 'carelink', 'koa'],
        },
      ],
    },
    {
      id: 'arquitectura-segura',
      title: { es: 'Arquitectura segura', en: 'Secure architecture' },
      lead: {
        es: 'Cada control en la capa donde ningún camino de acceso lo salta por accidente.',
        en: 'Each control at the layer where no access path skips it by accident.',
      },
      points: [
        {
          label: { es: 'Aislamiento multi-tenant', en: 'Multi-tenant isolation' },
          cases: ['carelink'],
        },
        {
          label: {
            es: 'Criptografía aplicada: AES-256-GCM por tenant, crypto-shredding',
            en: 'Applied cryptography: per-tenant AES-256-GCM, crypto-shredding',
          },
          cases: ['carelink', 'tributary'],
        },
        {
          label: {
            es: 'ADRs versionados con alternativas descartadas',
            en: 'Versioned ADRs with discarded alternatives',
          },
          cases: ['tributary', 'elevaforge', 'carelink'],
        },
        {
          label: {
            es: 'Deny-by-default: Row Level Security sin políticas para anon ni authenticated',
            en: 'Deny-by-default: Row Level Security with no policies for anon or authenticated',
          },
          cases: ['elevaforge'],
        },
      ],
    },
    {
      id: 'ingenieria-full-stack',
      title: { es: 'Ingeniería full-stack', en: 'Full-stack engineering' },
      lead: {
        es: 'Construyo el software que aseguro, del modelo de datos al despliegue.',
        en: 'I build the software I secure, from the data model to deployment.',
      },
      points: [
        { label: { es: 'Java · Spring Boot', en: 'Java · Spring Boot' }, cases: ['carelink', 'tributary'] },
        {
          label: { es: 'React · Next.js', en: 'React · Next.js' },
          cases: ['elevaforge', 'carelink', 'tributary'],
        },
        {
          label: { es: 'PostgreSQL', en: 'PostgreSQL' },
          cases: ['carelink', 'tributary', 'elevaforge'],
        },
        { label: { es: 'Astro · TypeScript', en: 'Astro · TypeScript' }, cases: ['koa'] },
        { label: { es: 'Docker · CI/CD', en: 'Docker · CI/CD' }, cases: ['carelink', 'tributary'] },
      ],
    },
  ] satisfies readonly Pillar[],
} as const

// ---------------------------------------------------------------------------
// RF-106 — Trayectoria (más reciente primero)
// ---------------------------------------------------------------------------

export const timeline = {
  heading: { es: 'Trayectoria', en: 'Career' } satisfies Localized,
  intro: {
    es: 'Experiencia y formación, en orden cronológico inverso. El contenido proviene del mismo currículum disponible para descarga más abajo.',
    en: 'Experience and education, most recent first, drawn from the same CV available for download below.',
  } satisfies Localized,
  /** Etiquetas de tipo de entrada. */
  kinds: {
    trabajo: { es: 'Trabajo', en: 'Work' } satisfies Localized,
    estudio: { es: 'Estudio', en: 'Education' } satisfies Localized,
  },
  entries: [
    {
      /*
       * Contrato de duración fija (21 sep a 16 nov 2026). El periodo se escribe
       * con su fecha de cierre y no como "a la actualidad": así no queda
       * desactualizado el día que termina. Cargo y funciones, por indicación
       * del dueño (2026-10-31): las de E.D.S. Kennedy más los proyectos
       * concretos que desarrolló aquí. El visor DICOM está en desarrollo
       * temprano: sus capacidades se escriben como objetivo ("orientado a"),
       * no como funciones ya entregadas. Sin cifras que no tengan respaldo.
       */
      id: 'ips-san-jose',
      kind: 'trabajo',
      title: { es: 'Ingeniero de Software', en: 'Software Engineer' },
      organization: 'I.P.S. San José',
      location: {
        es: 'Villagarzón, Putumayo, Colombia',
        en: 'Villagarzón, Putumayo, Colombia',
      },
      period: { es: 'Sep 2026 a Nov 2026', en: 'Sep 2026 to Nov 2026' },
      highlights: {
        es: [
          'Responsable del desarrollo, la implementación y el mantenimiento de los sistemas informáticos de una institución prestadora de servicios de salud, incluida la administración de sus bases de datos.',
          'Desarrollé un gestor de inventario y automatizaciones de procesos internos de la institución.',
          'Inicié el desarrollo de un visor de imágenes médicas DICOM para la institución, orientado a la reconstrucción multiplanar 2D/3D (MPR), la fusión de estudios PET-CT y la conexión como cliente PACS.',
          'Di soporte técnico y resolución de incidencias a los procesos operativos y administrativos.',
        ],
        en: [
          'Responsible for the development, implementation and maintenance of the information systems of a healthcare provider institution, including the administration of its databases.',
          'Built an inventory manager and automations for the internal processes of the institution.',
          'Started the development of a DICOM medical imaging viewer for the institution, aimed at 2D/3D multiplanar reconstruction (MPR), PET-CT study fusion and connection as a PACS client.',
          'Provided technical support and incident resolution for operational and administrative processes.',
        ],
      },
    },
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
          'Desarrollé de punta a punta el sistema de gestión de mantenimientos de una entidad pública, construyendo la interfaz de usuario, la lógica de backend y el modelo de datos, y lo entregué operativo dentro de los tres meses de la práctica.',
          'Implementé Control de Acceso Basado en Roles (RBAC) y sanitización de entradas del lado del servidor sobre un sistema que gestiona información de una entidad pública, mitigando inyección SQL y XSS (OWASP Top 10) con consultas parametrizadas, sanitización del lado del servidor y RBAC.',
          'Reestructuré la capa de acceso a datos y optimicé las consultas cuando los tiempos de respuesta se convirtieron en el cuello de botella del sistema, reduciendo la latencia de las pantallas de consulta más usadas.',
        ],
        en: [
          'Built the maintenance management system of a public sector entity end to end, covering the user interface, the backend logic and the data model, and delivered it in operation within the three months of the internship.',
          'Implemented Role-Based Access Control (RBAC) and server-side input sanitisation on a system holding government records, mitigating SQL injection and XSS (OWASP Top 10) with parameterized queries, server-side sanitization and RBAC.',
          'Restructured the data access layer and optimised queries once response times became the bottleneck, reducing latency on the most heavily used query screens.',
        ],
      },
    },
    {
      /*
       * ElevaForge aparece dos veces en la página, y es a propósito: aquí como
       * el puesto (cofundador, desde jun 2025) y en `projects` como el sistema
       * construido. Si cambia el nombre o las fechas, hay que tocar los dos.
       */
      id: 'elevaforge',
      kind: 'trabajo',
      title: {
        es: 'Cofundador e Ingeniero de Software',
        en: 'Co-Founder and Software Engineer',
      },
      organization: 'ElevaForge',
      location: { es: 'Remoto', en: 'Remote' },
      period: { es: 'Jun 2025 a la actualidad', en: 'Jun 2025 to present' },
      highlights: {
        es: [
          'Cofundé un estudio de software de tres ingenieros, con responsabilidad sobre las decisiones de arquitectura del producto: límites entre módulos, contratos de datos y alternativas descartadas, documentadas en ADRs versionados que el equipo consulta de forma independiente.',
          'Dirigí la migración del sitio corporativo de Angular a Next.js 14, planificada por capas para que la estructura nueva absorbiera el contenido existente sin rehacerlo.',
          'Diseñé el modelo de autorización de la plataforma como deny-by-default: Row Level Security activa y sin ninguna política para el rol anónimo ni el autenticado, con todo el acceso a datos pasando por el servidor.',
          'Configuré la CI del sitio con escaneo de secretos (gitleaks), lint, typecheck, tests, build y e2e en cada push; en los demos KOA, CodeQL, audit-ci y Lighthouse CI (landing) y CodeQL y npm audit (tienda).',
          'Construí elevaforge.com y la vertical de demostración KOA (landing y e-commerce) con un panel de administración multi-cuenta, con el que el equipo edita paquetes, proyectos y contenido sin un despliegue de por medio.',
        ],
        en: [
          'Co-founded a three engineer software studio, with responsibility for the product architecture decisions: module boundaries, data contracts and discarded alternatives, documented in versioned ADRs the team consults independently.',
          'Led the migration of the corporate site from Angular to Next.js 14, planned layer by layer so the new structure absorbed the existing content instead of rebuilding it.',
          'Designed the platform authorisation model as deny-by-default: Row Level Security enabled with no policy at all for the anonymous or the authenticated role, and all data access routed through the server.',
          'Set up the site CI with secret scanning (gitleaks), lint, typecheck, tests, build and e2e on every push; on the KOA demos, CodeQL, audit-ci and Lighthouse CI (landing) and CodeQL and npm audit (store).',
          'Built elevaforge.com and the KOA demo vertical (landing and e-commerce) with a multi-account admin panel the team uses to edit packages, projects and content without a deploy in between.',
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
      /*
       * Entrada respaldada por una constancia laboral formal del negocio
       * (2026-08-28), a diferencia de "freelance", cuyo texto es deliberadamente
       * genérico porque cubre OTROS clientes bajo confidencialidad. Esta sí
       * tiene nombre y fechas exactas porque hay un documento firmado detrás.
       * Va justo antes de "freelance" (mismo mes de inicio, mismo tipo de
       * trabajo independiente) y no reordena el resto de la trayectoria.
       */
      id: 'eds-kennedy',
      kind: 'trabajo',
      title: {
        es: 'Contratista de TI y Sistemas',
        en: 'IT and Systems Contractor',
      },
      organization: 'Estación de Servicio Kennedy',
      location: { es: 'Pasto, Colombia', en: 'Pasto, Colombia' },
      period: { es: 'Mar 2023 a Mar 2026', en: 'Mar 2023 to Mar 2026' },
      highlights: {
        es: [
          'Contratista de TI durante tres años consecutivos, responsable del desarrollo, la implementación y el mantenimiento de los sistemas informáticos de una estación de servicio en funcionamiento.',
          'Administré las bases de datos del negocio y optimicé las herramientas de control de inventario y ventas, la operación diaria de la que dependía la caja y el abastecimiento.',
          'Fui el punto de contacto técnico permanente: soporte a los procesos operativos y administrativos, y resolución de incidencias sobre los sistemas de gestión de la empresa según iban apareciendo, no bajo un contrato de horas fijas.',
        ],
        en: [
          'IT contractor for three consecutive years, responsible for the development, implementation and maintenance of the information systems of an operating fuel station.',
          'Managed the business databases and optimised the inventory and sales control tools, the day to day operation the till and fuel supply depended on.',
          'Was the standing technical point of contact: support for operational and administrative processes, and incident resolution on the company management systems as they came up, not under a fixed-hours contract.',
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
          'Atendí clientes a medio tiempo en paralelo a la carrera universitaria y, después, a la práctica en la Alcaldía de Pasto, hasta formalizar esa disciplina de producto cofundando ElevaForge a mediados de 2025.',
          'Ejecuté migraciones de datos hacia SAP y Oracle NetSuite aplicando cifrado y respaldos previos, de modo que cada corte tuviera un punto de retorno antes de mover el primer registro.',
          'Implementé soluciones CRM a medida (Salesforce, HubSpot) para negocios de e-commerce, incluyendo la configuración de controles de acceso por rol para que cada usuario opere solo sobre la cartera que le corresponde.',
          'Desarrollé sistemas de reportes automatizados con Odoo, Python y PostgreSQL que sustituyeron la consolidación manual de datos por una generación periódica para análisis de negocio.',
        ],
        en: [
          'Served clients part-time alongside my degree and, later, alongside the internship at Alcaldía de Pasto, until I formalised that product discipline by co-founding ElevaForge in mid 2025.',
          'Executed data migrations to SAP and Oracle NetSuite applying encryption and prior backups, so every cutover had a point of return before the first record moved.',
          'Implemented custom CRM solutions (Salesforce, HubSpot) for e-commerce businesses, including role-based access control configuration so each user works only on the accounts assigned to them.',
          'Built automated reporting systems with Odoo, Python and PostgreSQL that replaced manual data consolidation with periodic report generation for business analysis.',
        ],
      },
    },
    {
      id: 'voluntariado',
      kind: 'trabajo',
      title: { es: 'Voluntario comunitario', en: 'Community volunteer' },
      organization: 'Refugios de animales y escuelas locales',
      location: { es: 'Pasto, Colombia', en: 'Pasto, Colombia' },
      period: { es: 'Ene 2019', en: 'Jan 2019' },
      highlights: {
        es: [
          'Soporte técnico y asistencia en tecnología educativa para fomentar la alfabetización digital en la comunidad local.',
        ],
        en: [
          'Technical support and educational technology assistance to promote digital literacy in the local community.',
        ],
      },
    },
  ] satisfies readonly TimelineEntry[],
} as const

// ---------------------------------------------------------------------------
// RF-102 / RF-111 — Casos de seguridad (4)
// ---------------------------------------------------------------------------

/**
 * Enlaces a código: SIEMPRE a un commit fijo (permalink), nunca a `main`. Un
 * enlace a una línea de `main` apunta a otra cosa en cuanto alguien edita el
 * archivo; uno a un commit sigue señalando el código que respalda la frase.
 *
 * Commits revisados el 2026-11-14 (clon de solo lectura, sin tocar los repos).
 * Para actualizar un caso: volver a leer el archivo en el commit nuevo, comprobar
 * que las líneas siguen diciendo lo mismo y cambiar el hash aquí.
 */
const REPO = {
  carelink: 'https://github.com/Luisceron0/CareLink',
  tributary: 'https://github.com/Luisceron0/Tributary',
  elevaforge: 'https://github.com/Luisceron0/ElevaForge',
  koaLanding: 'https://github.com/luisCeron0Portfolio/koa-landing',
  koaStore: 'https://github.com/luisCeron0Portfolio/koa-store',
  portfolio: 'https://github.com/Luisceron0/Portfolio',
} as const

const COMMIT = {
  carelink: 'b61a8aa54785235519e52a8d2aedee20c1ecea5f',
  tributary: '725be9809f59c09929675db439db380fcdd0f621',
  elevaforge: '5be5d7d3e4bec4718aaa7472baa37dad201d6a47',
  koaLanding: '56102f12d296e85b9379c55b5b0018364c801977',
  koaStore: '6959769afc9a635d8c07f4a4b4c6956b9b198c56',
  portfolio: '07fbce5cc71bf10884bcf65947cab35d3c66a76f',
} as const

type RepoKey = keyof typeof REPO

/**
 * Enlace a un archivo (y opcionalmente a un rango de líneas) en su commit fijo.
 * La etiqueta es el nombre del archivo y las líneas: igual en los dos idiomas,
 * porque es una referencia de código, no prosa.
 */
function code(repo: RepoKey, path: string, lines?: string): ExternalLink {
  const file = path.split('/').pop() ?? path
  const label = lines ? `${file} (${lines.replace(/-/g, ' a ')})` : file
  const labelEn = lines ? `${file} (${lines.replace(/-/g, ' to ')})` : file
  return {
    label: { es: label, en: labelEn },
    href: `${REPO[repo]}/blob/${COMMIT[repo]}/${path}${lineAnchor(path, lines)}`,
  }
}

/**
 * Ancla de línea. En un Markdown, GitHub muestra el documento renderizado y
 * el `#L12` no apunta a nada: con `?plain=1` muestra el texto con números de
 * línea y el ancla funciona.
 */
function lineAnchor(path: string, lines?: string): string {
  if (!lines) return ''
  return path.endsWith('.md') ? `?plain=1#${lines}` : `#${lines}`
}

/** Enlace a una carpeta del repositorio en su commit fijo. */
function tree(repo: RepoKey, path: string, label: Localized): ExternalLink {
  return { label, href: `${REPO[repo]}/tree/${COMMIT[repo]}/${path}` }
}

/** Enlace a un documento del repo con etiqueta propia (no un nombre de archivo). */
function doc(repo: RepoKey, path: string, label: Localized, anchor?: string): ExternalLink {
  const suffix = !anchor ? '' : /^L\d/.test(anchor) ? lineAnchor(path, anchor) : `#${anchor}`
  return { label, href: `${REPO[repo]}/blob/${COMMIT[repo]}/${path}${suffix}` }
}

export type CaseStatus = 'produccion' | 'demo' | 'repositorio'

/** Una amenaza del caso. `stride` solo si el threat model del repo la declara. */
export interface CaseThreat {
  /** Identificador en el threat model del repo (T-001, T2...), si lo tiene. */
  ref?: string
  text: Localized
  /** Categoría STRIDE tal como la escribe el threat model del repo. */
  stride?: string
}

/** Un control elegido, por qué, y dónde vive en el código. */
export interface CaseControl {
  title: Localized
  why: Localized
  evidence: readonly ExternalLink[]
}

/** Grupo de controles. KOA usa dos con título; los demás, uno sin título. */
export interface CaseControlGroup {
  heading?: Localized
  controls: readonly CaseControl[]
}

/** Una verificación: qué se comprobó y con qué evidencia. */
export interface CaseCheck {
  text: Localized
  evidence: readonly ExternalLink[]
}

export interface SecurityCase {
  slug: CaseSlug
  kicker: Localized
  /** Una frase para la tarjeta de la home. */
  summary: Localized
  /** El problema, en una frase. */
  problem: Localized
  stack: readonly string[]
  status: CaseStatus
  dataFlow: Localized
  assets: LocalizedList
  /**
   * Título del bloque de amenazas cuando no sale de un threat model (ElevaForge:
   * hallazgos de la revisión de seguridad de su SRS). Sin él, "Amenazas
   * principales".
   */
  threatsHeading?: Localized
  /** Documento del repo del que salen las amenazas. */
  threatModel: ExternalLink
  threats: readonly CaseThreat[]
  controlGroups: readonly CaseControlGroup[]
  verification: readonly CaseCheck[]
  links: readonly ExternalLink[]
  screenshot: ProjectImage
}

export const casesSection = {
  heading: { es: 'Casos de seguridad', en: 'Security cases' } satisfies Localized,
  intro: {
    es: 'Cuatro sistemas que diseñé y construí. Cada caso sigue la misma plantilla: problema, flujo de datos, amenazas, controles enlazados al código que los implementa y cómo se verificaron.',
    en: 'Four systems I designed and built. Every case follows the same template: problem, data flow, threats, controls linked to the code that implements them, and how they were verified.',
  } satisfies Localized,
  labels: {
    problem: { es: 'Problema', en: 'Problem' } satisfies Localized,
    stack: { es: 'Stack', en: 'Stack' } satisfies Localized,
    status: { es: 'Estado', en: 'Status' } satisfies Localized,
    statuses: {
      produccion: { es: 'En producción', en: 'In production' },
      demo: { es: 'Demo en vivo', en: 'Live demo' },
      repositorio: { es: 'Repositorio', en: 'Repository' },
    } satisfies Record<CaseStatus, Localized>,
    dataFlow: { es: 'Flujo de datos', en: 'Data flow' } satisfies Localized,
    assets: { es: 'Activos sensibles', en: 'Sensitive assets' } satisfies Localized,
    threats: { es: 'Amenazas principales', en: 'Main threats' } satisfies Localized,
    threatModelSource: { es: 'Fuente', en: 'Source' } satisfies Localized,
    controls: { es: 'Controles elegidos y por qué', en: 'Chosen controls and why' } satisfies Localized,
    evidence: { es: 'Código', en: 'Code' } satisfies Localized,
    verification: { es: 'Cómo se verificó', en: 'How it was verified' } satisfies Localized,
    links: { es: 'Enlaces', en: 'Links' } satisfies Localized,
    readCase: { es: 'Ver el caso completo', en: 'Read the full case' } satisfies Localized,
    backToCases: { es: 'Volver a los casos', en: 'Back to the cases' } satisfies Localized,
    newTab: {
      es: ' (se abre en una pestaña nueva)',
      en: ' (opens in a new tab)',
    } satisfies Localized,
  },
} as const

/**
 * Compatibilidad: componentes que solo necesitan el aviso de "pestaña nueva".
 * Es el mismo texto que `casesSection.labels.newTab`.
 */
export const projectsSection = { labels: { newTab: casesSection.labels.newTab } } as const

/**
 * Los cuatro casos, en el orden de la página (decisión del dueño, 2026-11-14):
 * CareLink primero, porque es el que mejor muestra flujo de datos, criptografía
 * y control de acceso.
 *
 * Reglas de este bloque:
 *  - Cada control enlaza a un archivo o línea de su repositorio, en un commit
 *    fijo, o lleva su `[PENDIENTE: TODO-LUIS, ...]`.
 *  - La categoría STRIDE de una amenaza solo aparece si el threat model del
 *    repositorio la declara para esa amenaza. No se reconstruye desde el código,
 *    y su ausencia NO se marca como pendiente: va a tasks/todo.md.
 *  - `[PENDIENTE]` solo para un dato que impide publicar algo verdadero. Las
 *    mejoras opcionales van a tasks/todo.md, no al sitio (dueño, 2026-11-14).
 *  - Nada de absolutos de seguridad.
 */
export const securityCases: readonly SecurityCase[] = [
  {
    slug: 'carelink',
    kicker: {
      es: 'Plataforma clínica multi-tenant, implementación de referencia',
      en: 'Multi-tenant clinical platform, reference implementation',
    },
    summary: {
      es: 'Historia clínica, triage y coordinación entre especialistas para varias instituciones sobre una misma base, con el control de acceso y el cifrado aplicados en la base de datos y en cada petición.',
      en: 'Clinical history, triage and specialist coordination for several institutions on a shared database, with access control and encryption enforced in the database and on every request.',
    },
    problem: {
      es: 'Varias instituciones de salud comparten una base de datos, y ningún registro clínico firmado puede editarse ni ningún especialista puede leer pacientes que no le corresponden.',
      en: 'Several healthcare institutions share one database, and no signed clinical record may be edited and no specialist may read patients outside their care.',
    },
    stack: ['Java', 'Spring Boot', 'PostgreSQL 16', 'React 18', 'Vite', 'Docker', 'Flyway'],
    status: 'repositorio',
    dataFlow: {
      es: 'Navegador (SPA en React) → API en Spring Boot: el filtro JWT valida la firma RS256 antes de leer el payload → casos de uso que validan institución (tenant) y servicio en cada petición → adaptador de cifrado AES-256-GCM → PostgreSQL con un schema por institución y una bitácora de auditoría append-only.',
      en: 'Browser (React SPA) → Spring Boot API: the JWT filter validates the RS256 signature before reading the payload → use cases that validate institution (tenant) and service on every request → AES-256-GCM encryption adapter → PostgreSQL with one schema per institution and an append-only audit log.',
    },
    assets: {
      es: [
        'Información de salud (notas clínicas), cifrada en reposo',
        'Encuentros clínicos firmados',
        'Bitácora de auditoría',
        'Clave maestra de cifrado y claves derivadas por institución',
        'Par de claves RS256 de los JWT',
      ],
      en: [
        'Health information (clinical notes), encrypted at rest',
        'Signed clinical encounters',
        'Audit log',
        'Master encryption key and per-institution derived keys',
        'RS256 JWT key pair',
      ],
    },
    threatModel: doc(
      'carelink',
      'docs/SRS.md',
      { es: 'Threat model, docs/SRS.md §8.1', en: 'Threat model, docs/SRS.md §8.1' },
      '81-threat-model-stride-merged'
    ),
    threats: [
      {
        text: {
          es: 'Acceso a información de salud de otra institución por IDOR en la API.',
          en: 'Access to another institution’s health information through IDOR in the API.',
        },
      },
      {
        text: {
          es: 'Un especialista conserva el acceso al paciente después de cerrarse la interconsulta.',
          en: 'A specialist keeps access to the patient after the referral closes.',
        },
      },
      {
        text: {
          es: 'Re-identificación de pacientes cruzando agregados del motor de conocimiento.',
          en: 'Patient re-identification by cross-referencing knowledge engine aggregates.',
        },
      },
      {
        text: {
          es: 'Alteración de la bitácora de auditoría con acceso directo a la base.',
          en: 'Audit log tampering through direct database access.',
        },
      },
      {
        text: {
          es: 'JWT manipulado para escalar de rol.',
          en: 'Tampered JWT used to escalate role.',
        },
      },
    ],
    controlGroups: [
      {
        controls: [
          {
            title: {
              es: 'Trigger de PostgreSQL que bloquea la edición de encuentros firmados',
              en: 'PostgreSQL trigger that blocks edits to signed encounters',
            },
            why: {
              es: 'La regla vive en la base: rechaza el UPDATE aunque llegue desde un cliente SQL o una migración, no solo desde la API.',
              en: 'The rule lives in the database: it rejects the UPDATE even when it comes from a SQL client or a migration, not only from the API.',
            },
            evidence: [
              code('carelink', 'services/identity-service/src/main/resources/db/tenant/tenant_template.sql', 'L127-L140'),
            ],
          },
          {
            title: {
              es: 'Cifrado AES-256-GCM con clave derivada por institución',
              en: 'AES-256-GCM encryption with a per-institution derived key',
            },
            why: {
              es: 'IV aleatorio en cada operación y una clave por institución derivada con HMAC-SHA256: un volcado sin claves no se lee, y la clave de una institución no abre otra. Deuda declarada en el repo: la clave maestra vive en una variable de entorno, no en un KMS.',
              en: 'Random IV per operation and a per-institution key derived with HMAC-SHA256: a dump without keys cannot be read, and one institution’s key does not open another. Debt stated in the repo: the master key lives in an environment variable, not in a KMS.',
            },
            evidence: [
              code('carelink', 'services/identity-service/src/main/java/com/carelink/clinical/infrastructure/encryption/AesGcmEncryptionService.java', 'L45'),
              code('carelink', 'services/identity-service/src/main/java/com/carelink/clinical/infrastructure/encryption/AesGcmEncryptionService.java', 'L116-L118'),
            ],
          },
          {
            title: {
              es: 'Autorización revalidada en cada petición contra el estado de la interconsulta',
              en: 'Authorization revalidated on every request against the referral status',
            },
            why: {
              es: 'El permiso del especialista es un EXISTS sobre la interconsulta abierta, sin caché: cerrarla revoca el acceso en la siguiente petición, sin esperar a que caduque el token.',
              en: 'The specialist’s permission is an EXISTS over the open referral, with no cache: closing it revokes access on the next request, without waiting for the token to expire.',
            },
            evidence: [
              code('carelink', 'services/identity-service/src/main/java/com/carelink/clinical/infrastructure/persistence/JdbcInterconsultationRepository.java', 'L44-L63'),
            ],
          },
          {
            title: {
              es: 'Supresión de agregados clínicos con menos de 5 pacientes distintos',
              en: 'Suppression of clinical aggregates with fewer than 5 distinct patients',
            },
            why: {
              es: 'El umbral va dentro de la consulta (HAVING COUNT(DISTINCT patient_id)), así que el grupo pequeño nunca sale de la base: defensa contra la re-identificación.',
              en: 'The threshold sits inside the query (HAVING COUNT(DISTINCT patient_id)), so the small group never leaves the database: a defence against re-identification.',
            },
            evidence: [
              code('carelink', 'services/identity-service/src/main/java/com/carelink/clinical/infrastructure/persistence/JdbcKnowledgeEngineRepository.java', 'L89-L91'),
            ],
          },
          {
            title: {
              es: 'Bitácora de auditoría append-only',
              en: 'Append-only audit log',
            },
            why: {
              es: 'Triggers que rechazan UPDATE y DELETE sobre la bitácora: quién hizo qué queda registrado aunque alguien tenga acceso a la base.',
              en: 'Triggers that reject UPDATE and DELETE on the log: who did what stays recorded even for someone with database access.',
            },
            evidence: [
              code('carelink', 'services/identity-service/src/main/resources/db/tenant/tenant_template.sql', 'L63-L76'),
            ],
          },
        ],
      },
    ],
    verification: [
      {
        text: {
          es: 'Tests de integración contra PostgreSQL real: un encuentro firmado rechaza la edición, el acceso se revoca al cerrar la interconsulta, una columna con información de salud no se lee en claro y un paciente es invisible entre servicios.',
          en: 'Integration tests against real PostgreSQL: a signed encounter rejects edits, access is revoked when the referral closes, a health information column cannot be read in plain text and a patient is invisible across services.',
        },
        evidence: [
          code('carelink', 'services/identity-service/src/test/java/com/carelink/clinical/ClinicalEncounterLifecycleIT.java', 'L65'),
          code('carelink', 'services/identity-service/src/test/java/com/carelink/clinical/InterconsultationLifecycleIT.java', 'L57'),
          code('carelink', 'services/identity-service/src/test/java/com/carelink/clinical/infrastructure/encryption/PhiColumnCannotBeReadAsPlaintextIT.java'),
          code('carelink', 'services/identity-service/src/test/java/com/carelink/clinical/ServiceScopeIsolationIT.java', 'L71'),
        ],
      },
      {
        text: {
          es: 'CI en cada push: build con tests, Semgrep con reglas propias y gitleaks. OWASP dependency-check configurado; hoy no bloqueante hasta configurar la clave de NVD.',
          en: 'CI on every push: build with tests, Semgrep with custom rules and gitleaks. OWASP dependency-check configured; not blocking until the NVD key is set up.',
        },
        evidence: [
          code('carelink', '.github/workflows/ci.yml', 'L71-L101'),
          tree('carelink', '.semgrep', { es: 'Reglas Semgrep propias', en: 'Custom Semgrep rules' }),
        ],
      },
      {
        text: {
          es: 'Dos auditorías documentadas contra el sistema en ejecución: SAST, sqlmap y barrido de secretos; después, una batería manual de autorización (IDOR, bypass de rol, JWT, límite de intentos) que encontró y corrigió un hallazgo de severidad alta.',
          en: 'Two documented audits against the running system: SAST, sqlmap and a secrets sweep; then a manual authorization battery (IDOR, role bypass, JWT, rate limiting) that found and fixed one high severity finding.',
        },
        evidence: [
          code('carelink', 'docs/security/AUDIT-2026-08-06.md'),
          code('carelink', 'docs/security/AUDIT-2026-08-07.md'),
        ],
      },
    ],
    links: [
      { label: { es: 'Repositorio', en: 'Repository' }, href: REPO.carelink },
      doc(
        'carelink',
        'docs/SRS.md',
        { es: 'Sin demo pública, por diseño (SRS §1.6)', en: 'No public demo, by design (SRS §1.6)' },
        '16-nature-of-the-artifact-and-limits-of-use'
      ),
      tree('carelink', 'docs/adr', { es: 'ADRs', en: 'ADRs' }),
      doc('carelink', 'docs/portfolio/SCREENSHOTS.md', { es: 'Capturas del sistema', en: 'System screenshots' }),
    ],
    screenshot: {
      src: '/proyectos/carelink.png',
      alt: {
        es: 'Pantalla de CareLink mostrando el intento de editar un encuentro clínico ya firmado, rechazado con un error 409 por un trigger de la base de datos.',
        en: 'CareLink screen showing an attempt to edit an already signed clinical encounter, rejected with a 409 error by a database trigger.',
      },
    },
  },
  {
    slug: 'elevaforge',
    kicker: {
      es: 'Sitio y panel de administración de un estudio de software',
      en: 'Site and admin panel for a software studio',
    },
    summary: {
      es: 'Sitio en producción con panel de administración multi-cuenta, con autorización deny-by-default en la base de datos y todo el acceso a datos pasando por el servidor.',
      en: 'Production site with a multi-account admin panel, deny-by-default authorization in the database and all data access routed through the server.',
    },
    problem: {
      es: 'El equipo edita el contenido del sitio desde un panel, y ni ese panel ni la clave pública que viaja al navegador deben convertirse en la vía de acceso a los datos de clientes potenciales.',
      en: 'The team edits the site content from a panel, and neither that panel nor the public key shipped to the browser may become the way into prospective clients’ data.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Upstash', 'Vercel'],
    status: 'produccion',
    dataFlow: {
      es: 'Navegador → rutas de servidor de Next.js (sesión de administrador en cookie firmada con HMAC, validación de origen, límite por IP) → Supabase con la service-role key, solo en el servidor. La anon key que llega al navegador no tiene ninguna política que le dé acceso.',
      en: 'Browser → Next.js server routes (admin session in an HMAC-signed cookie, origin validation, per-IP limit) → Supabase with the service-role key, server-side only. The anon key shipped to the browser has no policy that grants it access.',
    },
    assets: {
      es: [
        'Solicitudes de contacto (datos de clientes potenciales)',
        'Cuentas de administrador',
        'Contenido editable del sitio',
        'Service-role key y semilla de sesión',
      ],
      en: [
        'Contact requests (prospective client data)',
        'Admin accounts',
        'Editable site content',
        'Service-role key and session seed',
      ],
    },
    threatsHeading: {
      es: 'Hallazgos de la revisión de seguridad (SRS, F-01 a F-04)',
      en: 'Security review findings (SRS, F-01 to F-04)',
    },
    threatModel: doc(
      'elevaforge',
      'SRS-ElevaForge-v0.3.md',
      { es: 'SRS v0.3, F-01 a F-04 (L80 a L84)', en: 'SRS v0.3, F-01 to F-04 (L80 to L84)' },
      'L80-L84'
    ),
    threats: [
      {
        ref: 'F-02',
        text: {
          es: 'Lectura de las solicitudes de contacto con la anon key que viaja al navegador.',
          en: 'Reading contact requests with the anon key shipped to the browser.',
        },
      },
      {
        ref: 'F-01',
        text: {
          es: 'Límite de solicitudes evadible falsificando la IP de origen.',
          en: 'Rate limit bypassed by spoofing the source IP.',
        },
      },
      {
        ref: 'F-03',
        text: {
          es: 'Sesión de administrador firmada con una semilla acoplada a la service-role key.',
          en: 'Admin session signed with a seed coupled to the service-role key.',
        },
      },
      {
        ref: 'F-04',
        text: {
          es: 'Credencial de administrador heredada que sigue activa tras migrar a cuentas multi-admin.',
          en: 'Legacy admin credential still active after moving to multi-admin accounts.',
        },
      },
    ],
    controlGroups: [
      {
        controls: [
          {
            title: {
              es: 'Row Level Security deny-by-default',
              en: 'Deny-by-default Row Level Security',
            },
            why: {
              es: 'RLS activa y sin ninguna política para los roles anon ni authenticated: lo que no está concedido no existe. Todo el acceso pasa por el servidor con la service-role key, así que la clave pública no habilita ninguna consulta.',
              en: 'RLS enabled with no policy at all for the anon or authenticated roles: what is not granted does not exist. All access goes through the server with the service-role key, so the public key enables no query.',
            },
            evidence: [
              code('elevaforge', 'supabase/01-schema-and-rls.sql', 'L1-L13'),
              code('elevaforge', 'supabase/01-schema-and-rls.sql', 'L61-L63'),
            ],
          },
          {
            title: {
              es: 'Sesión propia firmada con HMAC y semilla dedicada',
              en: 'Own HMAC-signed session with a dedicated seed',
            },
            why: {
              es: 'La semilla de sesión es un secreto propio, sin respaldo en la service-role key, y las comparaciones de credenciales y firmas son en tiempo constante.',
              en: 'The session seed is its own secret, with no fallback to the service-role key, and credential and signature comparisons are constant-time.',
            },
            evidence: [code('elevaforge', 'lib/security/admin-session.ts', 'L22-L55')],
          },
          {
            title: {
              es: 'Límite por IP con la IP que entrega la plataforma',
              en: 'Per-IP limit using the IP the platform provides',
            },
            why: {
              es: 'La IP sale de la plataforma de despliegue, no de una cabecera que controle el cliente, y el contador vive en Upstash Redis.',
              en: 'The IP comes from the hosting platform, not from a client-controlled header, and the counter lives in Upstash Redis.',
            },
            evidence: [
              code('elevaforge', 'lib/security/rate-limit.ts', 'L158'),
              code('elevaforge', 'lib/security/client-ip.ts'),
            ],
          },
          {
            title: {
              es: 'Validación de origen en las rutas que modifican datos',
              en: 'Origin validation on data-changing routes',
            },
            why: {
              es: 'Defensa contra CSRF en el panel: una petición de otro origen se rechaza antes de tocar los datos.',
              en: 'CSRF defence for the panel: a request from another origin is rejected before it touches the data.',
            },
            evidence: [code('elevaforge', 'lib/security/csrf.ts', 'L22')],
          },
          {
            title: {
              es: 'Aviso de arranque si quedan credenciales heredadas',
              en: 'Startup warning when legacy credentials remain',
            },
            why: {
              es: 'Si coexisten administradores en la base y la credencial antigua por variable de entorno, el arranque lo avisa en lugar de dejarla pasar en silencio.',
              en: 'If database admins and the old environment-variable credential coexist, startup warns about it instead of letting it pass silently.',
            },
            evidence: [code('elevaforge', 'lib/security/admin-bootstrap-check.ts', 'L18')],
          },
        ],
      },
    ],
    verification: [
      {
        text: {
          es: 'Prueba TC-06 contra el proyecto real de Supabase con la anon key (2026-07-22): solicitudes de contacto devuelve una lista vacía, y administradores y contenido devuelven permiso denegado.',
          en: 'TC-06 test against the real Supabase project with the anon key (2026-07-22): contact requests return an empty list, and admins and content return permission denied.',
        },
        evidence: [doc('elevaforge', 'SRS-ElevaForge-v0.3.md', { es: 'SRS v0.3, F-02 (L82)', en: 'SRS v0.3, F-02 (L82)' }, 'L82')],
      },
      {
        text: {
          es: 'Tests unitarios de los controles: validación de origen, IP de cliente y comportamiento del límite cuando Redis no responde.',
          en: 'Unit tests for the controls: origin validation, client IP and rate limit behaviour when Redis does not respond.',
        },
        evidence: [
          code('elevaforge', 'lib/security/csrf.test.ts'),
          code('elevaforge', 'lib/security/client-ip.test.ts'),
          code('elevaforge', 'lib/security/rate-limit-failopen.test.ts'),
        ],
      },
      {
        text: {
          es: 'CI del repositorio: gitleaks, lint, typecheck, tests, build y e2e con Playwright.',
          en: 'Repository CI: gitleaks, lint, typecheck, tests, build and Playwright e2e.',
        },
        evidence: [
          code('elevaforge', '.github/workflows/ci.yml'),
        ],
      },
    ],
    links: [
      { label: { es: 'elevaforge.com', en: 'elevaforge.com' }, href: 'https://www.elevaforge.com' },
      { label: { es: 'Repositorio', en: 'Repository' }, href: REPO.elevaforge },
      doc(
        'elevaforge',
        'SRS-ElevaForge-v0.3.md',
        { es: 'ADRs (SRS, Anexo A)', en: 'ADRs (SRS, Annex A)' },
        'L307'
      ),
    ],
    screenshot: {
      src: '/proyectos/elevaforge.png',
      alt: {
        es: 'Página de inicio de ElevaForge con el titular "Forjamos el motor digital de tu empresa".',
        en: 'ElevaForge home page with the headline "Forjamos el motor digital de tu empresa".',
      },
    },
  },
  {
    slug: 'tributary',
    kicker: {
      es: 'Motor de facturación electrónica multirrégimen, implementación de referencia',
      en: 'Multi-regime e-invoicing engine, reference implementation',
    },
    summary: {
      es: 'Facturación electrónica para ventas entre Colombia, España y Alemania, con la inmutabilidad fiscal aplicada en PostgreSQL, 13 controles de seguridad y 4 gates independientes en CI. El quickstart lo levanta todo en menos de 3 minutos.',
      en: 'E-invoicing for sales across Colombia, Spain and Germany, with fiscal immutability enforced in PostgreSQL, 13 security controls and 4 independent CI gates. The quickstart brings it all up in under 3 minutes.',
    },
    problem: {
      es: 'Una venta transfronteriza se emite bajo tres regímenes fiscales incompatibles, y un registro emitido no puede alterarse sin que se detecte ni duplicarse por una respuesta perdida. Implementación de referencia, no certificada para producción.',
      en: 'One cross-border sale is issued under three incompatible fiscal regimes, and an issued record cannot be altered undetected or duplicated by a lost response. Reference implementation, not certified for production.',
    },
    stack: ['Java 21', 'Spring Boot', 'PostgreSQL 16', 'Flyway', 'React 19', 'Testcontainers', 'Docker'],
    status: 'repositorio',
    dataFlow: {
      es: 'Operador (máquina a máquina, OAuth2 con JWT RS256) → API con RBAC → casos de uso → adaptadores por país (Colombia en sandbox, España sin remisión, Alemania validada con el validador oficial) → PostgreSQL con cadena de hashes SHA-256, triggers de inmutabilidad y bitácora append-only. Los datos personales del comprador se cifran con una clave por titular.',
      en: 'Operator (machine to machine, OAuth2 with RS256 JWT) → API with RBAC → use cases → per-country adapters (Colombia in sandbox, Spain without submission, Germany validated with the official validator) → PostgreSQL with a SHA-256 hash chain, immutability triggers and an append-only audit log. Buyer personal data is encrypted with a per-subject key.',
    },
    assets: {
      es: [
        'Cadena de registros fiscales',
        'Credenciales OAuth2 del operador tecnológico',
        'Datos personales de compradores',
        'Claves de cifrado por titular',
        'Consecutivo de numeración',
        'Bitácora de auditoría',
      ],
      en: [
        'Fiscal record chain',
        'OAuth2 credentials of the e-invoicing provider',
        'Buyer personal data',
        'Per-subject encryption keys',
        'Invoice numbering sequence',
        'Audit log',
      ],
    },
    threatModel: doc(
      'tributary',
      'docs/SRS-tributary.md',
      { es: 'Threat model, docs/SRS-tributary.md §7', en: 'Threat model, docs/SRS-tributary.md §7' },
      '7-threat-model'
    ),
    threats: [
      {
        ref: 'T-001',
        stride: 'Tampering',
        text: {
          es: 'Alteración de un registro fiscal con acceso directo a la base de datos.',
          en: 'Alteration of a fiscal record through direct database access.',
        },
      },
      {
        ref: 'T-002',
        stride: 'Tampering / Repudiation',
        text: {
          es: 'Emisión duplicada tras una respuesta perdida.',
          en: 'Duplicate issuance after a lost response.',
        },
      },
      {
        ref: 'T-003',
        stride: 'Information Disclosure',
        text: {
          es: 'Fuga del secreto OAuth2 del operador en el repositorio o en los logs.',
          en: 'Leak of the provider’s OAuth2 secret in the repository or the logs.',
        },
      },
      {
        ref: 'T-004',
        stride: 'Tampering / DoS / Information Disclosure',
        text: {
          es: 'XXE y expansión de entidades al parsear XML de terceros.',
          en: 'XXE and entity expansion when parsing third-party XML.',
        },
      },
      {
        ref: 'T-011',
        stride: 'Spoofing',
        text: {
          es: 'Token falsificado con algoritmo none o por confusión de algoritmo.',
          en: 'Token forged with the none algorithm or through algorithm confusion.',
        },
      },
    ],
    controlGroups: [
      {
        controls: [
          {
            title: {
              es: 'Triggers de inmutabilidad y REVOKE sobre el rol de la aplicación',
              en: 'Immutability triggers and REVOKE on the application role',
            },
            why: {
              es: 'La inmutabilidad es una garantía de la base, no de la aplicación: rechaza UPDATE y DELETE incluso desde psql con credenciales válidas. Una corrección es una fila nueva que referencia a la anterior.',
              en: 'Immutability is a database guarantee, not an application promise: it rejects UPDATE and DELETE even from psql with valid credentials. A correction is a new row referencing the previous one.',
            },
            evidence: [
              code('tributary', 'tributary-persistence/src/main/resources/db/migration/V3__immutability_triggers.sql', 'L22-L40'),
              code('tributary', 'tributary-persistence/src/main/resources/db/migration/V5__application_roles.sql', 'L17'),
              code('tributary', 'docs/adr/ADR-002-chain-integrity-in-postgresql.md'),
            ],
          },
          {
            title: {
              es: 'Verificador de la cadena de hashes',
              en: 'Hash chain verifier',
            },
            why: {
              es: 'Si alguien desactiva el trigger y altera una fila, el verificador recalcula la cadena y señala el registro exacto donde falla.',
              en: 'If someone disables the trigger and alters a row, the verifier recomputes the chain and points at the exact record where it breaks.',
            },
            evidence: [code('tributary', 'tributary-persistence/src/main/java/com/tributary/persistence/ChainVerifier.java', 'L61')],
          },
          {
            title: {
              es: 'Idempotencia por clave determinista y reconciliación antes de reintentar',
              en: 'Deterministic-key idempotency and reconciliation before retrying',
            },
            why: {
              es: 'Una respuesta perdida no se arregla reintentando (duplica un documento legal) ni dejando de reintentar (pierde uno legítimo): se consulta el estado real antes de decidir.',
              en: 'A lost response is not fixed by retrying (it duplicates a legal document) or by not retrying (it loses a legitimate one): the real state is queried before deciding.',
            },
            evidence: [
              code('tributary', 'tributary-application/src/main/java/com/tributary/application/usecase/ReconcileInvoiceUseCase.java'),
              code('tributary', 'docs/adr/ADR-003-idempotency-and-reconciliation.md'),
            ],
          },
          {
            title: {
              es: 'Fábrica única de parsers XML endurecidos',
              en: 'Single factory of hardened XML parsers',
            },
            why: {
              es: 'DOCTYPE deshabilitado y procesamiento seguro activado en el único sitio que crea parsers; ArchUnit impide instanciarlos fuera de él.',
              en: 'DOCTYPE disabled and secure processing enabled in the only place that creates parsers; ArchUnit forbids instantiating them anywhere else.',
            },
            evidence: [
              code('tributary', 'tributary-adapter-de-en16931/src/main/java/com/tributary/adapter/de/SecureXmlFactory.java', 'L68-L71'),
            ],
          },
          {
            title: {
              es: 'Algoritmo del JWT fijado a RS256',
              en: 'JWT algorithm pinned to RS256',
            },
            why: {
              es: 'El verificador solo acepta RS256: un token con alg none o uno HS256 firmado con la clave pública se rechaza.',
              en: 'The verifier only accepts RS256: a token with alg none or an HS256 token signed with the public key is rejected.',
            },
            evidence: [code('tributary', 'tributary-api/src/main/java/com/tributary/api/security/SecurityConfig.java', 'L61')],
          },
          {
            title: {
              es: 'Crypto-shredding para conciliar el borrado RGPD con la retención fiscal',
              en: 'Crypto-shredding to reconcile GDPR erasure with fiscal retention',
            },
            why: {
              es: 'Los datos personales se cifran con una clave por titular y borrar destruye la clave, no la fila: el registro fiscal sigue íntegro y el dato personal queda ilegible.',
              en: 'Personal data is encrypted with a per-subject key and erasure destroys the key, not the row: the fiscal record stays intact and the personal data becomes unreadable.',
            },
            evidence: [
              code('tributary', 'tributary-persistence/src/main/java/com/tributary/persistence/JdbcKeyVaultRepository.java', 'L59-L61'),
              code('tributary', 'docs/adr/ADR-004-crypto-shredding.md'),
            ],
          },
        ],
      },
    ],
    verification: [
      {
        text: {
          es: 'Matriz de 13 controles, cada uno con herramienta, comando y criterio binario de aprobado o fallado (sqlmap, psql, payload XXE, gitleaks, ArchUnit, tokens manipulados, test de caos).',
          en: 'Matrix of 13 controls, each with a tool, a command and a binary pass or fail criterion (sqlmap, psql, XXE payload, gitleaks, ArchUnit, tampered tokens, chaos test).',
        },
        evidence: [
          doc('tributary', 'docs/SRS-tributary.md', { es: 'SRS §9A', en: 'SRS §9A' }, '9a-matriz-de-verificación-de-controles'),
        ],
      },
      {
        text: {
          es: 'Tests automatizados de los controles: tokens con alg none y por confusión de algoritmo rechazados con 401, detección de manipulación en la cadena, aislamiento del dominio y ausencia de hosts de la autoridad fiscal en el QR.',
          en: 'Automated tests for the controls: alg none and algorithm confusion tokens rejected with 401, tamper detection in the chain, domain isolation and no tax authority hosts in the QR code.',
        },
        evidence: [
          code('tributary', 'tributary-api/src/test/java/com/tributary/api/RbacAndJwtIntegrationTest.java', 'L146-L169'),
          code('tributary', 'tributary-persistence/src/test/java/com/tributary/persistence/ChainVerifierTest.java', 'L82'),
          code('tributary', 'tributary-api/src/test/java/com/tributary/architecture/ArchitectureTest.java'),
          code('tributary', 'tributary-adapter-es-verifactu/src/test/java/com/tributary/adapter/es/VerifactuQrGeneratorTest.java', 'L57'),
        ],
      },
      {
        text: {
          es: '4 gates independientes en CI: build con tests, SAST con Semgrep (reglas propias probadas contra fixtures vulnerables), SCA con Trivy que bloquea en HIGH y CRITICAL, y gitleaks sobre todo el historial.',
          en: '4 independent CI gates: build with tests, SAST with Semgrep (custom rules proven against vulnerable fixtures), SCA with Trivy blocking on HIGH and CRITICAL, and gitleaks across the full history.',
        },
        evidence: [
          code('tributary', '.github/workflows/ci.yml', 'L17-L90'),
          code('tributary', '.github/workflows/ci.yml', 'L126-L139'),
          tree('tributary', '.semgrep', { es: 'Reglas y fixtures de Semgrep', en: 'Semgrep rules and fixtures' }),
        ],
      },
      {
        text: {
          es: 'El quickstart levanta todo el stack con Docker Compose en menos de 3 minutos.',
          en: 'The quickstart brings the whole stack up with Docker Compose in under 3 minutes.',
        },
        evidence: [doc('tributary', 'README.md', { es: 'Quickstart', en: 'Quickstart' }, 'quickstart')],
      },
    ],
    links: [
      { label: { es: 'Repositorio', en: 'Repository' }, href: REPO.tributary },
      doc(
        'tributary',
        'README.md',
        { es: 'Probarlo en local: quickstart en menos de 3 minutos', en: 'Try it locally: quickstart in under 3 minutes' },
        'quickstart'
      ),
      doc(
        'tributary',
        'docs/adr/ADR-011-infrastructure-ready-not-deployed.md',
        { es: 'Sin demo pública, por diseño (ADR-011)', en: 'No public demo, by design (ADR-011)' }
      ),
      code('tributary', 'docs/adr/README.md'),
      doc('tributary', 'docs/portfolio.md', { es: 'Resumen técnico', en: 'Technical writeup' }),
    ],
    screenshot: {
      src: '/proyectos/tributary.png',
      width: 1280,
      height: 1000,
      alt: {
        es: 'Interfaz de Tributary verificando una cadena fiscal: el resultado es BROKEN, nombra el registro roto y muestra el hash almacenado junto al recalculado.',
        en: 'Tributary interface verifying a fiscal chain: the result is BROKEN, it names the broken record and shows the stored hash next to the recomputed one.',
      },
    },
  },
  {
    slug: 'koa',
    kicker: {
      es: 'Landing de lista de espera y tienda bilingüe de demostración',
      en: 'Waitlist landing page and bilingual demo store',
    },
    summary: {
      es: 'Un formulario público y un checkout: precios recalculados en el servidor y defensa contra automatización con Turnstile, confirmación por correo y límite por IP.',
      en: 'A public form and a checkout: prices recalculated on the server and anti-automation defence with Turnstile, email confirmation and a per-IP limit.',
    },
    problem: {
      es: 'Un formulario público y un checkout son lo primero que encuentran los bots y quien manipula peticiones: la lista de espera tiene que medir interés real y el total de la compra no puede salir del navegador.',
      en: 'A public form and a checkout are the first things bots and request tamperers find: the waitlist has to measure real interest and the purchase total cannot come from the browser.',
    },
    stack: ['Astro', 'React', 'TypeScript', 'Neon Postgres', 'Upstash', 'Turnstile', 'Resend', 'Vercel'],
    status: 'demo',
    dataFlow: {
      es: 'Landing: formulario → endpoint de servidor (límite por IP con hash en Upstash → verificación de Turnstile → validación) → Neon Postgres en estado pendiente → correo de confirmación con token. Tienda: carrito anónimo en sesión → el servidor recotiza cada línea contra el catálogo → checkout simulado, sin pagos reales.',
      en: 'Landing: form → server endpoint (per-IP limit with a hashed IP in Upstash → Turnstile verification → validation) → Neon Postgres in pending state → confirmation email with a token. Store: anonymous session cart → the server reprices every line against the catalogue → simulated checkout, no real payments.',
    },
    assets: {
      es: [
        'Lista de espera (correos)',
        'Reputación de envío del dominio de correo',
        'Integridad de precios y totales',
        'Datos de contacto de la tienda',
      ],
      en: [
        'Waitlist (email addresses)',
        'Sending reputation of the email domain',
        'Price and total integrity',
        'Store contact data',
      ],
    },
    threatModel: doc(
      'koaStore',
      'SRS-sitio-web-demo-KOA.md',
      { es: 'Threat model de la tienda (SRS)', en: 'Store threat model (SRS)' },
      'L331'
    ),
    threats: [
      {
        ref: 'T2',
        stride: 'Tampering',
        text: {
          es: 'Manipulación del precio o del total en la petición del carrito o del checkout.',
          en: 'Tampering with the price or total in the cart or checkout request.',
        },
      },
      {
        ref: 'T6',
        stride: 'Denial of Service',
        text: {
          es: 'Inundación de formularios o del checkout.',
          en: 'Flooding of forms or the checkout.',
        },
      },
      {
        ref: 'T10',
        stride: 'Spoofing / Info Disclosure',
        text: {
          es: 'Uso del checkout como relé de spam hacia correos de terceros.',
          en: 'Use of the checkout as a spam relay to third-party addresses.',
        },
      },
      {
        text: {
          es: 'Bots que llenan la lista de espera o apuntan a terceros sin su consentimiento.',
          en: 'Bots filling the waitlist or signing up third parties without consent.',
        },
      },
    ],
    controlGroups: [
      {
        heading: { es: 'Seguridad de lógica de negocio', en: 'Business logic security' },
        controls: [
          {
            title: {
              es: 'Precios recalculados en el servidor',
              en: 'Prices recalculated on the server',
            },
            why: {
              es: 'El precio unitario sale siempre del catálogo, nunca del estado que envía el navegador: un precio o un subtotal inyectado se ignora.',
              en: 'The unit price always comes from the catalogue, never from the state the browser sends: an injected price or subtotal is ignored.',
            },
            evidence: [
              code('koaStore', 'src/lib/cart.ts', 'L145-L160'),
              code('koaStore', 'src/pages/api/checkout/simulate.ts', 'L51'),
            ],
          },
          {
            title: {
              es: 'Checkout simulado, sin campos de tarjeta',
              en: 'Simulated checkout, no card fields',
            },
            why: {
              es: 'No se procesa ningún pago real y no existe un campo donde escribir una tarjeta, así que no hay datos de pago que custodiar. La interfaz lo dice.',
              en: 'No real payment is processed and there is no field to type a card into, so there is no payment data to safeguard. The interface says so.',
            },
            evidence: [
              code('koaStore', 'README.md', 'L12'),
              doc('koaStore', 'SRS-sitio-web-demo-KOA.md', { es: 'SRS, T3 (L335)', en: 'SRS, T3 (L335)' }, 'L335'),
            ],
          },
        ],
      },
      {
        heading: { es: 'Defensa contra automatización', en: 'Anti-automation defence' },
        controls: [
          {
            title: {
              es: 'Turnstile verificado en el servidor',
              en: 'Turnstile verified on the server',
            },
            why: {
              es: 'El servidor valida el token con Cloudflare antes de aceptar el envío, sin fiarse de lo que reporta el cliente.',
              en: 'The server validates the token with Cloudflare before accepting the submission, without trusting what the client reports.',
            },
            evidence: [
              code('koaLanding', 'src/pages/api/waitlist.ts', 'L80-L83'),
              code('koaLanding', 'src/lib/adapters/turnstile.ts', 'L9'),
            ],
          },
          {
            title: {
              es: 'Límite de solicitudes por IP, con la IP guardada como hash',
              en: 'Per-IP request limit, with the IP stored as a hash',
            },
            why: {
              es: 'El límite se comprueba antes de cualquier otra operación, y la IP se guarda con hash y pepper: sirve para contar intentos sin registrar quién visitó la página.',
              en: 'The limit is checked before any other operation, and the IP is stored hashed with a pepper: it counts attempts without logging who visited the page.',
            },
            evidence: [
              code('koaLanding', 'src/pages/api/waitlist.ts', 'L61-L76'),
              code('koaLanding', 'src/lib/domain/ip.ts', 'L6'),
            ],
          },
          {
            title: {
              es: 'Confirmación por correo',
              en: 'Email confirmation',
            },
            why: {
              es: 'Una dirección no cuenta como suscrita hasta que su dueño abre el enlace; el token se guarda como hash. Nadie puede apuntar a terceros.',
              en: 'An address does not count as subscribed until its owner opens the link; the token is stored as a hash. Nobody can sign up someone else.',
            },
            evidence: [code('koaLanding', 'src/pages/confirmar.astro', 'L18-L20')],
          },
        ],
      },
    ],
    verification: [
      {
        text: {
          es: 'Tests de la lógica de negocio: el carrito ignora un precio y un subtotal inyectados.',
          en: 'Business logic tests: the cart ignores an injected price and subtotal.',
        },
        evidence: [
          code('koaStore', 'src/lib/cart.test.ts', 'L176'),
          code('koaStore', 'src/lib/cart.test.ts', 'L206'),
        ],
      },
      {
        text: {
          es: 'Tests e2e de los caminos de fallo: el sexto intento en 10 minutos desde la misma IP responde 429, y un envío con el honeypot lleno no se guarda.',
          en: 'E2E tests of the failure paths: the sixth attempt in 10 minutes from the same IP gets a 429, and a submission with the honeypot filled is not stored.',
        },
        evidence: [
          code('koaLanding', 'tests/e2e/waitlist-rate-limit.spec.ts', 'L14'),
          code('koaLanding', 'tests/e2e/waitlist-honeypot.spec.ts', 'L8'),
        ],
      },
      {
        text: {
          es: 'CI: CodeQL, audit-ci, gitleaks y Lighthouse CI en la landing; CodeQL, npm audit y gitleaks en la tienda. Registro de sqlmap contra el formulario de contacto de la tienda.',
          en: 'CI: CodeQL, audit-ci, gitleaks and Lighthouse CI on the landing page; CodeQL, npm audit and gitleaks on the store. sqlmap log against the store contact form.',
        },
        evidence: [
          code('koaLanding', '.github/workflows/codeql.yml'),
          code('koaLanding', '.github/workflows/ci.yml', 'L32-L33'),
          code('koaStore', '.github/workflows/ci.yml', 'L25-L59'),
          code('koaStore', 'docs/security-evidence/sqlmap-t5-contact-2026-07-29.log'),
        ],
      },
    ],
    links: [
      { label: { es: 'koa.elevaforge.com', en: 'koa.elevaforge.com' }, href: 'https://koa.elevaforge.com/' },
      {
        label: { es: 'store.koa.elevaforge.com', en: 'store.koa.elevaforge.com' },
        href: { es: 'https://store.koa.elevaforge.com/es', en: 'https://store.koa.elevaforge.com/en' },
      },
      { label: { es: 'Repositorio de la landing', en: 'Landing repository' }, href: REPO.koaLanding },
      { label: { es: 'Repositorio de la tienda', en: 'Store repository' }, href: REPO.koaStore },
      doc(
        'koaStore',
        'SRS-sitio-web-demo-KOA.md',
        { es: 'ADRs de la tienda (SRS §6.3)', en: 'Store ADRs (SRS §6.3)' },
        '63-decisiones-de-arquitectura-adrs'
      ),
    ],
    screenshot: {
      src: '/proyectos/koa-store.png',
      alt: {
        es: 'Tienda KOA con el titular "Seis productos. Ninguno de más." y el selector de idioma español e inglés.',
        en: 'KOA store with the headline "Seis productos. Ninguno de más." and the Spanish/English language switcher.',
      },
    },
  },
] as const

// ---------------------------------------------------------------------------
// "Cómo trabajo": el proceso en cuatro pasos (SRS v1.4)
// ---------------------------------------------------------------------------

export interface ProcessStep {
  id: string
  title: Localized
  text: Localized
  /** Dónde se ve este paso en los casos: enlaces a código o documentos. */
  evidence: readonly ExternalLink[]
}

export const workProcess = {
  heading: { es: 'Cómo trabajo', en: 'How I work' } satisfies Localized,
  intro: {
    es: 'El mismo proceso en cada proyecto, de la amenaza al gate que la vigila.',
    en: 'The same process on every project, from the threat to the gate that watches it.',
  } satisfies Localized,
  evidenceLabel: { es: 'Se ve en', en: 'Seen in' } satisfies Localized,
  steps: [
    {
      id: 'modelar',
      title: { es: 'Modelar amenazas', en: 'Model threats' },
      text: {
        es: 'Activos, flujos de datos y amenazas antes de escribir código: qué puede fallar y quién puede abusar.',
        en: 'Assets, data flows and threats before writing code: what can fail and who can abuse it.',
      },
      evidence: [
        doc('tributary', 'docs/SRS-tributary.md', { es: 'Tributary, SRS §7', en: 'Tributary, SRS §7' }, '7-threat-model'),
        doc('carelink', 'docs/SRS.md', { es: 'CareLink, SRS §8.1', en: 'CareLink, SRS §8.1' }, '81-threat-model-stride-merged'),
      ],
    },
    {
      id: 'decidir',
      title: { es: 'Decidir y registrar en un ADR', en: 'Decide and record it in an ADR' },
      text: {
        es: 'Cada decisión con su porqué y sus alternativas descartadas, versionada junto al código.',
        en: 'Every decision with its rationale and discarded alternatives, versioned next to the code.',
      },
      evidence: [
        code('tributary', 'docs/adr/README.md'),
        tree('carelink', 'docs/adr', { es: 'CareLink, docs/adr', en: 'CareLink, docs/adr' }),
      ],
    },
    {
      id: 'implementar',
      title: { es: 'Implementar', en: 'Implement' },
      text: {
        es: 'El control en la capa donde ningún camino de acceso lo salta por accidente: la base de datos, el servidor, la propia consulta.',
        en: 'The control at the layer no access path skips by accident: the database, the server, the query itself.',
      },
      evidence: [
        code('carelink', 'services/identity-service/src/main/resources/db/tenant/tenant_template.sql', 'L127-L140'),
        code('koaStore', 'src/lib/cart.ts', 'L145-L160'),
      ],
    },
    {
      id: 'bloquear',
      title: { es: 'Bloquear en CI', en: 'Block in CI' },
      text: {
        es: 'SAST, revisión de dependencias y escaneo de secretos como gates: un hallazgo detiene la integración.',
        en: 'SAST, dependency review and secret scanning as gates: a finding stops the integration.',
      },
      evidence: [
        code('tributary', '.github/workflows/ci.yml', 'L17-L90'),
        code('koaLanding', '.github/workflows/ci.yml', 'L32-L33'),
        code('portfolio', '.github/workflows/ci.yml', 'L41-L85'),
      ],
    },
  ] satisfies readonly ProcessStep[],
  /**
   * Captura de un gate bloqueando un despliegue. `null` mientras no exista: la
   * sección no muestra ningún hueco vacío (la tarea está en tasks/todo.md).
   */
  gateScreenshot: null as ProjectImage | null,
} as const

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
      /*
       * Grupo nuevo, y va PRIMERO a propósito: es el eje del CV desde que el
       * dueño lo giró hacia arquitectura, y el orden de esta lista es lo
       * primero que lee alguien que la escanea por encima.
       */
      label: { es: 'Arquitectura', en: 'Architecture' },
      items: {
        es: [
          'Diseño de sistemas escalables',
          'Arquitectura hexagonal',
          'Separación por capas',
          'Diseño de APIs REST',
          'Modelado de datos',
          'ADRs',
          'Aislamiento multi-tenant',
        ],
        en: [
          'Scalable system design',
          'Hexagonal architecture',
          'Layered separation',
          'REST API design',
          'Data modelling',
          'ADRs',
          'Multi-tenant isolation',
        ],
      },
    },
    {
      label: { es: 'Lenguajes', en: 'Languages' },
      items: {
        es: ['Java', 'Python', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
        en: ['Java', 'Python', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
      },
    },
    {
      label: { es: 'Frameworks', en: 'Frameworks' },
      items: {
        /*
         * Cada meta-framework va detrás de su base (Next.js tras React): el
         * orden comunica la relación entre ambos, que es información gratis
         * para quien lee la lista por encima.
         *
         * Nuxt salió cuando el dueño lo quitó del CV, y no vuelve salvo que
         * haya un proyecto en esta misma página que lo use. Next.js SÍ se queda
         * aunque el CV ya no lo liste en "Desarrollo": lo respaldan la entrada
         * de ElevaForge (migración de Angular a Next.js 14), el stack del
         * proyecto ElevaForge y este propio sitio. Regla 3: lo que se afirma
         * aquí tiene respaldo visible, y quitarlo dejaría la lista contradiciendo
         * a la trayectoria.
         */
        es: [
          'Spring Boot',
          'React',
          'Next.js',
          'Vue.js',
          'Angular',
          'Astro',
          'Bootstrap',
          'Tailwind CSS',
        ],
        en: [
          'Spring Boot',
          'React',
          'Next.js',
          'Vue.js',
          'Angular',
          'Astro',
          'Bootstrap',
          'Tailwind CSS',
        ],
      },
    },
    {
      label: { es: 'Cloud, DevOps y Seguridad', en: 'Cloud, DevOps and Security' },
      items: {
        es: [
          'AWS (EC2, S3)',
          'Docker',
          'Git',
          'CI/CD Pipelines',
          'Modelado de amenazas',
          'SAST y SCA en CI (CodeQL, Semgrep)',
          'Seguridad de redes',
          'RBAC',
          'JWT',
          'Prácticas de código seguro',
        ],
        en: [
          'AWS (EC2, S3)',
          'Docker',
          'Git',
          'CI/CD pipelines',
          'Threat modelling',
          'SAST and SCA in CI (CodeQL, Semgrep)',
          'Network security',
          'RBAC',
          'JWT',
          'Secure coding practices',
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
      label: { es: 'Idiomas', en: 'Spoken languages' },
      items: {
        es: ['Español (nativo)', 'Inglés (avanzado C1, EF SET Certified)'],
        en: ['Spanish (native)', 'English (advanced C1, EF SET Certified)'],
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
    ],
    en: [
      'Cybersecurity, MinTIC Colombia (Sept 2024)',
      'Network Security, Cisco (Dec 2024)',
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
      href: '/cv/luis-ceron-cv-es.pdf',
      fileName: 'luis-ceron-cv-es.pdf',
    },
    {
      language: 'en',
      label: { es: 'CV en inglés (PDF)', en: 'CV in English (PDF)' },
      href: '/cv/luis-ceron-cv-en.pdf',
      fileName: 'luis-ceron-cv-en.pdf',
    },
  ] satisfies readonly CvDownload[],
} as const

// ---------------------------------------------------------------------------
// RF-104 — Contacto
// ---------------------------------------------------------------------------

export const contact = {
  heading: { es: 'Contacto', en: 'Contact' } satisfies Localized,
  intro: {
    es: 'Escríbame para contarme qué necesita; le responderé a la brevedad. No se almacenan datos: el mensaje llega directamente a mi correo.',
    en: 'Write to me about your project or enquiry; I will reply promptly. No data is stored: the message is delivered directly to my inbox.',
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
      es: 'Verificando que no se trata de un robot. El botón se activará al completarse la comprobación.',
      en: 'Verifying that this is not a robot. The button will activate once the check completes.',
    } satisfies Localized,
    unavailable: {
      es: 'La verificación antifraude no está disponible en este momento, por lo que el formulario permanece deshabilitado. Contácteme por GitHub mientras tanto.',
      en: 'The anti-fraud check is currently unavailable, so the form has been disabled. Please reach me through GitHub in the meantime.',
    } satisfies Localized,
  },
  /**
   * T-103: todos los mensajes son texto estático. Nunca se devuelve a la página
   * nada de lo que el visitante haya escrito.
   */
  successMessage: {
    es: 'Mensaje enviado. Le responderé al correo indicado.',
    en: 'Message sent. I will reply to the address provided.',
  } satisfies Localized,
  /** Un código de error del servidor a un texto. El motivo técnico no se expone. */
  errors: {
    VALIDATION: {
      es: 'Revise los campos marcados y vuelva a intentarlo.',
      en: 'Please check the highlighted fields and try again.',
    },
    CAPTCHA: {
      es: 'No se pudo completar la verificación antifraude. Recargue la página e inténtelo nuevamente.',
      en: 'The anti-fraud check could not be completed. Please reload the page and try again.',
    },
    RATE_LIMITED: {
      es: 'Se han enviado varios mensajes de forma consecutiva. Espere unos minutos antes de volver a intentarlo.',
      en: 'Several messages have been sent in quick succession. Please wait a few minutes before trying again.',
    },
    SEND_FAILED: {
      es: 'No se pudo enviar el mensaje. Vuelva a intentarlo o contácteme directamente por GitHub.',
      en: 'The message could not be sent. Please try again or reach me directly through GitHub.',
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
    es: 'Sitio propio, sin cookies de terceros ni analítica de seguimiento.',
    en: 'Independently operated site, with no third-party cookies and no tracking analytics.',
  } satisfies Localized,
  skipToContent: {
    es: 'Saltar al contenido',
    en: 'Skip to content',
  } satisfies Localized,
} as const
