import type {
  AdminPromotionsQuery,
  MediaAssetDTO,
  PromotionDTO,
  PromotionFeaturedFilter,
  PromotionSourceFilter,
  PromotionStatusFilter,
  PromotionsCatalogSummaryDTO,
} from "@vc/api-client";
import type { FormFeedbackState } from "@vc/ui";
import type {
  DataTableServerFilterDefinition,
  ServerDataTableQuery,
} from "../components/table";

/* ==========================================================================
   Reglas puras del catálogo de promociones.

   Todo lo que no es ni estado de React ni JSX: derivación del estado de una
   fila, métricas del resumen, formato de fecha, validación del formulario y el
   resumen honesto de una acción masiva. Sin `fetch`, sin `useState` y sin
   dependencias de React — se puede leer (y probar) de un tirón.
   ========================================================================== */

/**
 * El Home muestra siempre 3 promociones. El backend rechaza con 409 cualquier
 * ocultación que dejara el pool por debajo (`SetPromotionActiveUseCase`,
 * `MIN_ACTIVE_POOL`); esta constante espeja esa regla para poder avisar antes
 * de llamar y para explicar el 409 cuando aun así llega.
 */
export const MIN_ACTIVE_PROMOTIONS = 3;

/**
 * Cuántas promociones visibles hay en TODO el catálogo.
 *
 * Antes se contaba sobre la lista completa que traía el navegador. Con una sola
 * página cargada, contar las visibles de esas 15 daría un número que no dice
 * nada sobre si ocultar una más rompe el mínimo del Home. El resumen del
 * servidor sí cuenta el catálogo entero, y `total - hidden` es exactamente las
 * activas.
 */
export function countActivePromotions(summary: PromotionsCatalogSummaryDTO): number {
  return summary.total - summary.hidden;
}

/* ── Identidad ────────────────────────────────────────────────────────────── */

/** El kit de tabla identifica filas por cadena; el id de la promoción es número. */
export function getPromotionRowId(promo: PromotionDTO): string {
  return String(promo.id);
}

/* ── Lo que ya no se calcula aquí ─────────────────────────────────────────────
   Aquí vivían `sortPromotionsForCatalog`, `resolveTopThreeIds` y
   `computeCatalogMetrics`: el orden por `createdAt` descendente, las 3 activas
   más recientes que el Home pinta y los cuatro contadores del resumen. Los tres
   necesitaban el catálogo ENTERO en memoria.

   Con la lista paginada llegan 15 filas. Ordenarlas volvería a ordenar solo esas
   15; buscar el podio entre ellas pintaría "★ En portada" sobre la más reciente
   de la página 3, que no está en portada; y contar sobre ellas diría "15
   promociones totales" con 32 en la base de datos. Los tres datos pasan al
   servidor: el orden y `featuredInHome` vienen en cada `PromotionDTO`, y los
   contadores en el `summary` de la respuesta, calculado sin filtros.
   ──────────────────────────────────────────────────────────────────────────── */

/* ── Filtros del catálogo ─────────────────────────────────────────────────────
   Los tres filtros del diseño, ahora resueltos en el servidor. El `value` de
   cada opción es LITERALMENTE el que viaja en la URL
   (`?status=VISIBLE&source=FACEBOOK&featured=SI`), así que no hay una tabla de
   traducción que se pueda desincronizar del backend: el filtro y el parámetro
   son la misma cadena. El valor "sin filtrar" es `""` en los tres, y el cliente
   lo omite de la consulta.
   ──────────────────────────────────────────────────────────────────────────── */

/** Solo Visible / Oculta (+ Vencida): una promoción solo tiene `active`. */
const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "VISIBLE", label: "Visibles" },
  { value: "OCULTA", label: "Ocultas" },
  { value: "VENCIDA", label: "Vencidas" },
] as const;

const SOURCE_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "MANUAL", label: "Manual" },
  { value: "FACEBOOK", label: "Facebook" },
] as const;

/* La opción por defecto de "Portada" va con etiqueta vacía a propósito: así el
   disparador se lee "Portada ⌄" mientras no hay valor puesto, tal como lo
   dibuja el diseño, y "Portada: En portada ⌄" en cuanto lo hay. */
const FEATURED_OPTIONS = [
  { value: "", label: "" },
  { value: "SI", label: "En portada" },
  { value: "NO", label: "Fuera de portada" },
] as const;

export const PROMOTION_STATUS_FILTER_ID = "status";
export const PROMOTION_SOURCE_FILTER_ID = "source";
export const PROMOTION_FEATURED_FILTER_ID = "featured";

