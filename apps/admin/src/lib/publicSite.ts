/**
 * URL del sitio público, tal como la configura `NEXT_PUBLIC_SITE_URL`.
 *
 * Devuelve `undefined` cuando la variable no está definida en vez de caer a un
 * `http://localhost:3000` inventado: un enlace "Ver web pública" que apunta a
 * un sitio que no existe es peor que no ofrecer el enlace. Quien la use decide
 * qué hacer con el hueco (aquí, no pintar el botón).
 *
 * Se lee en el servidor (`page.tsx`) y viaja como prop, para que el valor sea
 * el del entorno en ejecución y no el que quedó incrustado en el bundle al
 * compilar.
 */
export function resolvePublicSiteUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  // Sin barra final: la vista concatena rutas sobre esta base.
  return raw.replace(/\/+$/, "");
}
