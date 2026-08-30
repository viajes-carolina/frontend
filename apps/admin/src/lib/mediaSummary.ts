import type { MediaAssetDTO } from "@vc/api-client";

/**
 * Descripción de una imagen para las filas de selección de los editores de
 * contenido (Figma 930:4: nombre de archivo + una línea de dimensiones/peso +
 * una línea de punto focal).
 *
 * Vive en `lib/` porque es cálculo puro: los `.tsx` solo pintan las tres
 * cadenas que devuelve. Cuando falta un dato lo dice — nunca inventa un tamaño
 * ni un peso para rellenar el hueco del diseño.
 */

export interface MediaSummary {
  /** Nombre de archivo legible. */
  name: string;
  /** "1920 × 1080 px · 245 KB" o el motivo por el que no se conoce. */
  specs: string;
  /** "Punto focal: 50% · 50%". */
  focal: string;
}

const EMPTY: MediaSummary = {
  name: "Sin imagen seleccionada",
  specs: "Elige una imagen de la biblioteca",
  focal: "El punto focal se ajusta al elegirla",
};

/** Bytes en la unidad más legible, con la precisión que cabe en 10px. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "peso desconocido";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * Ruta servible de una imagen de la biblioteca. El backend guarda unas veces
 * una URL absoluta y otras una ruta relativa sin barra inicial; `next/image`
 * necesita una de las dos formas canónicas.
 */
export function resolveMediaSrc(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") || url.startsWith("/") ? url : `/${url}`;
}

/** Último segmento de la ruta de almacenamiento, sin query ni barras. */
export function filenameFromUrl(url: string): string {
  const clean = url.split("?")[0].replace(/\/+$/, "");
  const segment = clean.split("/").pop();
  return segment && segment.length > 0 ? decodeURIComponent(segment) : clean;
}

export interface DescribeMediaInput {
  /** Metadatos completos, cuando la imagen se pudo resolver en la biblioteca. */
  asset?: MediaAssetDTO;
  mediaId?: number;
  mediaUrl?: string;
  focalX?: number;
  focalY?: number;
}

export function describeMedia({
  asset,
  mediaId,
  mediaUrl,
  focalX,
  focalY,
}: DescribeMediaInput): MediaSummary {
  if (!mediaId && !mediaUrl) return EMPTY;

  const name = asset?.originalName || asset?.filename || (mediaUrl ? filenameFromUrl(mediaUrl) : `Imagen #${mediaId}`);

  const specs =
    asset && asset.width > 0 && asset.height > 0
      ? `${asset.width} × ${asset.height} px · ${formatFileSize(asset.fileSizeBytes)}`
      : `Imagen #${mediaId ?? "—"} · dimensiones no disponibles`;

  return {
    name,
    specs,
    focal: `Punto focal: ${focalX ?? 50}% · ${focalY ?? 50}%`,
  };
}
