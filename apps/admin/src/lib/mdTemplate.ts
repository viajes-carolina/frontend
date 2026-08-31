import type { FormFeedbackState } from "@vc/ui";

/* ==========================================================================
   Mecanismo común de las plantillas .md.

   Lee y escribe archivos con una portada de metadatos entre `---` y texto
   debajo. Sin React, sin `fetch` y sin conocer ni promociones ni artículos:
   eso vive en `promotionTemplate.ts` y `blogPostTemplate.ts`.

   El archivo vuelve de un editor de escritorio, así que aquí se asume lo peor
   del mundo real: BOM del Bloc de notas, saltos CRLF, tildes, valores a medio
   escribir y claves que alguien renombró.
   ========================================================================== */

/* ── Normalización ────────────────────────────────────────────────────────── */

/**
 * Deja el texto en condiciones de ser leído línea a línea.
 *
 * El BOM (U+FEFF) es el detalle que rompe esto en silencio: el Bloc de notas y
 * Word guardan UTF-8 con esa marca invisible delante, así que la primera clave
 * del archivo deja de casar con `titulo` y el usuario ve "no se reconoció
 * ninguna línea" sin ninguna pista de por qué. Se quita antes de nada.
 *
 * Se compara con `String.fromCharCode` y no con el carácter escrito literal:
 * literal es invisible en el editor y `no-irregular-whitespace` lo rechaza,
 * con razón.
 */
const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);

export function normalizeTemplateText(raw: string): string {
  const withoutBom = raw.startsWith(BYTE_ORDER_MARK) ? raw.slice(1) : raw;
  return withoutBom.replace(/\r\n?/g, "\n");
}

/* ── Estructura del archivo ───────────────────────────────────────────────── */

export interface ParsedTemplateFile {
  /** Pares `clave: valor` de la portada, con la clave en minúsculas. */
  frontMatter: Map<string, string>;
  /** Claves de la portada que no esperaba quien lee el archivo. */
  unknownKeys: string[];
  /** Líneas de la portada que no eran `clave: valor` ni comentario. */
  malformedLines: string[];
  /** Todo lo que sigue al `---` de cierre, literal. */
  body: string;
  /** `false` si el archivo no traía portada: casi siempre, archivo equivocado. */
  hasFrontMatter: boolean;
}

const FRONT_MATTER_DELIMITER = "---";

/**
 * Parte el archivo en portada y cuerpo.
 *
 * `knownKeys` no filtra: sirve para separar las claves que quien lee entiende
 * de las que no, y poder informar de estas últimas en vez de tragárselas.
 */
export function parseTemplateFile(raw: string, knownKeys: readonly string[]): ParsedTemplateFile {
  const text = normalizeTemplateText(raw);
  const lines = text.split("\n");

  const frontMatter = new Map<string, string>();
  const unknownKeys: string[] = [];
  const malformedLines: string[] = [];

  let cursor = 0;
  while (cursor < lines.length && lines[cursor].trim() === "") cursor += 1;

  if (lines[cursor]?.trim() !== FRONT_MATTER_DELIMITER) {
    return { frontMatter, unknownKeys, malformedLines, body: text, hasFrontMatter: false };
  }

  cursor += 1;
  const known = new Set(knownKeys);

  while (cursor < lines.length && lines[cursor].trim() !== FRONT_MATTER_DELIMITER) {
    const line = lines[cursor];
    cursor += 1;

    const trimmed = line.trim();
    // Las líneas de instrucciones de la propia plantilla empiezan por `#`.
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) {
      malformedLines.push(trimmed);
      continue;
    }

    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (key === "") {
      malformedLines.push(trimmed);
      continue;
    }
    if (!known.has(key)) {
      unknownKeys.push(key);
      continue;
    }
    frontMatter.set(key, value);
  }

  // `cursor` está en el `---` de cierre, o al final si nunca se cerró.
  const body = lines.slice(cursor + 1).join("\n");
  return { frontMatter, unknownKeys, malformedLines, body, hasFrontMatter: true };
}

/* ── Secciones `## Título` ────────────────────────────────────────────────────
   Solo las usa la plantilla de promoción. En la de artículo NO se puede: el
   cuerpo es Markdown libre y sus propios `## Subtítulo` romperían el reparto,
   por eso allí el cuerpo es todo lo que sigue a la portada, literal.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Reparte el texto por encabezados `##`, con la clave normalizada (minúsculas y
 * sin tildes) para que «## Inclusiones» y «## inclusiones» sean lo mismo.
 */
