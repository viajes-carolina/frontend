import { formatPublishedAt } from "./dashboardTime";

/**
 * Segunda línea del estado de guardado de un editor de contenidos:
 * "Último guardado: hoy, 09:18".
 *
 * Vive aparte del cargador de la pantalla (`heroEditorContext`, que solo corre
 * en el servidor) porque también la usa el hook del editor tras guardar, ya en
 * el navegador. Es cálculo puro sobre un `now` recibido, sin `new Date()`
 * interno, para que servidor y cliente produzcan el mismo texto.
 */
export function buildLastSavedLabel(updatedAt: string | undefined, now: Date): string {
  if (!updatedAt) return "Sin registro de guardado";
  const formatted = formatPublishedAt(updatedAt, now);
  return formatted ? `Último guardado: ${formatted}` : "Sin registro de guardado";
}
