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
    es: 'Ingeniero de software full-stack.Diseño y desarrollo full-stack de aplicaciones web, con arquitectura pensada para escalar y seguridad incorporada desde el diseño, no añadida al final. El resultado: sistemas en producción, sostenibles en el tiempo y sin una deuda de seguridad oculta detrás.',
    en: 'Full-stack software engineer. Full-stack design and development of web applications, with architecture built to scale and security engineered in from the start , not bolted on at the end. The result: production systems that hold up over time, with no hidden security debt left behind.',
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
  /**
   * Tres disciplinas, no tres empleos. El orden va de lo más concreto a lo más
   * transversal, que es como se lee de un vistazo.
   *
   * OJO: esto se renderiza encima del titular, así que cuenta para el
   * presupuesto vertical de RF-101 (hero completo en 375x667). Si lo alargas,
   * verifica `e2e/landing.spec.ts` antes de darlo por bueno.
   */
  role: {
    es: 'Ingeniero de Software Full-Stack · Arquitectura y Seguridad',
    en: 'Full-Stack Software Engineer · Architecture and Security',
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
  /**
   * Tres párrafos, por decisión del dueño: los tres ángulos (desarrollo,
   * arquitectura, seguridad), la estructura antes del código, y la seguridad
   * pensada desde el diseño. Antes fue el resumen literal del CV, luego el
   * resumen más un bloque DEV/ARCH/SEC, luego un único párrafo largo.
   *
   * OJO, esto cambia una garantía anterior: el resumen YA NO es la copia
   * literal del "Perfil Profesional" del YAML del CV, ni repite el stack ni el
   * nivel de inglés. Página y PDF siguen sin CONTRADECIRSE (los hechos del CV
   * están en `facts` y en el resto de secciones), pero ya no son el mismo
   * texto, y eso es deliberado: un resumen de CV y la entradilla de un sitio no
   * tienen por qué sonar igual. Si cambian los HECHOS de uno, revisar el otro.
   *
   * La disponibilidad para relocalización salió de aquí a propósito: ya está en
   * `hero.availability`, y repetirla restaba en vez de sumar.
   *
   * El texto habla del trabajo, no en primera persona: es una elección de tono
   * del dueño, no un descuido. Si se vuelve a primera persona, hay que cambiar
   * los tres párrafos y los dos idiomas a la vez.
   */
  summary: {
    es: [
      'El trabajo combina desarrollo full-stack con arquitectura de software y arquitectura de seguridad: no son etapas separadas, sino la misma decisión vista desde tres ángulos distintos. La interfaz, la lógica que no se ve, y la puesta en producción están conectadas, y las decisiones que cruzan esas capas se toman mejor viendo el conjunto completo.',
      'Antes de la primera línea de código se define la estructura: dónde van los límites entre las partes del sistema, qué debe mantenerse estable y qué debe poder cambiar más adelante sin rehacer lo que ya funciona. Esa decisión temprana es la diferencia entre un producto que evoluciona junto al negocio y uno que hay que reconstruir cada vez que llega un requisito grande.',
      'La arquitectura de seguridad no se agrega al final, como un parche: se piensa desde el diseño, identificando qué puede salir mal y ubicando cada control donde realmente sostiene. Ante una falla, el sistema prioriza fallar de forma segura antes que dejar una puerta abierta "por si acaso": un control que se salta ante la duda no protege nada.',
    ],
    en: [
      "The work combines full-stack development with software architecture and security architecture: these aren't separate stages, but the same decision seen from three angles. The interface, the logic behind it, and the path to production are connected, and the decisions that cross those layers are made better when the full picture is visible.",
      "Before the first line of code, the structure gets defined: where the boundaries between the system's parts go, what needs to stay stable, and what must be able to change later without rebuilding what already works. That early decision separates a product that evolves with the business from one that has to be rebuilt every time a major requirement arrives.",
      'Security architecture is not added at the end, like a patch: it is considered from the design stage, identifying what could go wrong and placing each control where it actually holds. When something fails, the system is built to fail safely rather than leave a door open "just in case": a control that gets bypassed under doubt protects nothing.',
    ],
  } satisfies LocalizedList,
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
          'Desarrollé de punta a punta el sistema de gestión de mantenimientos de una entidad pública, construyendo la interfaz de usuario, la lógica de backend y el modelo de datos, y lo entregué operativo dentro de los tres meses de la práctica.',
          'Implementé Control de Acceso Basado en Roles (RBAC) y sanitización de entradas del lado del servidor sobre un sistema que gestiona información de una entidad pública, cerrando las vías de inyección SQL y de XSS antes de la puesta en producción.',
          'Reestructuré la capa de acceso a datos y optimicé las consultas cuando los tiempos de respuesta se convirtieron en el cuello de botella del sistema, reduciendo la latencia de las pantallas de consulta más usadas.',
        ],
        en: [
          'Built the maintenance management system of a public sector entity end to end, covering the user interface, the backend logic and the data model, and delivered it in operation within the three months of the internship.',
          'Implemented Role-Based Access Control (RBAC) and server-side input sanitisation on a system holding government records, closing the SQL injection and XSS paths before it went into production.',
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
          'Cofundé un estudio de software de tres ingenieros y asumí las decisiones de arquitectura del producto: definí los límites entre módulos y los contratos de datos, y dejé cada decisión y sus alternativas descartadas en ADRs versionados, de modo que el equipo puede revisarlas sin depender de mí.',
          'Dirigí la migración del sitio corporativo de Angular a Next.js 14, planificada por capas para que la estructura nueva absorbiera el contenido existente sin rehacerlo.',
          'Diseñé el modelo de autorización de la plataforma como deny-by-default: Row Level Security activa y sin ninguna política para el rol anónimo ni el autenticado, con todo el acceso a datos pasando por el servidor.',
          'Establecí un estándar de seguridad en CI que corre en cada despliegue (CodeQL, reglas propias de Semgrep, audit-ci y gates de Lighthouse CI), de forma que un hallazgo detiene la entrega en lugar de descubrirse en producción.',
          'Construí elevaforge.com y la vertical de demostración KOA (landing y e-commerce) con un panel de administración multi-cuenta, con el que el equipo edita paquetes, proyectos y contenido sin un despliegue de por medio.',
        ],
        en: [
          'Co-founded a three engineer software studio and owned the product architecture decisions: I defined the module boundaries and the data contracts, and recorded every decision and its discarded alternatives in versioned ADRs, so the team can review them without depending on me.',
          'Led the migration of the corporate site from Angular to Next.js 14, planned layer by layer so the new structure absorbed the existing content instead of rebuilding it.',
          'Designed the platform authorisation model as deny-by-default: Row Level Security enabled with no policy at all for the anonymous or the authenticated role, and all data access routed through the server.',
          'Established a CI security baseline that runs on every deploy (CodeQL, custom Semgrep rules, audit-ci and Lighthouse CI gates), so a finding stops the delivery instead of surfacing in production.',
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
// RF-102 — Proyectos (4)
// ---------------------------------------------------------------------------

export const projectsSection = {
  heading: { es: 'Proyectos', en: 'Projects' } satisfies Localized,
  intro: {
    es: 'Cinco sistemas que construí de principio a fin. Cada uno enlaza a su código y, cuando existe, al sitio en vivo: nada de lo que afirmo aquí queda sin respaldo.',
    en: 'Five systems I built end to end. Each one links to its code and, where it exists, to the live site: nothing I claim here is left unbacked.',
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
      es: 'Un hospital lleva historia clínica, triage y coordinación entre especialistas sobre los mismos datos. Guardarlos es la parte fácil. Lo difícil son dos garantías que no admiten excepciones: que un registro firmado no se pueda alterar después, ni siquiera por un administrador con acceso directo a la base, y que ningún profesional vea el historial de un paciente que no está a su cargo.',
      en: 'A hospital keeps clinical records, triage and coordination between specialists on the same data. Storing it is the easy part. The hard part is two guarantees that admit no exceptions: that a signed record cannot be altered afterwards, not even by an administrator with direct database access, and that no clinician sees the history of a patient who is not in their care.',
    },
    stack: ['Java', 'Spring Boot', 'PostgreSQL 16', 'React 18', 'Vite', 'Docker', 'Flyway'],
    security: {
      es: 'La inmutabilidad no se delega a la capa de aplicación. Un trigger de PostgreSQL rechaza cualquier UPDATE sobre un encuentro ya firmado, así que la regla se cumple igual si alguien entra por fuera de la API, con un cliente SQL o con una migración mal escrita. Poner el control en la capa que nadie puede saltarse es la diferencia entre una regla de negocio y una garantía. La captura muestra el intento rechazado con un 409.',
      en: 'Immutability is not delegated to the application layer. A PostgreSQL trigger rejects any UPDATE on an already signed encounter, so the rule holds even if someone comes in outside the API, with a SQL client or through a badly written migration. Putting the control at the layer nobody can bypass is the difference between a business rule and a guarantee. The screenshot shows the attempt rejected with a 409.',
    },
    highlights: {
      es: [
        'Aislamiento multi-tenant por schema: cada institución vive en su propio schema de PostgreSQL, y el filtro por servicio va dentro del WHERE de la consulta, no aplicado sobre filas ya traídas a memoria. La distinción no es de estilo: filtrar después significa que los datos ya salieron de la base.',
        'El permiso de un especialista sobre un paciente nace de una interconsulta y se revalida en cada petición. El mismo JWT responde 200 mientras la interconsulta está abierta y 403 en cuanto se cierra, sin que el usuario vuelva a iniciar sesión: la autorización vive en el estado del sistema, no dentro del token.',
        'El motor de conocimiento agrega datos clínicos para consulta estadística y descarta cualquier resultado que se apoye en menos de cinco pacientes distintos. La supresión ocurre dentro de la propia consulta, así que el recuento pequeño nunca llega a formar parte de la respuesta: es la defensa contra la re-identificación por cruce de agregados.',
        'La información de salud se cifra con AES-256-GCM, con IV aleatorio en cada operación y clave derivada por tenant. Un volcado de la base sin las claves no es aprovechable, y comprometer un tenant no arrastra al resto.',
        'Auditoría de seguridad antes de darlo por terminado, no después: reglas Semgrep propias validadas primero contra código deliberadamente vulnerable (una regla que nunca se ha visto fallar en rojo no demuestra nada), sqlmap contra la instancia real, y un hallazgo de severidad alta corregido y documentado con evidencia.',
      ],
      en: [
        'Multi-tenant isolation by schema: each institution lives in its own PostgreSQL schema, and the service filter goes inside the query WHERE clause, not applied to rows already fetched into memory. The distinction is not stylistic: filtering afterwards means the data already left the database.',
        'A specialist’s permission over a patient comes from a referral and is revalidated on every request. The same JWT answers 200 while the referral is open and 403 the moment it closes, with no re-login: authorization lives in the state of the system, not inside the token.',
        'The knowledge engine aggregates clinical data for statistical queries and drops any result resting on fewer than five distinct patients. The suppression happens inside the query itself, so the small count never becomes part of the response: it is the defence against re-identification by cross-referencing aggregates.',
        'Health information is encrypted with AES-256-GCM, with a random IV per operation and a key derived per tenant. A database dump without the keys is not usable, and compromising one tenant does not drag the rest with it.',
        'Security audit before calling it done, not after: custom Semgrep rules validated first against deliberately vulnerable code (a rule never seen failing in red proves nothing), sqlmap against the real instance, and one high severity finding fixed and documented with evidence.',
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
    id: 'tributary',
    name: 'Tributary',
    kicker: {
      es: 'Motor de facturación electrónica multi-régimen, implementación de referencia',
      en: 'Multi-regime e-invoicing engine, reference implementation',
    },
    // Fuente: README y docs/portfolio.md de github.com/Luisceron0/Tributary.
    problem: {
      es: 'Una sola venta transfronteriza genera obligaciones fiscales en países cuyos modelos técnicos son incompatibles entre sí: Colombia valida la factura ante la DIAN antes de que exista legalmente, España exige una cadena de registros enlazados por hash que custodia el emisor, y Alemania exige un documento estructurado que se entrega al comprador. Lo habitual es modelar el dominio según el primer régimen que se implementó y tratar los demás como casos especiales, y el segundo régimen siempre delata cuál fue el primero. Es una implementación de referencia contra especificaciones públicas: no está certificada bajo ningún régimen ni sirve para emitir en producción, y eso lo dice el propio repositorio antes de que nadie pregunte.',
      en: 'A single cross-border sale creates tax obligations in countries whose technical models are incompatible with each other: Colombia clears the invoice with the tax authority before it legally exists, Spain requires a hash-chained record kept by the issuer, and Germany requires a structured document handed to the buyer. The usual outcome is a domain modelled after whichever regime was built first, with the rest bolted on as special cases, and the second regime always reveals which one that was. This is a reference implementation built against public specifications: it is not certified under any regime and cannot be used to issue in production, and the repository itself says so before anyone asks.',
    },
    stack: ['Java 21', 'Spring Boot', 'PostgreSQL 16', 'Flyway', 'React 19', 'Testcontainers', 'Docker'],
    security: {
      es: 'Que un registro fiscal no se pueda alterar es una garantía de la base de datos, no una promesa de la aplicación. Un trigger de PostgreSQL rechaza cualquier UPDATE y cualquier DELETE sobre los registros fiscales y sobre la bitácora de auditoría, así que la regla se cumple igual ante una sesión de psql con credenciales válidas y cero código de aplicación por medio: una corrección es una fila nueva que referencia a la anterior, nunca una edición. Y si alguien con permiso para desactivar el trigger lo desactiva y altera una fila igualmente, el verificador del propio sistema recalcula la cadena de hashes y nombra el registro exacto donde deja de cuadrar, que es lo que muestra la captura.',
      en: 'That a fiscal record cannot be altered is a database guarantee, not an application promise. A PostgreSQL trigger rejects every UPDATE and every DELETE on fiscal records and on the audit log, so the rule holds even against a psql session with valid credentials and zero application code in the path: a correction is a new row referencing the previous one, never an edit. And if someone with the privilege to disable the trigger disables it and tampers with a row anyway, the system’s own verifier recomputes the hash chain and names the exact record where it stops matching, which is what the screenshot shows.',
    },
    highlights: {
      es: [
        'El hecho de negocio se modela una sola vez sobre EN 16931, la norma europea de facturación, incluso para el régimen colombiano que no la exige. Cada país es un adaptador delgado en el borde, así que añadir un cuarto régimen es escribir un adaptador contra un puerto que ya existe, no tocar el modelo del que dependen los otros tres. ArchUnit rompe la compilación si el dominio llega a importar Spring, Jackson o JDBC.',
        'Idempotencia por clave determinista derivada de la propia venta, con una consulta de reconciliación obligatoria antes de cualquier reintento. Una respuesta perdida después de una emisión real no se arregla reintentando (duplica un documento legal) ni dejando de reintentar (pierde uno legítimo). Verificado matando el proceso a mitad de una emisión contra el sandbox real y comprobando al reiniciar que existe exactamente un documento.',
        'Crypto-shredding para conciliar dos obligaciones que se contradicen sobre la misma fila, el borrado del RGPD y la retención fiscal: los datos personales se cifran con una clave por titular, y borrar destruye la clave, no la fila. El registro fiscal sigue íntegro y verificable, y el dato personal queda como texto cifrado irrecuperable.',
        'El adaptador español construye y encadena los registros y genera el QR del RD 1007/2023, pero no remite nada a la AEAT, porque eso exige un certificado cualificado que este proyecto no tiene. El QR apunta al verificador del propio sistema, y un test comprueba que ningún host de la AEAT aparece jamás en el QR generado: nada de lo que produce el sistema afirma un envío que no ocurrió.',
        'Trece controles de seguridad, cada uno con su herramienta, su comando y un criterio binario de aprobado o fallado: sqlmap contra una instancia real, XXE rechazado en el único sitio del proyecto donde se instancia un parser de XML, tokens con alg none y tokens HS256 firmados con los bytes de la clave pública RSA rechazados con 401, y el validador oficial alemán anclado por checksum antes de desempaquetarlo. En CI son cuatro gates independientes, incluido gitleaks sobre todo el historial y no solo sobre el diff.',
        'No hay demo público, y es una decisión registrada, no un cabo suelto: la infraestructura de producción está construida y verificada (Caddy con TLS automático, unidades systemd, rotación de claves programada), simplemente no está corriendo en ningún sitio. Un demo caído o dormido cuando alguien lo abre es peor que un repositorio honesto sobre no tener uno, y el quickstart levanta el stack completo con Docker Compose en menos de tres minutos.',
      ],
      en: [
        'The business fact is modelled once on EN 16931, the European invoicing standard, even for the Colombian regime, which does not require it. Each country is a thin adapter at the edge, so adding a fourth regime means writing an adapter against a port that already exists, not touching the model the other three depend on. ArchUnit fails the build if the domain ever imports Spring, Jackson or JDBC.',
        'Idempotency through a deterministic key derived from the sale itself, with a mandatory reconciliation query before any retry. A response lost after a real issuance cannot be fixed by retrying (it duplicates a legal document) or by not retrying (it loses a legitimate one). Verified by killing the process mid-issuance against the real sandbox and confirming on restart that exactly one document exists.',
        'Crypto-shredding to reconcile two obligations that contradict each other on the same row, GDPR erasure and fiscal retention: personal data is encrypted under a per-subject key, and erasing destroys the key, not the row. The fiscal record stays intact and verifiable, and the personal data becomes unrecoverable ciphertext.',
        'The Spanish adapter builds and chains the records and generates the regulator’s QR code, but submits nothing to the tax authority, because that requires a qualified certificate this project does not hold. The QR points at the system’s own verifier, and a test asserts that no tax-authority hostname ever appears in the generated QR: nothing the system produces claims a submission that did not happen.',
        'Thirteen security controls, each with its tool, its command and a binary pass or fail criterion: sqlmap against a real running instance, XXE rejected in the single place in the project where an XML parser is instantiated, alg none tokens and HS256 tokens signed with the RSA public key’s own bytes both rejected with 401, and the official German validator pinned by checksum before it is ever unpacked. In CI that is four independent gates, including gitleaks across the full history and not just the diff.',
        'There is no public demo, and that is a recorded decision rather than a loose end: the production infrastructure is built and verified (Caddy with automatic TLS, systemd units, scheduled key rotation), it is simply not running anywhere. A demo that is down or cold-starting when someone opens it is worse than a repository that is honest about not having one, and the quickstart brings the whole stack up with Docker Compose in under three minutes.',
      ],
    },
    screenshot: {
      // Del repo público de Tributary (docs/evidence/chain-broken.png). Es la
      // única captura del sitio que no mide 1280x577, y por eso declara su
      // tamaño: recortarla al formato de las demás cortaba la evidencia.
      src: '/proyectos/tributary.png',
      width: 1280,
      height: 1000,
      alt: {
        es: 'Interfaz de Tributary verificando una cadena fiscal: el resultado es BROKEN, nombra el registro roto y muestra el hash almacenado junto al recalculado.',
        en: 'Tributary interface verifying a fiscal chain: the result is BROKEN, it names the broken record and shows the stored hash next to the recomputed one.',
      },
    },
    links: [
      {
        label: {
          es: 'Leer el resumen técnico',
          en: 'Read the technical writeup',
        },
        href: 'https://github.com/Luisceron0/Tributary/blob/main/docs/portfolio.md',
      },
      {
        label: { es: 'Código en GitHub', en: 'Code on GitHub' },
        href: 'https://github.com/Luisceron0/Tributary',
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
      es: 'Una agencia necesita captar clientes y poder editar el contenido de su propio sitio (paquetes, proyectos, equipo) sin llamar a un desarrollador por cada cambio de texto. El reto real no es el panel de administración: es dar esa autonomía sin que el panel se convierta en la puerta de entrada más fácil al sitio.',
      en: 'An agency needs to capture clients and edit its own site content (packages, projects, team) without calling a developer for every copy change. The real challenge is not the admin panel: it is granting that autonomy without turning the panel into the easiest way into the site.',
    },
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel'],
    security: {
      es: 'Las tablas de Supabase van con Row Level Security activada y sin una sola policy para el rol anónimo ni para el autenticado. Eso es deny-by-default de verdad, y no una lista de permisos con huecos: lo que no está explícitamente concedido, no existe. Todo el acceso a datos pasa por el servidor, así que la clave pública que viaja al navegador no abre nada, porque no hay ninguna policy que la habilite.',
      en: 'The Supabase tables run with Row Level Security enabled and not a single policy for the anonymous or the authenticated role. That is deny-by-default in the real sense, not an allow list with gaps: what is not explicitly granted does not exist. All data access goes through the server, so the public key shipped to the browser opens nothing, because no policy enables it.',
    },
    highlights: {
      es: [
        'Panel de administración multi-cuenta: las altas y las bajas se gestionan desde la propia interfaz, sin entrar a la base de datos a mano ni compartir un usuario único entre varias personas.',
        'La semilla de sesión del panel es un secreto propio y dedicado, no reutilizado de otra parte del sistema. El arranque avisa de forma explícita si quedan credenciales antiguas activas, en lugar de dejarlas pasar en silencio, que es como sobreviven durante meses.',
        'Paquetes, proyectos y la sección de equipo son contenido editable desde el panel: cambiar un precio o añadir un caso no exige un despliegue ni un desarrollador disponible.',
        'Las solicitudes de contacto y de diagnóstico caen en una bandeja con estado revisable, así que ningún posible cliente depende de que alguien vigile una casilla de correo.',
      ],
      en: [
        'Multi-account admin panel: accounts are created and deactivated from the interface itself, without touching the database by hand or sharing one login between several people.',
        'The panel’s session seed is its own dedicated secret, not reused from elsewhere in the system. Startup warns explicitly if old credentials are still active, instead of letting them through in silence, which is how they survive for months.',
        'Packages, projects and the team section are content editable from the panel: changing a price or adding a case study needs neither a deploy nor an available developer.',
        'Contact and diagnostic requests land in an inbox with reviewable status, so no prospective client depends on somebody watching a mailbox.',
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
      es: 'Captar la lista de espera de un lanzamiento con un formulario público, que es exactamente el tipo de endpoint que los bots encuentran solos. Sin control, se convierte en dos problemas a la vez: una lista llena de direcciones basura que ya no sirve para medir interés, y una vía barata para inundar la bandeja del equipo.',
      en: 'Capture the waitlist for a launch through a public form, which is exactly the kind of endpoint bots find on their own. Left uncontrolled it becomes two problems at once: a list full of junk addresses that no longer measures interest, and a cheap way to flood the team inbox.',
    },
    stack: ['Astro 7', 'React', 'TypeScript', 'Neon Postgres', 'Resend', 'Upstash', 'Turnstile'],
    security: {
      es: 'El envío queda bloqueado hasta que Cloudflare Turnstile confirma que hay una persona detrás, y el servidor vuelve a verificar ese token aunque el cliente afirme que todo está en orden: el navegador no es una fuente de verdad. Es el mismo patrón fail-closed que reutilicé en el formulario de este sitio, y llegó aquí después de corregir una condición de carrera real en la que el botón se podía pulsar antes de que el token existiera.',
      en: 'Submission stays blocked until Cloudflare Turnstile confirms there is a person behind it, and the server verifies that token again even when the client claims everything is fine: the browser is not a source of truth. It is the same fail-closed pattern I reused in this site’s contact form, and it got here after fixing a real race condition where the button could be pressed before the token existed.',
    },
    highlights: {
      es: [
        'Validación en servidor y confirmación por token: una dirección no cuenta como suscrita hasta que su dueño la confirma, así que nadie puede apuntar a terceros a la lista.',
        'Límite de envíos por IP con Upstash. La IP se guarda con hash y nunca en claro: sirve para contar intentos sin convertir el control antiabuso en un registro de quién visitó la página.',
        'El contenido de las secciones se gestiona desde un CMS, de modo que una corrección de texto no necesita pasar por un despliegue.',
        'Cobertura con Vitest y Playwright que incluye los caminos que suelen quedarse sin probar precisamente por ser los de fallo: el del bot detectado y el del límite de envíos alcanzado.',
      ],
      en: [
        'Server-side validation and token confirmation: an address does not count as subscribed until its owner confirms it, so nobody can sign someone else up.',
        'Per-IP rate limiting with Upstash. The IP is stored hashed and never in plain text: it serves to count attempts without turning the anti-abuse control into a log of who visited the page.',
        'Section content is managed from a CMS, so a copy fix does not have to go through a deploy.',
        'Covered by Vitest and Playwright, including the paths that usually go untested precisely because they are the failure ones: bot detected and rate limit reached.',
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
      es: 'Mostrar un catálogo completo en dos idiomas con un flujo de compra realista de principio a fin, pero sin cobrar un solo pago real ni quedarse con los datos de nadie. La exigencia está en esa mezcla: tiene que comportarse como una tienda de verdad, no limitarse a parecerlo, y a la vez no crear ninguna obligación de custodiar información personal.',
      en: 'Show a complete catalogue in two languages with a realistic end to end purchase flow, while charging no real payment and keeping nobody’s data. The demand is in that mix: it has to behave like a real store rather than merely look like one, and at the same time create no obligation to safeguard personal information.',
    },
    stack: ['Astro', 'TypeScript', 'Content Collections', 'PostgreSQL', 'Vitest', 'Vercel'],
    security: {
      es: 'El precio se recalcula en el servidor a partir del catálogo: lo que llega desde el carrito del navegador se trata como una propuesta, nunca como un dato de confianza. Es el fallo clásico de una tienda, y no se evita validando mejor en el cliente sino no confiando en él. El carrito es anónimo y de sesión, y hay una vía explícita de borrado de datos en vez de dejar la retención al azar.',
      en: 'The price is recalculated on the server from the catalogue: whatever arrives from the browser cart is treated as a proposal, never as trusted data. This is the classic storefront flaw, and it is not avoided by validating better on the client but by not trusting it at all. The cart is anonymous and session based, and there is an explicit data erasure path instead of leaving retention to chance.',
    },
    highlights: {
      es: [
        'Catálogo bilingüe (español e inglés) con páginas de producto y selección de variantes, generado desde una única fuente de contenido: las dos versiones no pueden desincronizarse porque no son dos textos distintos que alguien tenga que mantener a la par.',
        'Simulación de checkout de principio a fin con validación de precios en servidor. No se procesa ningún pago real, y eso se dice en la interfaz en lugar de esconderse.',
        'SEO completo: sitemap, robots.txt, datos estructurados JSON-LD y metadatos por página.',
        'Cabeceras de seguridad y CSP definidas explícitamente para el despliegue en Vercel, no heredadas de los valores por defecto de la plataforma.',
      ],
      en: [
        'Bilingual catalogue (Spanish and English) with product pages and variant selection, generated from a single content source: the two versions cannot drift apart because they are not two separate texts someone has to keep in step.',
        'End to end checkout simulation with server-side price validation. No real payment is processed, and the interface says so instead of hiding it.',
        'Full SEO: sitemap, robots.txt, JSON-LD structured data and per-page metadata.',
        'Security headers and CSP defined explicitly for the Vercel deployment, not inherited from the platform defaults.',
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
        es: ['Java', 'Python', 'C#', 'C++', 'JavaScript', 'TypeScript', 'Dart', 'HTML5', 'CSS3'],
        en: ['Java', 'Python', 'C#', 'C++', 'JavaScript', 'TypeScript', 'Dart', 'HTML5', 'CSS3'],
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
          'Django',
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
          'Django',
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
          'Pruebas de penetración',
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
          'Penetration testing',
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