export function parseSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  let currentKey: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (currentKey !== null) sections.set(currentKey, buffer.join("\n").trim());
    buffer = [];
  };

  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    const heading = /^##\s+(.*)$/.exec(trimmed);
    if (heading) {
      flush();
      currentKey = foldForCompare(heading[1]);
      continue;
    }
    /* Las explicaciones que la plantilla escribe dentro de cada sección son
       líneas `#`. Se descartan para que no acaben dentro del resumen.
       Es seguro porque este reparto solo lo usa la promoción, que no tiene
       Markdown libre: un `#` aquí solo puede ser una explicación nuestra. */
    if (trimmed.startsWith("#")) continue;
    if (currentKey !== null) buffer.push(line);
  }
  flush();

  return sections;
}

/** Lista de una sección: viñetas `-`/`*`, o líneas sueltas por indulgencia. */
export function parseList(sectionText: string | undefined): string[] {
  if (!sectionText) return [];
  return sectionText
    .split("\n")
    .map((line) => line.trim().replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

/* ── Comparación de textos escritos a mano ────────────────────────────────── */

/**
 * Marcas diacríticas sueltas que deja `normalize("NFD")`.
 *
 * Se escribe con la propiedad Unicode en vez del rango habitual porque ese
 * rango, tecleado literal, son caracteres invisibles en el editor.
 */
const DIACRITICS = /\p{M}/gu;

/**
 * Minúsculas y sin tildes, para casar «Guías de destinos» con «guias de
 * destinos». Es lo que permite resolver categoría y autora por nombre sin
 * exigir que se escriban clavadas.
 */
export function foldForCompare(value: string): string {
  return value.trim().toLowerCase().normalize("NFD").replace(DIACRITICS, "");
}

/* ── Conversores ──────────────────────────────────────────────────────────────
   Devuelven el valor o el motivo del fallo, nunca `NaN` ni un silencio. Quien
   llama decide si eso es un problema que informar.
   ──────────────────────────────────────────────────────────────────────────── */

export type Converted<T> = { ok: true; value: T } | { ok: false; reason: string };

export function toNumber(raw: string, label: string): Converted<number> {
  // Se admite «1.590,00» y «1590» pero no «mil quinientos»: el separador de
  // miles se descarta y la coma decimal se pasa a punto antes de convertir.
  const cleaned = raw.replace(/\s/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
  const parsed = Number(cleaned);
  if (cleaned === "" || !Number.isFinite(parsed)) {
    return { ok: false, reason: `«${label}: ${raw}» no es un número` };
  }
  return { ok: true, value: parsed };
}

/**
 * Devuelve la fecha en el formato que espera `<input type="date">`.
 *
 * Se acepta `31/08/2026` además de `2026-08-31` porque es como la va a escribir
 * quien redacta; y se comprueba que la fecha exista de verdad, para que un
 * `31/02/2026` se informe en vez de convertirse en el 3 de marzo.
 */
export function toIsoDate(raw: string, label: string): Converted<string> {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const dmy = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(raw);

  let year: number, month: number, day: number;
  if (iso) {
    [year, month, day] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
  } else if (dmy) {
    [year, month, day] = [Number(dmy[3]), Number(dmy[2]), Number(dmy[1])];
  } else {
    return { ok: false, reason: `«${label}: ${raw}» no es una fecha (usa 31/08/2026)` };
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  const real =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  if (!real) {
    return { ok: false, reason: `«${label}: ${raw}» no es una fecha que exista` };
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  return { ok: true, value: `${year}-${pad(month)}-${pad(day)}` };
}

/* Sin tildes: `foldForCompare` ya convierte «Sí» en «si» antes de comparar. */
const TRUE_WORDS = new Set(["si", "s", "true", "verdadero", "1"]);
const FALSE_WORDS = new Set(["no", "n", "false", "falso", "0"]);

export function toBoolean(raw: string, label: string): Converted<boolean> {
  const folded = foldForCompare(raw);
  if (TRUE_WORDS.has(folded)) return { ok: true, value: true };
  if (FALSE_WORDS.has(folded)) return { ok: true, value: false };
  return { ok: false, reason: `«${label}: ${raw}» no es sí ni no` };
}

/* ── Escritura ────────────────────────────────────────────────────────────── */

/**
 * Una línea de la portada.
 *
 * Un salto de línea dentro de un valor partiría el archivo en dos claves al
 * releerlo, así que se aplana a espacios. Afecta sobre todo al resumen del
 * artículo, que va en la portada y alguien puede pegar en varias líneas.
 */
export function frontMatterLine(key: string, value: string | number | undefined): string {
  if (value === undefined || value === "") return `${key}:`;
  return `${key}: ${String(value).replace(/\s*\n\s*/g, " ").trim()}`;
}

/**
 * Comentarios que explican el campo que viene justo debajo.
 *
 * Van con `#` porque es lo que la cabecera y las secciones ya ignoran al leer,
 * así que la plantilla puede documentarse a sí misma sin que las explicaciones
 * acaben dentro de un campo.
 */
export function describe(lines: readonly string[]): string {
  return lines.map((line) => `# ${line}`).join("\n");
}

/** Una clave de la cabecera precedida de su explicación. */
export function describedLine(
  description: readonly string[],
  key: string,
  value: string | number | undefined
): string {
  return `${describe(description)}\n${frontMatterLine(key, value)}`;
}

/** Sección `## Título` con su explicación y su contenido. */
export function sectionBlock(
  heading: string,
  content: string,
  description: readonly string[] = []
): string {
  const parts = [`## ${heading}`];
  if (description.length > 0) parts.push(describe(description));
  const body = content.trim();
  if (body) parts.push(body);
  return `${parts.join("\n")}\n`;
}

/** Lista en viñetas; una viñeta vacía cuando no hay elementos, para que se vea dónde escribir. */
export function listBlock(
  heading: string,
  items: readonly string[],
  description: readonly string[] = []
): string {
  const clean = items.map((item) => item.trim()).filter(Boolean);
  const parts = [`## ${heading}`];
  if (description.length > 0) parts.push(describe(description));
  parts.push(clean.length > 0 ? clean.map((item) => `- ${item}`).join("\n") : "-");
  return `${parts.join("\n")}\n`;
}

/* ── Informe de la carga ──────────────────────────────────────────────────── */

/**
 * Qué pasó al aplicar un archivo, campo a campo.
 *
 * Mismo criterio que `summarizeBulkOutcome` en `promotionsCatalog.ts`: nunca
 * dar la carga por buena. Si algo no entró, se dice qué y por qué.
 */
export interface TemplateApplyReport {
  /** Etiquetas de los campos que se rellenaron. */
  applied: string[];
  /** Motivos por los que una línea concreta no se pudo aplicar. */
  problems: string[];
  /** Claves de la portada que no pertenecen a esta plantilla. */
  unknownKeys: string[];
}

export function emptyReport(): TemplateApplyReport {
  return { applied: [], problems: [], unknownKeys: [] };
}

function enumerate(values: readonly string[], max = 4): string {
  const shown = values.slice(0, max);
  const rest = values.length - shown.length;
  return rest > 0 ? `${shown.join(", ")} y ${rest} más` : shown.join(", ");
}

/**
 * Traduce el informe a una sola frase.
 *
 * El tono solo es de éxito cuando no quedó nada pendiente: si una línea no se
 * entendió, el banner es de error aunque se hayan rellenado otros diez campos.
 * Da igual que "9 de 11" suene bien — lo que el usuario necesita saber es que
 * hay dos campos que tiene que mirar a mano.
 */
export function summarizeTemplateReport(report: TemplateApplyReport): FormFeedbackState {
  const { applied, problems, unknownKeys } = report;
  const clean = problems.length === 0 && unknownKeys.length === 0;

  if (applied.length === 0 && clean) {
    return {
      tone: "error",
      message:
        "El archivo se leyó pero venía vacío: no había ningún valor que copiar. Rellena la plantilla y vuelve a subirla.",
    };
  }

  const parts: string[] = [];

  if (applied.length === 0) {
    parts.push("No se pudo rellenar ningún campo.");
  } else if (applied.length === 1) {
    parts.push(`Se rellenó 1 campo: ${applied[0]}.`);
  } else {
    parts.push(`Se rellenaron ${applied.length} campos: ${enumerate(applied, 6)}.`);
  }

  if (problems.length > 0) {
    parts.push(
      problems.length === 1
        ? `Una línea no se pudo aplicar: ${problems[0]}.`
        : `${problems.length} líneas no se pudieron aplicar: ${enumerate(problems)}.`
    );
  }

  if (unknownKeys.length > 0) {
    parts.push(
      unknownKeys.length === 1
        ? `Se ignoró una clave que no pertenece a esta plantilla: ${unknownKeys[0]}.`
        : `Se ignoraron ${unknownKeys.length} claves que no pertenecen a esta plantilla: ${enumerate(unknownKeys)}.`
    );
  }

  return { tone: clean ? "success" : "error", message: parts.join(" ") };
}

/** El archivo no traía portada: casi siempre significa archivo equivocado. */
export function missingFrontMatterFeedback(): FormFeedbackState {
  return {
    tone: "error",
    message:
      "El archivo no tiene la cabecera entre líneas «---», así que no parece una plantilla de Viajes Carolina. Descarga la plantilla, rellénala y vuelve a subirla.",
  };
}
