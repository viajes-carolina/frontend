import { apiClient } from "@vc/api-client";
import {
  buildActivityFeed,
  type DashboardActivityItem,
  type DashboardTone,
} from "./dashboardActivity";
import { buildPublicationSummary, type PublicationSummary } from "./dashboardPublishing";

/**
 * Lectura y armado del dashboard.
 *
 * Vive en `lib/` y no en `app/page.tsx` para que la página siga siendo una
 * plantilla: aquí ocurren las llamadas al API y la traducción de DTOs a los
 * textos que pinta cada bloque.
 *
 * Las lecturas se resuelven con `allSettled` a propósito. Son bloques
 * independientes: que la bitácora falle no debe tumbar la pantalla entera ni
 * esconder las reclamaciones pendientes. Un bloque sin dato dice que no pudo
 * consultarse, nunca muestra un cero inventado.
 */

/** Cuántos eventos entran en el panel "Actividad reciente". */
const ACTIVITY_LIMIT = 5;

/**
 * Se piden más registros de los que se muestran porque `buildActivityFeed`
 * descarta los inicios de sesión, que son la mayoría de la bitácora.
 */
const AUDIT_FETCH_SIZE = 40;

export interface DashboardCounter {
  /** Cifra ya formateada, o "—" cuando la lectura no estuvo disponible. */
  value: string;
  detail: string;
  tone: DashboardTone;
}

export interface DashboardData {
  publication: PublicationSummary;
  drafts: DashboardCounter;
  pendingClaims: DashboardCounter;
  activity: DashboardActivityItem[];
  /** `false` cuando la bitácora no se pudo leer (distinto de "no hay nada"). */
  activityAvailable: boolean;
}

function valueOf<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null;
}

const UNAVAILABLE_COUNTER = (detail: string): DashboardCounter => ({
  value: "—",
  detail,
  tone: "neutral",
});

export async function loadDashboardData(now: Date = new Date()): Promise<DashboardData> {
  const [engineStatus, drafts, pendingClaims, auditLogs] = await Promise.allSettled([
    apiClient.getPublishingStatus(),
    // El filtro por estado lo aplica el backend; el `filter` posterior es una
    // red de seguridad para que la cifra siga siendo "borradores" aunque el
    // endpoint dejara de respetar el parámetro.
    apiClient.getAdminBlogPosts("DRAFT", undefined, 0, 200),
    apiClient.getAdminClaims("PENDING"),
    apiClient.getAuditLogs("ALL", AUDIT_FETCH_SIZE),
  ]);

  const draftList = valueOf(drafts);
  const claimList = valueOf(pendingClaims);
  const logList = valueOf(auditLogs);

  const draftCount = draftList?.filter((post) => post.status === "DRAFT").length ?? 0;
  const claimCount = claimList?.filter((claim) => claim.status === "PENDING").length ?? 0;

  return {
    publication: buildPublicationSummary({ engineStatus: valueOf(engineStatus), now }),
    drafts: draftList
      ? {
          value: String(draftCount),
          detail: "Artículos aún no publicados",
          tone: draftCount > 0 ? "draft" : "neutral",
        }
      : UNAVAILABLE_COUNTER("No se pudieron consultar los borradores"),
    pendingClaims: claimList
      ? {
          value: String(claimCount),
          detail: "Pendientes de respuesta",
          tone: claimCount > 0 ? "pending" : "published",
        }
      : UNAVAILABLE_COUNTER("No se pudieron consultar las reclamaciones"),
    activity: logList ? buildActivityFeed(logList, now, ACTIVITY_LIMIT) : [],
    activityAvailable: logList !== null,
  };
}
