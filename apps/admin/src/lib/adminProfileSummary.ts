import type { AdminUserDTO } from "@vc/api-client";

/**
 * Cómo se presenta el usuario autenticado en el pie del sidebar.
 *
 * Cálculo puro: `AdminSidebarProfile` solo pinta las tres cadenas que salen de
 * aquí. Nada se cablea — todo sale del `AdminUserDTO` que devuelve
 * `apiClient.getCurrentAdminUser()`.
 */

export interface AdminProfileSummary {
  fullName: string;
  /** Rol traducido a algo legible en español. */
  roleLabel: string;
  /** Una o dos letras para el avatar; el modelo no guarda foto de perfil. */
  initials: string;
}

/**
 * Etiquetas de rol sin género gramatical.
 *
 * `AdminUserDTO` no trae el género de la persona, así que "Administradora" o
 * "Administrador" serían una invención con una probabilidad del 50% de estar
 * mal impresa junto al nombre real de quien la lee. Se nombra la función, no a
 * la persona. (En `/perfil` conviven todavía las etiquetas gendered antiguas;
 * esa pantalla no entra en este cambio.)
 */
const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Administración general",
  CONTENT_EDITOR: "Edición de contenido",
  ADVISOR: "Asesoría de viajes",
};

/**
 * Rol desconocido: se muestra el código legible en vez de esconderlo, para que
 * un rol nuevo del backend se note en pantalla en lugar de aparecer vacío.
 * "AREA_MANAGER" → "Area manager".
 */
function humanizeRole(role: string): string {
  const words = role.trim().replace(/[_-]+/g, " ").toLowerCase();
  if (!words) return "Sin rol asignado";
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function roleLabel(role: string | undefined): string {
  if (!role) return "Sin rol asignado";
  return ROLE_LABELS[role] ?? humanizeRole(role);
}

/**
 * Iniciales del nombre: las primeras letras de las dos primeras palabras que
 * empiecen por letra, para que separadores como "&" o "de" no acaben dentro
 * del círculo ("Mariana & Gonzalo Torres" → "MG", no "M&").
 */
export function initialsFromName(fullName: string, username?: string): string {
  const letters = fullName
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .filter((char) => /\p{L}/u.test(char));

  if (letters.length > 0) return letters.slice(0, 2).join("").toUpperCase();

  const fallback = (username ?? "").charAt(0);
  return /\p{L}/u.test(fallback) ? fallback.toUpperCase() : "?";
}

export function summarizeAdminProfile(user: AdminUserDTO): AdminProfileSummary {
  const fullName = user.fullName?.trim() || user.username;
  return {
    fullName,
    roleLabel: roleLabel(user.role),
    initials: initialsFromName(fullName, user.username),
  };
}
