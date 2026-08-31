import type { FormFeedbackState } from "@vc/ui";
import {
  describe,
  describedLine,
  emptyReport,
  listBlock,
  missingFrontMatterFeedback,
  parseList,
  parseSections,
  parseTemplateFile,
  sectionBlock,
  summarizeTemplateReport,
  toIsoDate,
  toNumber,
  type TemplateApplyReport,
} from "./mdTemplate";
import type { PromotionFormBinding } from "./promotionsCatalog";

/* ==========================================================================
   La promoción como archivo .md.

   Portada con los datos sueltos y, debajo, las cuatro cosas que ocupan varias
   líneas. Aquí los `##` valen como separadores porque una promoción no tiene
   cuerpo libre; en el artículo NO se puede hacer así (ver `blogPostTemplate`).

   La foto destacada no viaja en el archivo: se elige en el panel.
   ========================================================================== */

const KEYS = {
  title: "titulo",
  destination: "destino",
  departureCity: "ciudad_salida",
  priceUsd: "precio_usd",
  pricePen: "precio_pen",
  durationDays: "dias",
  durationNights: "noches",
  validFrom: "vigencia_desde",
  validUntil: "vigencia_hasta",
} as const;

const KNOWN_KEYS = Object.values(KEYS);

const SECTION_SUMMARY = "Resumen";
const SECTION_INCLUSIONS = "Inclusiones";
const SECTION_EXCLUSIONS = "Exclusiones";
const SECTION_WHATSAPP = "Mensaje de WhatsApp";

/** Claves normalizadas de `parseSections` (minúsculas y sin tildes). */
const FOLDED_SECTIONS = {
  summary: "resumen",
  inclusions: "inclusiones",
  exclusions: "exclusiones",
  whatsapp: "mensaje de whatsapp",
} as const;

/* ── Texto de la plantilla ────────────────────────────────────────────────────
   Cada campo va precedido de su explicación en líneas `#`, que el lector
   ignora. El objetivo es que el archivo se pueda rellenar sin tener el panel
   delante y sin preguntar nada: qué es obligatorio, qué formato admite cada
   valor y para qué se usa.
   ──────────────────────────────────────────────────────────────────────────── */

const HEADER = [
  "Plantilla de promoción · Viajes Carolina",
  "",
  "Cómo se rellena:",
  "  · Escribe cada valor después de los dos puntos, en la misma línea.",
  "  · No cambies los nombres de la izquierda ni borres las líneas «---».",
  "  · Las líneas que empiezan por # son explicaciones y se ignoran al subir.",
  "  · Lo que dejes vacío NO se toca: al corregir una promoción que ya existe,",
  "    un campo en blanco conserva el valor que ya tenía.",
  "  · La foto destacada no se pone aquí: se elige en el panel al subir esto.",
  "",
  "CAMPOS OBLIGATORIOS: titulo, destino, precio_usd, dias, noches y Resumen.",
];

const FIELD_HELP = {
  title: [
    "OBLIGATORIO · Nombre comercial del paquete, tal como se leerá en la tarjeta",
    "del Home y en la página pública. Sin comillas.",
    "Ejemplo: Cartagena: Donde el mar te espera",
  ],
  destination: [
    "OBLIGATORIO · Ciudad y país separados por coma. Se muestra bajo el título.",
    "Ejemplo: Cartagena de Indias, Colombia",
  ],
  departureCity: [
    "Opcional · Ciudad desde la que sale el viaje. Si se deja vacío queda «Lima».",
  ],
  priceUsd: [
    "OBLIGATORIO · Precio por persona en dólares. Solo el número, sin «$».",
    "Admite coma decimal y punto de miles: 1.299,50 se lee como 1299.5",
  ],
  pricePen: [
    "Opcional · Precio equivalente en soles. Si se deja vacío, el panel lo estima",
    "solo a partir del precio en dólares.",
  ],
  durationDays: ["OBLIGATORIO · Número entero de días. Mínimo 1."],
  durationNights: [
    "OBLIGATORIO · Número entero de noches. Normalmente es días menos uno.",
  ],
  validFrom: [
    "Opcional · Desde cuándo se puede comprar. Formato 31/08/2026 o 2026-08-31.",
  ],
  validUntil: [
    "Opcional · Hasta cuándo. Pasada esta fecha la promoción se marca «Vencida»",
    "en el panel, pero NO se oculta sola del sitio.",
  ],
} as const;

