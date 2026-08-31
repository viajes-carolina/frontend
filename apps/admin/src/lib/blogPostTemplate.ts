import type { BlogCategoryDTO, TravelAdvisorDTO } from "@vc/api-client";
import type { FormFeedbackState } from "@vc/ui";
import {
  describe,
  describedLine,
  emptyReport,
  foldForCompare,
  missingFrontMatterFeedback,
  parseTemplateFile,
  summarizeTemplateReport,
  toBoolean,
  toNumber,
  type TemplateApplyReport,
} from "./mdTemplate";

/* ==========================================================================
   El artículo como archivo .md.

   Portada con los metadatos y, debajo, el cuerpo en Markdown **literal**.

   Aquí no se puede repartir el texto por encabezados `##` como en la promoción:
   el cuerpo de un artículo contiene sus propios `## Subtítulo` y el primero
   partiría el archivo por la mitad. Por eso la regla es simple y a prueba de
   contenido: todo lo que sigue al `---` de cierre es el cuerpo, tal cual.

   La imagen de portada no viaja en el archivo: se elige en el panel.
   ========================================================================== */

const KEYS = {
  title: "titulo",
  slug: "slug",
  summary: "resumen",
  category: "categoria",
  author: "autora",
  status: "estado",
  featured: "destacado",
  published: "publicado",
  readingTime: "minutos_lectura",
  tags: "etiquetas",
} as const;

const KNOWN_KEYS = Object.values(KEYS);

/* ── Texto de la plantilla ────────────────────────────────────────────────────
   Cada campo lleva su explicación en líneas `#`, que el lector ignora. Las dos
   que se resuelven por nombre — categoría y autora — enumeran además los
   valores que existen ahora mismo, porque son los únicos dos campos que no se
   pueden adivinar: cualquier otro nombre se rechaza y hay que elegirlo a mano.
   ──────────────────────────────────────────────────────────────────────────── */

const HEADER = [
  "Plantilla de artículo · Viajes Carolina",
  "",
  "Cómo se rellena:",
  "  · Escribe cada valor después de los dos puntos, en la misma línea.",
  "  · No cambies los nombres de la izquierda ni borres las líneas «---».",
  "  · Las líneas que empiezan por # son explicaciones y se ignoran al subir.",
  "  · Lo que dejes vacío NO se toca: al corregir un artículo que ya existe,",
  "    un campo en blanco conserva el valor que ya tenía.",
  "  · El cuerpo del artículo va DEBAJO del segundo «---».",
  "  · La imagen de portada no se pone aquí: se elige en el panel al subir esto.",
  "",
  "CAMPOS OBLIGATORIOS: titulo, resumen, categoria, autora y el cuerpo.",
];

const FIELD_HELP = {
  title: [
    "OBLIGATORIO · Titular del artículo, tal como se leerá en el blog.",
    "Ejemplo: Guía completa para viajar a Cartagena en 2026",
  ],
  slug: [
    "Opcional al crear: si se deja vacío se genera a partir del título.",
    "Es la dirección pública (/blog/<slug>). En un artículo YA PUBLICADO no",
    "conviene cambiarlo: los enlaces compartidos dejarían de funcionar.",
    "Solo minúsculas, números y guiones, sin tildes ni espacios.",
  ],
  summary: [
    "OBLIGATORIO · Una o dos frases en UNA SOLA LÍNEA. Es lo que se lee en las",
    "tarjetas del blog y lo que aparece al compartir el enlace en redes.",
  ],
  status: [
    "Publicado, Borrador o Archivado. Exactamente una de esas tres palabras.",
    "Borrador se guarda sin salir en el sitio; Archivado lo retira del listado.",
  ],
  featured: [
    "si o no · «si» lo coloca como artículo destacado en la portada del blog.",
  ],
  published: [
    "si o no · Con «no» el artículo no se ve en el sitio público, aunque su",
    "estado sea Publicado. Es el interruptor rápido para retirarlo.",
  ],
  readingTime: ["Número entero de minutos, entre 1 y 60. Se muestra junto al titular."],
  tags: [
    "Separadas por coma. Se usan para filtrar dentro del blog.",
    "Ejemplo: Cartagena, Caribe, Playas",
  ],
} as const;

/**
 * La ayuda del cuerpo va en la CABECERA, no encima del cuerpo.
 *
 * El cuerpo se lee literal —es Markdown y sus `#` son titulares de verdad—, así
 * que unas líneas de ayuda ahí abajo se guardarían como parte del artículo y
 * habría que acordarse de borrarlas. Explicado desde la cabecera, que sí se
 * ignora al leer, no hay nada que limpiar.
 */
