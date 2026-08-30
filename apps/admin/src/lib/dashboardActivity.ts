import type { AuditLogDTO } from "@vc/api-client";
import { formatEventTime } from "./dashboardTime";

/**
 * Traducción de la bitácora de auditoría al panel "Actividad reciente" del
 * dashboard.
 *
 * La bitácora guarda pares máquina (`UPDATE_ABOUT_PAGE` / `ABOUT_PAGE`); el
 * dashboard los cuenta en castellano ("Página Nosotros actualizada" / "admin
 * actualizó la página Nosotros."). Nada se inventa: título, detalle, hora y
 * tono salen de `action`, `entityType`, `entityId`, `username` y `createdAt`
 * del registro real. La tabla cruda, con su JSON, sigue en `/auditoria`.
 */

export type DashboardTone = "published" | "draft" | "pending" | "neutral";

export interface DashboardActivityItem {
  id: number;
  title: string;
  detail: string;
  /** "09:42" | "Ayer" | "19 ago" */
  time: string;
  tone: DashboardTone;
}

interface EntityDescriptor {
  /** Sustantivo en minúscula, tal como entra en la frase del detalle. */
  noun: string;
  gender: "m" | "f";
  /** Si la entidad es una colección, el detalle cita el identificador. */
  collection?: boolean;
}

const ENTITIES: Record<string, EntityDescriptor> = {
  ABOUT_PAGE: { noun: "página Nosotros", gender: "f" },
  ADVISOR: { noun: "asesora", gender: "f", collection: true },
  BLOG_CATEGORY: { noun: "categoría del blog", gender: "f", collection: true },
  BLOG_HERO: { noun: "portada del blog", gender: "f" },
  BLOG_LIBRARY: { noun: "biblioteca del blog", gender: "f" },
  BLOG_POST: { noun: "artículo", gender: "m", collection: true },
  CLAIM: { noun: "reclamación", gender: "f", collection: true },
  CONTACT_PAGE: { noun: "página de contacto", gender: "f" },
  FAQ: { noun: "pregunta frecuente", gender: "f", collection: true },
  HOME_BLOG_INSPIRATION: { noun: "sección de inspiración", gender: "f" },
  HOME_CONVERSATIONAL_PAUSE: { noun: "pausa conversacional", gender: "f" },
  HOME_FAQ_SECTION: { noun: "sección de preguntas frecuentes", gender: "f" },
  HOME_HERO: { noun: "portada de inicio", gender: "f" },
  HOME_PROMOTIONS_SECTION: { noun: "sección de promociones", gender: "f" },
  HOME_TESTIMONIALS_SECTION: { noun: "sección de testimonios", gender: "f" },
  INQUIRY: { noun: "consulta de contacto", gender: "f", collection: true },
  LEGAL_COOKIES: { noun: "política de cookies", gender: "f" },
  LEGAL_ESNNA: { noun: "página ESNNA", gender: "f" },
  LEGAL_MINCETUR: { noun: "constancia MINCETUR", gender: "f" },
  LEGAL_PRIVACY: { noun: "política de privacidad", gender: "f" },
  LEGAL_TERMS: { noun: "página de términos", gender: "f" },
  MEDIA_ASSET: { noun: "imagen", gender: "f", collection: true },
  OFFICE_LOCATION: { noun: "oficina", gender: "f" },
  PROMOTION: { noun: "promoción", gender: "f", collection: true },
  SITE_SETTINGS: { noun: "configuración del sitio", gender: "f" },
  TESTIMONIAL: { noun: "testimonio", gender: "m", collection: true },
  USER: { noun: "usuario del panel", gender: "m", collection: true },
};

interface ActionDescriptor {
  /** Verbo conjugado en pasado, con el actor como sujeto. */
  verb: string;
  /** Participio sin la vocal final: concuerda con el género del sustantivo. */
  participle: string;
  tone: DashboardTone;
}

const ACTIONS: { prefix: string; descriptor: ActionDescriptor }[] = [
  { prefix: "CREATE_", descriptor: { verb: "creó", participle: "cread", tone: "draft" } },
  { prefix: "UPDATE_", descriptor: { verb: "actualizó", participle: "actualizad", tone: "draft" } },
  { prefix: "PATCH_", descriptor: { verb: "actualizó", participle: "actualizad", tone: "draft" } },
  { prefix: "DELETE_", descriptor: { verb: "eliminó", participle: "eliminad", tone: "pending" } },
  { prefix: "ARCHIVE_", descriptor: { verb: "archivó", participle: "archivad", tone: "pending" } },
  { prefix: "DEACTIVATE_", descriptor: { verb: "ocultó", participle: "ocultad", tone: "pending" } },
  { prefix: "PUBLISH_", descriptor: { verb: "publicó", participle: "publicad", tone: "published" } },
  {
    prefix: "SET_",
    descriptor: { verb: "cambió la visibilidad de", participle: "actualizad", tone: "draft" },
  },
];