/**
 * Constante de módulo y no una función que construya el array en cada render:
 * `useServerDataTable` usa `filters` como dependencia de los `useMemo` de los
 * que cuelga la identidad de la consulta, y un array nuevo cada vez sería una
 * petición nueva cada vez. Ya no hay motivo para construirlo — dejó de depender
 * de `topThreeIds`, que era lo que antes lo obligaba a ser una función.
 */
export const PROMOTION_CATALOG_FILTERS: readonly DataTableServerFilterDefinition[] = [
  { id: PROMOTION_STATUS_FILTER_ID, label: "Estado", options: STATUS_OPTIONS },
  { id: PROMOTION_SOURCE_FILTER_ID, label: "Fuente", options: SOURCE_OPTIONS },
  { id: PROMOTION_FEATURED_FILTER_ID, label: "Portada", options: FEATURED_OPTIONS },
];

/** Comprueba contra la lista declarada en vez de castear a ciegas. */
function pickOption<V extends string>(
  value: string | undefined,
  options: readonly { value: string }[]
): V {
  return (options.some((option) => option.value === value) ? value : "") as V;
}

/**
 * Traduce el estado de la tabla al contrato del endpoint. `page` pasa de base 1
 * (lo que pinta la paginación) a base 0 (lo que espera el backend).
 */
export function toAdminPromotionsQuery(query: ServerDataTableQuery): AdminPromotionsQuery {
  return {
    page: query.page - 1,
    size: query.pageSize,
    search: query.search.trim(),
    status: pickOption<PromotionStatusFilter>(
      query.filters[PROMOTION_STATUS_FILTER_ID],
      STATUS_OPTIONS
    ),
    source: pickOption<PromotionSourceFilter>(
      query.filters[PROMOTION_SOURCE_FILTER_ID],
      SOURCE_OPTIONS
    ),
    featured: pickOption<PromotionFeaturedFilter>(
      query.filters[PROMOTION_FEATURED_FILTER_ID],
      FEATURED_OPTIONS
    ),
  };
}

/* ── Estado de una fila ───────────────────────────────────────────────────── */

/**
 * Vencida = su `validUntil` ya pasó.
 *
 * Es independiente de `active`: el backend elige la portada por `createdAt` y
 * no mira la vigencia, así que una promoción puede estar a la vez visible en
 * Inicio y vencida. Por eso la tabla puede pintar dos distintivos en la misma
 * celda en vez de un único estado que ocultaría la mitad de la verdad.
 */
export function isPromotionExpired(promo: PromotionDTO, today: Date = new Date()): boolean {
  if (!promo.validUntil) return false;
  const until = new Date(`${promo.validUntil}T23:59:59`);
  return Number.isFinite(until.getTime()) && until.getTime() < today.getTime();
}

/** "4 días / 3 noches" — con singular cuando toca ("1 día", no "1 días"). */
export function formatDuration(days: number, nights: number): string {
  const d = `${days} ${days === 1 ? "día" : "días"}`;
  const n = `${nights} ${nights === 1 ? "noche" : "noches"}`;
  return `${d} / ${n}`;
}

/* ── Fechas ───────────────────────────────────────────────────────────────── */

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/**
 * "Hoy, 09:42" · "Ayer, 18:05" · "23 ago 2026".
 *
 * Formateo a mano y no `Intl`: la tabla se renderiza en el servidor y se
 * hidrata en el navegador, y las dos implementaciones de ICU no siempre
 * coinciden carácter a carácter (el separador y la abreviatura del mes varían).
 * Una diferencia de un carácter es un error de hidratación.
 */
export function formatCatalogDate(iso: string | undefined, now: Date = new Date()): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return null;

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (sameDay(date, now)) return `Hoy, ${time}`;

  const yesterday = new Date(now.getTime() - 86400000);
  if (sameDay(date, yesterday)) return `Ayer, ${time}`;

  return `${date.getDate()} ${MONTHS_ES[date.getMonth()]} ${date.getFullYear()}`;
}

/* ── Formulario de promoción ──────────────────────────────────────────────── */

/** La misma caja crea y corrige; solo cambia a qué endpoint llama. */
export type PromotionModalMode = "create" | "edit";

/**
 * Los campos que el backend valida (`CreateOrUpdatePromotionRequest`:
 * `@NotBlank` en título/destino/resumen, `@NotNull` en precio y duraciones).
 */
export interface PromotionFormDraft {
  title: string;
  destination: string;
  summary: string;
  priceUsd: number | string;
  durationDays: number;
  durationNights: number;
}

