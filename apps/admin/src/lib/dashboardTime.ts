/**
 * Formato de fechas del dashboard.
 *
 * El diseño escribe las horas en lenguaje corriente ("09:42", "Ayer",
 * "19 ago") en vez de un timestamp completo: quien administra el panel quiere
 * saber si algo pasó hace un rato o la semana pasada, no leer un ISO-8601. La
 * bitácora completa con fecha y hora exactas sigue estando en `/auditoria`.
 *
 * Todo se calcula contra un `now` recibido por parámetro (no `new Date()`
 * interno) para que las funciones sean puras y la página fije un único
 * instante de referencia para toda la pantalla.
 */

const LOCALE = "es-PE";

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Días completos de diferencia entre dos instantes (0 = hoy, 1 = ayer). */
export function daysApart(date: Date, now: Date): number {
  return Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
}

/** "09:42" — reloj de 24 h, el formato que usa el diseño. */
export function formatClock(date: Date): string {
  return date.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** "19 ago" y, si el año no es el corriente, "19 ago 2025". */
export function formatShortDate(date: Date, now: Date): string {
  const label = date.toLocaleDateString(LOCALE, { day: "numeric", month: "short" });
  // `toLocaleDateString` en es-PE devuelve "19 ago." con punto abreviativo;
  // sobra dentro de una columna de 10px.
  const clean = label.replace(/\./g, "");
  return date.getFullYear() === now.getFullYear() ? clean : `${clean} ${date.getFullYear()}`;
}

/**
 * Hora de un evento en la lista de actividad: hoy se muestra la hora, ayer la
 * palabra "Ayer" y más atrás la fecha corta.
 */
export function formatEventTime(iso: string, now: Date): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const days = daysApart(date, now);
  if (days <= 0) return formatClock(date);
  if (days === 1) return "Ayer";
  return formatShortDate(date, now);
}

/**
 * Momento de la última publicación, en frase: "hoy, 09:42" / "ayer, 18:19" /
 * "19 ago, 18:19". Lleva siempre la hora porque publicar es un acto puntual.
 */
export function formatPublishedAt(iso: string, now: Date): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const days = daysApart(date, now);
  const clock = formatClock(date);
  if (days <= 0) return `hoy, ${clock}`;
  if (days === 1) return `ayer, ${clock}`;
  return `${formatShortDate(date, now)}, ${clock}`;
}