const SECTION_HELP = {
  summary: [
    "OBLIGATORIO · Dos o tres frases. Es el texto que se lee en la tarjeta del",
    "Home, así que conviene que se entienda suelto, sin el resto de la página.",
  ],
  inclusions: [
    "Una por línea, empezando con guion. Lo que SÍ cubre el precio.",
    "Ejemplo:  - Ticket aéreo Lima - Cartagena - Lima",
  ],
  exclusions: [
    "Una por línea, empezando con guion. Lo que NO cubre el precio, para que",
    "nadie lo dé por incluido.",
  ],
  whatsapp: [
    "Opcional · Mensaje con el que se abre el chat cuando alguien pulsa el botón",
    "de WhatsApp en esta promoción. Se escribe en primera persona, como si lo",
    "mandara quien consulta. Si se deja vacío se usa el mensaje general del sitio.",
  ],
} as const;

/**
 * Lo que una plantilla puede rellenar del formulario.
 *
 * Todo opcional a propósito: una clave ausente o con el valor vacío NO se
 * aplica, y así una plantilla a medio rellenar sobre una promoción que ya
 * existe no borra lo que había.
 */
export interface PromotionTemplateDraft {
  title?: string;
  destination?: string;
  departureCity?: string;
  priceUsd?: number;
  pricePen?: number;
  durationDays?: number;
  durationNights?: number;
  validFrom?: string;
  validUntil?: string;
  summary?: string;
  inclusionsInput?: string;
  exclusionsInput?: string;
  whatsappTemplate?: string;
}

export interface PromotionTemplateParseResult {
  draft: PromotionTemplateDraft;
  feedback: FormFeedbackState;
}

/* ── Escribir ─────────────────────────────────────────────────────────────── */

/**
 * Vuelca el formulario tal como está a un archivo .md.
 *
 * Sirve para los dos casos sin ramificar: al crear, los campos están vacíos y
 * sale la plantilla en blanco con sus instrucciones; al editar, sale la misma
 * plantilla con los valores de la promoción.
 */
export function serializePromotionTemplate(form: PromotionFormBinding): string {
  const frontMatter = [
    describe(HEADER),
    describedLine(FIELD_HELP.title, KEYS.title, form.title),
    describedLine(FIELD_HELP.destination, KEYS.destination, form.destination),
    describedLine(FIELD_HELP.departureCity, KEYS.departureCity, form.departureCity),
    describedLine(FIELD_HELP.priceUsd, KEYS.priceUsd, form.priceUsd),
    describedLine(FIELD_HELP.pricePen, KEYS.pricePen, form.pricePen),
    describedLine(FIELD_HELP.durationDays, KEYS.durationDays, form.durationDays),
    describedLine(FIELD_HELP.durationNights, KEYS.durationNights, form.durationNights),
    describedLine(FIELD_HELP.validFrom, KEYS.validFrom, form.validFrom),
    describedLine(FIELD_HELP.validUntil, KEYS.validUntil, form.validUntil),
  ].join("\n\n");

  const body = [
    sectionBlock(SECTION_SUMMARY, form.summary, SECTION_HELP.summary),
    listBlock(SECTION_INCLUSIONS, form.inclusionsInput.split("\n"), SECTION_HELP.inclusions),
    listBlock(SECTION_EXCLUSIONS, form.exclusionsInput.split("\n"), SECTION_HELP.exclusions),
    sectionBlock(SECTION_WHATSAPP, form.whatsappTemplate, SECTION_HELP.whatsapp),
  ].join("\n");

  return `---\n${frontMatter}\n---\n\n${body}`;
}