const BODY_HELP = [
  "",
  "EL CUERPO DEL ARTÍCULO · todo lo que va debajo del segundo «---».",
  "Es Markdown libre y se guarda tal cual, incluidos sus propios # y ##:",
  "  ## Subtítulo        para cada sección",
  "  **negrita**   *cursiva*",
  "  - viñeta      1. lista numerada",
  "  > cita de un cliente o de la asesora",
  "  ---           separador entre bloques",
  "",
  "Imágenes dentro del texto: ![](/media/archivo.webp), pero el archivo debe",
  "existir ya en la biblioteca del panel. No inventes rutas: si no sabes cuáles",
  "hay, deja el hueco y añade la imagen desde el panel.",
];

const EMPTY_BODY_HINT =
  "Escribe aquí la entradilla, y después las secciones con ## Subtítulo.";

/* ── Estado de publicación ────────────────────────────────────────────────────
   El formulario guarda el valor del backend (`PUBLISHED`); la plantilla enseña
   la palabra en español. La tabla traduce en los dos sentidos.
   ──────────────────────────────────────────────────────────────────────────── */

const STATUS_TO_SPANISH: Record<string, string> = {
  PUBLISHED: "Publicado",
  DRAFT: "Borrador",
  ARCHIVED: "Archivado",
};

const SPANISH_TO_STATUS: Record<string, string> = {
  publicado: "PUBLISHED",
  borrador: "DRAFT",
  archivado: "ARCHIVED",
};

/** Campos del formulario de artículo que una plantilla puede rellenar. */
export interface BlogPostTemplateDraft {
  title?: string;
  slug?: string;
  summary?: string;
  categoryId?: number;
  authorAdvisorId?: number;
  status?: string;
  isFeatured?: boolean;
  active?: boolean;
  readingTimeMinutes?: number;
  tagsInput?: string;
  contentMarkdown?: string;
}

export interface BlogPostTemplateParseResult {
  draft: BlogPostTemplateDraft;
  feedback: FormFeedbackState;
}

/** Lo que hay que volcar al archivo: el estado actual del formulario. */
export interface BlogPostTemplateSource {
  title: string;
  slug: string;
  summary: string;
  categoryId: number;
  authorAdvisorId?: number;
  status: string;
  isFeatured: boolean;
  active: boolean;
  readingTimeMinutes: number;
  tagsInput: string;
  contentMarkdown: string;
}

/* ── Escribir ─────────────────────────────────────────────────────────────── */

export function serializeBlogPostTemplate(
  post: BlogPostTemplateSource,
  categories: readonly BlogCategoryDTO[],
  advisors: readonly TravelAdvisorDTO[]
): string {
  /* Se escriben los NOMBRES, no los ids: el archivo lo lee una persona, y un
     «categoria: 3» no le dice nada ni le deja elegir otra con criterio. */
  const categoryName = categories.find((c) => c.id === post.categoryId)?.name ?? "";
  const authorName = advisors.find((a) => a.id === post.authorAdvisorId)?.fullName ?? "";

  /* Los dos únicos campos que no se pueden adivinar se enumeran con los valores
     que existen ahora: cualquier otro nombre se rechaza al subir. */
  const categoryHelp = [
    "OBLIGATORIO · Escribe el nombre exacto de una de estas categorías",
    "(no distingue mayúsculas ni tildes):",
    ...categories.filter((c) => c.active).map((c) => `  · ${c.name}`),
  ];

  const authorHelp = [
    "OBLIGATORIO · Nombre completo de la asesora que firma. Una de estas:",
    ...advisors.filter((a) => a.active).map((a) => `  · ${a.fullName}`),
  ];

  const frontMatter = [
    describe([...HEADER, ...BODY_HELP]),
    describedLine(FIELD_HELP.title, KEYS.title, post.title),
    describedLine(FIELD_HELP.slug, KEYS.slug, post.slug),
    describedLine(FIELD_HELP.summary, KEYS.summary, post.summary),
    describedLine(categoryHelp, KEYS.category, categoryName),
    describedLine(authorHelp, KEYS.author, authorName),
    describedLine(FIELD_HELP.status, KEYS.status, STATUS_TO_SPANISH[post.status] ?? post.status),
    describedLine(FIELD_HELP.featured, KEYS.featured, post.isFeatured ? "si" : "no"),
    describedLine(FIELD_HELP.published, KEYS.published, post.active ? "si" : "no"),
    describedLine(FIELD_HELP.readingTime, KEYS.readingTime, post.readingTimeMinutes),
    describedLine(FIELD_HELP.tags, KEYS.tags, post.tagsInput),
  ].join("\n\n");

  const body = post.contentMarkdown.trim() || EMPTY_BODY_HINT;

  return `---\n${frontMatter}\n---\n\n${body}\n`;
}

