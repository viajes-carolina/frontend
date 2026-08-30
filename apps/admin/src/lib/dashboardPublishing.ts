import type { PublishResponseDTO } from "@vc/api-client";
import type { DashboardTone } from "./dashboardActivity";
import { formatPublishedAt } from "./dashboardTime";

/**
 * Estado de publicación del sitio, derivado de `getPublishingStatus()`.
 *
 * Antes esto cruzaba dos lecturas: el endpoint decía si el motor ISR
 * respondía, pero su `publishedAt` era `Instant.now()` en cada consulta, así
 * que la fecha real había que buscarla en la bitácora de auditoría. El backend
 * ya lo corrigió (`GetPublishingStatusUseCase` lee el último registro de
 * publicación), de modo que el endpoint es la única fuente de verdad y sobra
 * la lectura extra de la bitácora.
 *
 * `publishedAt` y `triggeredBy` llegan ausentes cuando el sitio nunca se ha
 * publicado — la API omite los campos nulos.
 */

export type PublicationState = "PUBLISHED" | "FAILED" | "NEVER" | "UNAVAILABLE";

export interface PublicationSummary {
  state: PublicationState;
  tone: DashboardTone;
  /** Texto de la píldora del topbar y del panel ("Sitio publicado"). */
  badge: string;
  /** Valor del KPI "Sitio público" ("Publicado"). */
  kpiValue: string;
  /** Detalle del KPI, con la fecha real de la última publicación. */
  kpiDetail: string;
  /** Titular del panel "Estado de publicación". */
  message: string;
}

const TONES: Record<PublicationState, DashboardTone> = {
  PUBLISHED: "published",
  FAILED: "pending",
  NEVER: "pending",
  UNAVAILABLE: "neutral",
};

const UNAVAILABLE: PublicationSummary = {
  state: "UNAVAILABLE",
  tone: TONES.UNAVAILABLE,
  badge: "Estado no disponible",
  kpiValue: "No disponible",
  kpiDetail: "No se pudo consultar el estado de publicación",
  message: "No se pudo consultar el estado de publicación",
};

const NEVER: PublicationSummary = {
  state: "NEVER",
  tone: TONES.NEVER,
  badge: "Sitio sin publicar",
  kpiValue: "Sin publicar",
  kpiDetail: "Todavía no se ha publicado ninguna vez",
  message: "La web aún no se ha publicado",
};

export function buildPublicationSummary(input: {
  engineStatus: PublishResponseDTO | null;
  now: Date;
}): PublicationSummary {
  const { engineStatus, now } = input;

  if (!engineStatus) return UNAVAILABLE;
  if (engineStatus.status === "NEVER_PUBLISHED" || !engineStatus.publishedAt) return NEVER;

  const publishedAt = formatPublishedAt(engineStatus.publishedAt, now);
  const kpiDetail = publishedAt ? `Última publicación: ${publishedAt}` : "Última publicación registrada";

  if (engineStatus.status === "FAILED") {
    return {
      state: "FAILED",
      tone: TONES.FAILED,
      badge: "Publicación con errores",
      kpiValue: "Con errores",
      kpiDetail,
      message: "La última publicación no se completó",
    };
  }

  // `UNKNOWN` es "hay registro de publicación pero no se pudo leer si el
  // webhook respondió". Se muestra la fecha, que sí es cierta, sin afirmar
  // que la última publicación saliera bien.
  if (engineStatus.status !== "SUCCESS") {
    return {
      state: "UNAVAILABLE",
      tone: TONES.UNAVAILABLE,
      badge: "Estado no confirmado",
      kpiValue: "Sin confirmar",
      kpiDetail,
      message: "No se pudo confirmar el resultado de la última publicación",
    };
  }

  return {
    state: "PUBLISHED",
    tone: TONES.PUBLISHED,
    badge: "Sitio publicado",
    kpiValue: "Publicado",
    kpiDetail,
    message: "La web está actualizada",
  };
}