/** `promocion-cartagena-donde-el-mar.md`, o `promocion-nueva.md` al crear. */
export function promotionTemplateFilename(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
  return slug ? `promocion-${slug}.md` : "promocion-nueva.md";
}

/* ── Leer ─────────────────────────────────────────────────────────────────── */

export function parsePromotionTemplate(raw: string): PromotionTemplateParseResult {
  const file = parseTemplateFile(raw, KNOWN_KEYS);

  if (!file.hasFrontMatter) {
    return { draft: {}, feedback: missingFrontMatterFeedback() };
  }

  const draft: PromotionTemplateDraft = {};
  const report: TemplateApplyReport = emptyReport();
  report.unknownKeys.push(...file.unknownKeys);
  report.problems.push(...file.malformedLines.map((line) => `«${line}» no es «clave: valor»`));

  const text = (key: string): string | undefined => {
    const value = file.frontMatter.get(key);
    return value && value.trim() !== "" ? value.trim() : undefined;
  };

  /* Texto: entra tal cual. */
  const assignText = (key: string, label: string, apply: (value: string) => void) => {
    const value = text(key);
    if (value === undefined) return;
    apply(value);
    report.applied.push(label);
  };

  assignText(KEYS.title, "título", (v) => (draft.title = v));
  assignText(KEYS.destination, "destino", (v) => (draft.destination = v));
  assignText(KEYS.departureCity, "ciudad de salida", (v) => (draft.departureCity = v));

  /* Números: si no lo son, se informa en vez de meter NaN en el campo. */
  const assignNumber = (key: string, label: string, apply: (value: number) => void) => {
    const value = text(key);
    if (value === undefined) return;
    const converted = toNumber(value, key);
    if (!converted.ok) {
      report.problems.push(converted.reason);
      return;
    }
    apply(converted.value);
    report.applied.push(label);
  };

  assignNumber(KEYS.priceUsd, "precio en dólares", (v) => (draft.priceUsd = v));
  assignNumber(KEYS.pricePen, "precio en soles", (v) => (draft.pricePen = v));
  assignNumber(KEYS.durationDays, "días", (v) => (draft.durationDays = v));
  assignNumber(KEYS.durationNights, "noches", (v) => (draft.durationNights = v));

  /* Fechas: se admite 31/08/2026 y se guarda como espera <input type="date">. */
  const assignDate = (key: string, label: string, apply: (value: string) => void) => {
    const value = text(key);
    if (value === undefined) return;
    const converted = toIsoDate(value, key);
    if (!converted.ok) {
      report.problems.push(converted.reason);
      return;
    }
    apply(converted.value);
    report.applied.push(label);
  };

  assignDate(KEYS.validFrom, "vigencia desde", (v) => (draft.validFrom = v));
  assignDate(KEYS.validUntil, "vigencia hasta", (v) => (draft.validUntil = v));

  /* Secciones del cuerpo. */
  const sections = parseSections(file.body);

  const summary = sections.get(FOLDED_SECTIONS.summary)?.trim();
  if (summary) {
    draft.summary = summary;
    report.applied.push("resumen");
  }

  const inclusions = parseList(sections.get(FOLDED_SECTIONS.inclusions));
  if (inclusions.length > 0) {
    draft.inclusionsInput = inclusions.join("\n");
    report.applied.push("inclusiones");
  }

  const exclusions = parseList(sections.get(FOLDED_SECTIONS.exclusions));
  if (exclusions.length > 0) {
    draft.exclusionsInput = exclusions.join("\n");
    report.applied.push("exclusiones");
  }

  const whatsapp = sections.get(FOLDED_SECTIONS.whatsapp)?.trim();
  if (whatsapp) {
    draft.whatsappTemplate = whatsapp;
    report.applied.push("mensaje de WhatsApp");
  }

  return { draft, feedback: summarizeTemplateReport(report) };
}
