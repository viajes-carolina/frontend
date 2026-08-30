"use client";

import { useCallback, useState } from "react";
import { resolveMediaSrc } from "../lib/mediaSummary";

export interface MediaThumbState {
  /** `undefined` si el registro no tiene imagen o si la que tiene no carga. */
  src?: string;
  /** `true` solo cuando había una URL y el navegador no pudo pintarla. */
  broken: boolean;
  handleError: () => void;
  /**
   * `ref` de la `<img>`. Recoge el fallo que `onError` no llega a ver (ver
   * abajo); se pasa tal cual a `next/image`, que lo reenvía al `<img>` real.
   */
  registerImg: (img: HTMLImageElement | null) => void;
}

/**
 * Estado de una miniatura de la biblioteca de medios.
 *
 * Hay registros sembrados en la base que apuntan a ficheros que no están en
 * disco (`/media/demo-*.webp`). Para esos, el gestor de medios responde 200 con
 * un SVG generado al vuelo y el optimizador de `next/image` lo rechaza con 400
 * ("image type is not allowed"), así que el navegador pinta el icono de imagen
 * rota. Con este hook la fila degrada al marcador de posición del panel en vez
 * de enseñar el roto.
 *
 * El fallo se guarda contra la URL concreta que falló, no como un booleano
 * suelto: así, si se cambia la imagen del registro desde el modal, la nueva se
 * vuelve a intentar sin necesidad de remontar la fila.
 *
 * `onError` por sí solo NO basta, y falla justo en el caso que nos ocupa: el
 * `<img>` viene en el HTML del servidor, el navegador lo empieza a pedir de
 * inmediato y el 400 del optimizador llega muy rápido — a menudo antes de que
 * React hidrate y enganche el manejador. Ese error se pierde y la fila se
 * queda con el icono de imagen rota para siempre. Se veía como un fallo
 * intermitente: la misma pantalla mostraba el marcador o el roto según quién
 * ganase la carrera. Por eso, además del `onError`, al montar la `<img>` se
 * comprueba si ya venía fallada (`complete` con `naturalWidth === 0`).
 */
export function useMediaThumb(url: string | undefined | null): MediaThumbState {
  const src = resolveMediaSrc(url ?? undefined);
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);

  const handleError = useCallback(() => {
    setBrokenSrc(src ?? null);
  }, [src]);

  const registerImg = useCallback(
    (img: HTMLImageElement | null) => {
      // `complete` con `naturalWidth === 0` = la petición ya terminó y no hay
      // imagen que pintar. Si aún está en vuelo, `complete` es `false` y basta
      // con el `onError`, que para entonces ya está enganchado.
      if (img && img.complete && img.naturalWidth === 0) handleError();
    },
    [handleError]
  );

  const broken = Boolean(src) && src === brokenSrc;

  return { src: broken ? undefined : src, broken, handleError, registerImg };
}