export type PromotionFormErrors = Partial<Record<keyof PromotionFormDraft, string>>;

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function isMissingNumber(value: number | string): boolean {
  if (typeof value === "string" && isBlank(value)) return true;
  return !Number.isFinite(Number(value));
}

/**
 * Validación en cliente que espeja la del backend, campo a campo.
 *
 * ── Por qué existe y no basta con enseñar el 400 ─────────────────────────
 * 25 de las 32 promociones vienen del ingestor de Facebook ya retirado y
 * quedaron con `destination` vacío en la base de datos. Abrir una de ellas y
 * pulsar "Guardar cambios" sin tocar nada devuelve un 400 de Bean Validation
 * con el campo en un `violations[]` que nadie lee. Validando aquí, el campo que
 * falta se marca en rojo con su propia explicación y el problema se entiende
 * sin haber enviado nada.
 */
export function validatePromotionForm(draft: PromotionFormDraft): PromotionFormErrors {
  const errors: PromotionFormErrors = {};

  if (isBlank(draft.title)) {
    errors.title = "El título es obligatorio.";
  }
  if (isBlank(draft.destination)) {
    errors.destination =
      "El destino es obligatorio y esta promoción llegó sin él. Escribe la ciudad y el país antes de guardar.";
  }
  if (isBlank(draft.summary)) {
    errors.summary = "El resumen es obligatorio: es el texto que se lee en la tarjeta del Home.";
  }
  if (isMissingNumber(draft.priceUsd)) {
    errors.priceUsd = "Escribe el precio en dólares.";
  } else if (Number(draft.priceUsd) < 0) {
    errors.priceUsd = "El precio no puede ser negativo.";
  }
  if (isMissingNumber(draft.durationDays) || Number(draft.durationDays) < 1) {
    errors.durationDays = "Indica cuántos días dura el paquete.";
  }
  if (isMissingNumber(draft.durationNights) || Number(draft.durationNights) < 0) {
    errors.durationNights = "Indica cuántas noches dura el paquete.";
  }

  return errors;
}

