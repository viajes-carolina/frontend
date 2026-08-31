import type { TravelAdvisorDTO } from "@vc/api-client";
import type { BadgeTone } from "@vc/ui";
import type { EditorActionBarProps } from "../../../components/editor/EditorActionBar";
import { formatPublishedAt } from "../../../lib/dashboardTime";
import { TEAM_HEADER_FORM_ID } from "./AdvisorsHighlightsCard";

/**
 * Cálculo de la pantalla "Nosotros · Equipo". Vive aparte de los `.tsx` porque
 * son decisiones (qué dice la píldora, qué acciones de orden están
 * disponibles, qué líneas se omiten por falta de dato), no plantilla.
 *
 * Regla que ordena todo el archivo: **ninguna etiqueta se inventa**. Cada campo
 * opcional del DTO que falta desaparece de la tarjeta en vez de rellenarse con
 * un texto de ejemplo — por eso `quoteLabel`, `updatedAtLabel` y `phoneLabel`
 * son `string | null` y la vista los renderiza condicionalmente.
 */

/** Iniciales para la foto ausente. No es un dato inventado: es el propio nombre. */
export function buildInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export interface AdvisorCardModel {
  advisor: TravelAdvisorDTO;
  initials: string;
  /** Texto de la píldora: refleja `active` en sus DOS estados, no solo el visible. */
  visibilityLabel: string;
  visibilityTone: BadgeTone;
  /** Nombre accesible del control que cambia la visibilidad (el switch no tiene texto propio). */
  visibilityActionLabel: string;
  /** "Posición 3" — sale de `displayOrder`, el mismo valor que ordena la lista. */
  positionLabel: string;
  moveUpLabel: string;
  moveDownLabel: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  /** La cita entre comillas tipográficas, o `null` si la asesora no tiene. */
  quoteLabel: string | null;
  /** "Actualizado hoy, 10:18" a partir de `updatedAt`; `null` si el DTO no lo trae. */
  updatedAtLabel: string | null;
  /** El número de WhatsApp; `null` si no hay canal directo configurado. */
  phoneLabel: string | null;
}

function buildQuoteLabel(quote: string | undefined): string | null {
  const clean = quote?.trim();
  return clean ? `“${clean}”` : null;
}

function buildUpdatedAtLabel(updatedAt: string | undefined, now: Date): string | null {
  if (!updatedAt) return null;
  const formatted = formatPublishedAt(updatedAt, now);
  return formatted ? `Actualizado ${formatted}` : null;
}

/**
 * `advisors` llega ya ordenado por el backend (`displayOrder asc, id asc`), así
 * que "subir" y "bajar" son simplemente el vecino anterior y el siguiente del
 * arreglo; los extremos no ofrecen la acción que no existe.
 */
export function buildAdvisorCards(advisors: TravelAdvisorDTO[], now: Date): AdvisorCardModel[] {
  return advisors.map((advisor, index) => ({
    advisor,
    initials: buildInitials(advisor.fullName),
    visibilityLabel: advisor.active ? "Visible" : "Oculta",
    visibilityTone: advisor.active ? "info" : "neutral",
    visibilityActionLabel: advisor.active
      ? `Ocultar a ${advisor.fullName} en la página pública`
      : `Mostrar a ${advisor.fullName} en la página pública`,
    positionLabel: `Posición ${advisor.displayOrder}`,
    moveUpLabel: `Subir a ${advisor.fullName} en el orden del equipo`,
    moveDownLabel: `Bajar a ${advisor.fullName} en el orden del equipo`,
    canMoveUp: index > 0,
    canMoveDown: index < advisors.length - 1,
    quoteLabel: buildQuoteLabel(advisor.quote),
    updatedAtLabel: buildUpdatedAtLabel(advisor.updatedAt, now),
    phoneLabel: advisor.whatsappPhone?.trim() || null,
  }));
}

export interface TeamSummaryStatus {
  loading: boolean;
  loadError: boolean;
}

/**
 * Contexto de la cabecera del equipo. Los dos números son derivados del propio
 * listado, no métricas de otra fuente.
 *
 * Mientras la lista carga o falla, el conteo NO se muestra: `advisors` está
 * vacío en ambos casos y "Todavía no hay perfiles creados" sería mentira — el
 * listado no está vacío, todavía no se sabe qué hay.
 */
export function buildTeamSummaryLabel(
  advisors: TravelAdvisorDTO[],
  { loading, loadError }: TeamSummaryStatus
): string {
  if (loading) return "Cargando los perfiles del equipo…";
  if (loadError) return "No se pudo leer el listado del equipo.";

  const total = advisors.length;
  if (total === 0) return "Todavía no hay perfiles creados.";
  const visible = advisors.filter((advisor) => advisor.active).length;
  return [
    `${total} ${total === 1 ? "asesora" : "asesoras"}`,
    `${visible} ${visible === 1 ? "visible" : "visibles"} en la página pública`,
  ].join(" · ");
}

export interface TeamHeaderActionBarInput {
  /** El formulario del encabezado difiere de lo cargado. */
  dirty: boolean;
  saving: boolean;
  savedAtLabel: string;
  onDiscard: () => void;
  /* Sin `onSave`: el botón primario guarda por `form="…"` + `type="submit"`
     (ver más abajo), no por un handler de click. Aceptar uno aquí haría creer
     al llamador que está cableando el guardado cuando en realidad se ignora. */
}

/**
 * Barra persistente de la pantalla. Su estado habla SOLO del encabezado
 * institucional: las tarjetas de asesoras escriben contra el API en el momento
 * (visibilidad, orden, alta, edición y borrado), así que nunca hay cambios de
 * asesora "pendientes de guardar" que la barra pudiera estar ocultando. Por eso
 * las dos etiquetas nombran el encabezado en vez de decir un "sin cambios" a
 * secas que se leería como si abarcara toda la pantalla.
 */
export function buildTeamHeaderActionBar({
  dirty,
  saving,
  savedAtLabel,
  onDiscard,
}: TeamHeaderActionBarInput): EditorActionBarProps {
  return {
    statusLabel: dirty ? "Cambios sin guardar en el encabezado" : "Encabezado sin cambios pendientes",
    statusPending: dirty,
    savedAtLabel,
    secondaryActions: [
      {
        label: "Descartar cambios",
        onClick: onDiscard,
        disabled: saving || !dirty,
      },
    ],
    primaryAction: {
      label: "Guardar encabezado del equipo",
      busy: saving,
      busyLabel: "Guardando…",
      disabled: saving || !dirty,
      // Envía la tarjeta por `form="…"` en vez de llamar al handler: así el
      // `onSubmit` recibe un evento de formulario real y la tecla Enter dentro
      // de cualquier campo guarda igual que el botón.
      type: "submit",
      form: TEAM_HEADER_FORM_ID,
    },
  };
}