const FALLBACK_ACTION: ActionDescriptor = {
  verb: "registró un cambio en",
  participle: "actualizad",
  tone: "neutral",
};

/** Alcance de una publicación, tal como lo guarda la bitácora en `entityId`. */
const PUBLISH_TARGETS: Record<string, string> = {
  ALL: "todo el sitio",
  HOME: "la portada",
  PROMOTIONS: "las promociones",
  BLOG: "el blog",
  ABOUT: "la página Nosotros",
  CONTACT: "la página de contacto",
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function describeEntity(entityType: string): EntityDescriptor {
  return (
    ENTITIES[entityType] ?? {
      noun: entityType.toLowerCase().replace(/_/g, " "),
      gender: "m",
    }
  );
}

function describeAction(action: string): ActionDescriptor {
  return ACTIONS.find(({ prefix }) => action.startsWith(prefix))?.descriptor ?? FALLBACK_ACTION;
}

function agree(participle: string, gender: "m" | "f"): string {
  return `${participle}${gender === "f" ? "a" : "o"}`;
}

/**
 * `true` cuando el webhook de revalidación respondió correctamente. El
 * registro de publicación es la única fuente que distingue una publicación
 * completada de una que falló, así que también lo consulta
 * `dashboardPublishing`.
 */
export function didPublishSucceed(detailsJson: string): boolean {
  try {
    const parsed: unknown = JSON.parse(detailsJson || "{}");
    if (typeof parsed !== "object" || parsed === null) return false;
    return (parsed as Record<string, unknown>).webhookSucceeded === true;
  } catch {
    return false;
  }
}

interface NarratedEvent {
  title: string;
  detail: string;
  tone: DashboardTone;
}

function narrate(log: AuditLogDTO): NarratedEvent {
  const actor = log.username || "el sistema";

  if (log.entityType === "PUBLISHING") {
    const scope = PUBLISH_TARGETS[log.entityId ?? "ALL"] ?? "el sitio";
    return didPublishSucceed(log.detailsJson)
      ? { title: "Sitio publicado", detail: `${actor} publicó ${scope}.`, tone: "published" }
      : {
          title: "Publicación fallida",
          detail: `La publicación de ${scope} lanzada por ${actor} no se completó.`,
          tone: "pending",
        };
  }

  if (log.entityType === "AUTH") {
    return log.action === "LOGIN_SUCCESS"
      ? { title: "Acceso al panel", detail: `${actor} inició sesión.`, tone: "neutral" }
      : {
          title: "Acceso rechazado",
          detail: `Intento fallido de acceso con el usuario ${actor}.`,
          tone: "pending",
        };
  }

  if (log.entityType === "SYSTEM") {
    return {
      title: "Puesta en marcha del panel",
      detail: "Carga inicial de datos del sistema.",
      tone: "neutral",
    };
  }

  if (log.action === "CHANGE_OWN_PASSWORD") {
    return {
      title: "Contraseña actualizada",
      detail: `${actor} cambió su propia contraseña.`,
      tone: "draft",
    };
  }

  const entity = describeEntity(log.entityType);
  const action = describeAction(log.action);
  const article = entity.gender === "f" ? "la" : "el";
  const reference = entity.collection && log.entityId ? ` #${log.entityId}` : "";

  return {
    title: `${capitalize(entity.noun)} ${agree(action.participle, entity.gender)}`,
    detail: `${actor} ${action.verb} ${article} ${entity.noun}${reference}.`,
    tone: log.entityType === "CLAIM" ? "pending" : action.tone,
  };
}

/**
 * Los inicios de sesión quedan fuera: son 4 de cada 10 registros y llenarían
 * el panel con filas idénticas que no dicen qué cambió en el sitio. El acceso
 * sí se conserva —y se consulta— en la bitácora completa de `/auditoria`.
 */
function isSiteActivity(log: AuditLogDTO): boolean {
  return log.entityType !== "AUTH";
}

export function buildActivityFeed(
  logs: AuditLogDTO[],
  now: Date,
  limit: number,
): DashboardActivityItem[] {
  return logs
    .filter(isSiteActivity)
    .slice(0, limit)
    .map((log) => {
      const { title, detail, tone } = narrate(log);
      return { id: log.id, title, detail, time: formatEventTime(log.createdAt, now), tone };
    });
}