/** `articulo-guia-de-cartagena.md`, o `articulo-nuevo.md` al crear. */
export function blogPostTemplateFilename(slug: string, title: string): string {
  const source = slug.trim() || title;
  const clean = source
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
  return clean ? `articulo-${clean}.md` : "articulo-nuevo.md";
}

/* ── Leer ─────────────────────────────────────────────────────────────────── */

export function parseBlogPostTemplate(
  raw: string,
  categories: readonly BlogCategoryDTO[],
  advisors: readonly TravelAdvisorDTO[]
): BlogPostTemplateParseResult {
  const file = parseTemplateFile(raw, KNOWN_KEYS);

  if (!file.hasFrontMatter) {
    return { draft: {}, feedback: missingFrontMatterFeedback() };
  }

  const draft: BlogPostTemplateDraft = {};
  const report: TemplateApplyReport = emptyReport();
  report.unknownKeys.push(...file.unknownKeys);
  report.problems.push(...file.malformedLines.map((line) => `«${line}» no es «clave: valor»`));

  const text = (key: string): string | undefined => {
    const value = file.frontMatter.get(key);
    return value && value.trim() !== "" ? value.trim() : undefined;
  };

  const assignText = (key: string, label: string, apply: (value: string) => void) => {
    const value = text(key);
    if (value === undefined) return;
    apply(value);
    report.applied.push(label);
  };

  assignText(KEYS.title, "título", (v) => (draft.title = v));
  assignText(KEYS.slug, "slug", (v) => (draft.slug = v));
  assignText(KEYS.summary, "resumen", (v) => (draft.summary = v));
  assignText(KEYS.tags, "etiquetas", (v) => (draft.tagsInput = v));

  /* Categoría y autora: se buscan por nombre. Si no hay coincidencia se avisa
     y el <select> se queda como estaba — nunca se inventa un id. */
  const categoryRaw = text(KEYS.category);
  if (categoryRaw !== undefined) {
    const match = categories.find((c) => foldForCompare(c.name) === foldForCompare(categoryRaw));
    if (match) {
      draft.categoryId = match.id;
      report.applied.push("categoría");
    } else {
      report.problems.push(`no se reconoció la categoría «${categoryRaw}»: elígela a mano`);
    }
  }

  const authorRaw = text(KEYS.author);
  if (authorRaw !== undefined) {
    const match = advisors.find((a) => foldForCompare(a.fullName) === foldForCompare(authorRaw));
    if (match) {
      draft.authorAdvisorId = match.id;
      report.applied.push("autora");
    } else {
      report.problems.push(`no se reconoció la autora «${authorRaw}»: elígela a mano`);
    }
  }

  const statusRaw = text(KEYS.status);
  if (statusRaw !== undefined) {
    const mapped = SPANISH_TO_STATUS[foldForCompare(statusRaw)];
    if (mapped) {
      draft.status = mapped;
      report.applied.push("estado");
    } else {
      report.problems.push(
        `«${KEYS.status}: ${statusRaw}» no es Publicado, Borrador ni Archivado`
      );
    }
  }

  const assignBoolean = (key: string, label: string, apply: (value: boolean) => void) => {
    const value = text(key);
    if (value === undefined) return;
    const converted = toBoolean(value, key);
    if (!converted.ok) {
      report.problems.push(converted.reason);
      return;
    }
    apply(converted.value);
    report.applied.push(label);
  };

  assignBoolean(KEYS.featured, "destacado", (v) => (draft.isFeatured = v));
  assignBoolean(KEYS.published, "publicado", (v) => (draft.active = v));

  const readingRaw = text(KEYS.readingTime);
  if (readingRaw !== undefined) {
    const converted = toNumber(readingRaw, KEYS.readingTime);
    if (!converted.ok) {
      report.problems.push(converted.reason);
    } else {
      draft.readingTimeMinutes = converted.value;
      report.applied.push("minutos de lectura");
    }
  }

  /* El cuerpo: literal, con sus propios `##` intactos. */
  const body = file.body.trim();
  if (body && body !== EMPTY_BODY_HINT) {
    draft.contentMarkdown = body;
    report.applied.push("cuerpo del artículo");
  }

  return { draft, feedback: summarizeTemplateReport(report) };
}