export function hasFormErrors(errors: PromotionFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Los catorce campos del formulario, sus setters y el resultado de validarlos,
 * en un solo objeto.
 *
 * Antes viajaban sueltos: treinta props enumeradas en el hook, otras treinta en
 * la interfaz del modal y otras treinta en la llamada. Añadir un campo obligaba
 * a tocar los tres sitios, y la plantilla del panel eran cuarenta líneas de
 * `x={x}`. Agrupar no oculta nada — el modal sigue viendo cada campo por su
 * nombre — pero deja el `.tsx` leyéndose como plantilla.
 */
export interface PromotionFormBinding {
  title: string;
  setTitle: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  departureCity: string;
  setDepartureCity: (value: string) => void;
  priceUsd: number | string;
  setPriceUsd: (value: number | string) => void;
  pricePen: number | string;
  setPricePen: (value: number | string) => void;
  durationDays: number;
  setDurationDays: (value: number) => void;
  durationNights: number;
  setDurationNights: (value: number) => void;
  validFrom: string;
  setValidFrom: (value: string) => void;
  validUntil: string;
  setValidUntil: (value: string) => void;
  summary: string;
  setSummary: (value: string) => void;
  inclusionsInput: string;
  setInclusionsInput: (value: string) => void;
  exclusionsInput: string;
  setExclusionsInput: (value: string) => void;
  whatsappTemplate: string;
  setWhatsappTemplate: (value: string) => void;
  featuredMediaId?: number;
  featuredMediaUrl?: string;
  featuredMediaFocalX?: number;
  featuredMediaFocalY?: number;
  onSelectFeaturedMedia: (media: MediaAssetDTO) => void;
  /** Mensajes que BLOQUEAN el guardado, campo a campo. */
  errors: PromotionFormErrors;
  /** Avisos que no bloquean (valores de relleno de la importación). */
  warnings: PromotionFormErrors;
}

/**
 * Avisos que NO bloquean el guardado.
 *
 * El precio 0 y la duración de 1 día que dejó el ingestor son valores válidos
 * para el backend, así que marcarlos como error mentiría sobre lo que impide
 * guardar. Se cuentan como ayuda bajo el campo: se ve que el dato es de relleno
 * sin impedir corregir solo el destino y salir.
 */
export function collectPromotionFormWarnings(draft: PromotionFormDraft): PromotionFormErrors {
  const warnings: PromotionFormErrors = {};
  if (!isMissingNumber(draft.priceUsd) && Number(draft.priceUsd) === 0) {
    warnings.priceUsd = "Está en 0: es el valor de relleno que dejó la importación. Escribe el precio real.";
  }
  if (Number(draft.durationDays) === 1 && Number(draft.durationNights) === 0) {
    warnings.durationDays = "1 día / 0 noches es el valor de relleno de la importación.";
  }
  return warnings;
}

/* ── Acciones masivas ─────────────────────────────────────────────────────── */

export type PromotionBulkOperation = "show" | "hide" | "delete";

/**
 * Resultado real de una tanda, promoción a promoción.
 *
 * No hay endpoints en lote: la tanda son N peticiones sueltas y cada una puede
 * fallar por su cuenta. `blocked` es el 409 del guard de las 3 activas —
 * separado de `failed` porque no es una avería, es una regla del sistema y se
 * explica distinto.
 */
export interface PromotionBulkOutcome {
  operation: PromotionBulkOperation;
  /** Cuántas se seleccionaron, antes de descartar las que ya estaban así. */
  requested: number;
  applied: string[];
  blocked: string[];
  failed: string[];
  /** Ya estaban en el estado pedido: no se llamó a la API por ellas. */
  skipped: string[];
}

const OPERATION_COPY: Record<
  PromotionBulkOperation,
  { done: string; noun: string; skipped: string; blockedVerb: string }
> = {
  show: {
    done: "Se mostraron en portada",
    noun: "promociones",
    skipped: "ya estaban visibles",
    blockedVerb: "mostrar",
  },
  hide: {
    done: "Se ocultaron",
    noun: "promociones",
    skipped: "ya estaban ocultas",
    blockedVerb: "ocultar",
  },
  delete: {
    done: "Se eliminaron",
    noun: "promociones",
    skipped: "ya no estaban en el catálogo",
    blockedVerb: "eliminar",
  },
};

/** Lista de nombres legible, recortada para que el banner no sea un muro. */
function nameList(titles: readonly string[], max = 3): string {
  const shown = titles.slice(0, max).map((t) => `«${t}»`);
  const rest = titles.length - shown.length;
  return rest > 0 ? `${shown.join(", ")} y ${rest} más` : shown.join(", ");
}

/**
 * Traduce el resultado de la tanda a una sola frase que NUNCA da el lote por
 * bueno: si algo no se aplicó, el número aplicado va sobre el total pedido
 * ("Se ocultaron 2 de 5") y a continuación se dice qué pasó con el resto y por
 * qué. El tono solo es de éxito cuando no quedó nada pendiente.
 */
export function summarizeBulkOutcome(outcome: PromotionBulkOutcome): FormFeedbackState {
  const copy = OPERATION_COPY[outcome.operation];
  const { applied, blocked, failed, skipped, requested } = outcome;
  const complete = blocked.length === 0 && failed.length === 0;

  /* Nada que hacer: todas las seleccionadas ya estaban como se pedía. No es un
     fallo ni un éxito a medias — no hubo ninguna petición. */
  if (skipped.length === requested) {
    return {
      tone: "success",
      message:
        requested === 1
          ? `La promoción seleccionada ${copy.skipped}: no se cambió nada.`
          : `Las ${requested} ${copy.noun} seleccionadas ${copy.skipped}: no se cambió nada.`,
    };
  }

  const parts: string[] = [];

  if (applied.length === 0) {
    parts.push(
      `No se pudo ${copy.blockedVerb} ninguna de las ${requested - skipped.length} ${copy.noun} que lo necesitaban.`
    );
  } else if (complete && skipped.length === 0) {
    parts.push(
      applied.length === 1
        ? `${copy.done} 1 promoción.`
        : `${copy.done} las ${applied.length} ${copy.noun} seleccionadas.`
    );
  } else {
    parts.push(`${copy.done} ${applied.length} de ${requested} ${copy.noun}.`);
  }

  if (blocked.length > 0) {
    parts.push(
      `${blocked.length} no se ${blocked.length === 1 ? "pudo" : "pudieron"} ${copy.blockedVerb} porque el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones visibles: ${nameList(blocked)}.`
    );
  }

  if (failed.length > 0) {
    parts.push(
      `${failed.length} ${failed.length === 1 ? "falló" : "fallaron"} por un error del servidor: ${nameList(failed)}.`
    );
  }

  if (skipped.length > 0) {
    parts.push(`${skipped.length} ${copy.skipped} y se dejaron como estaban.`);
  }

  return { tone: complete ? "success" : "error", message: parts.join(" ") };
}
