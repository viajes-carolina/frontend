"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ImageIcon } from "@vc/ui";
import { useMediaThumb } from "../hooks/useMediaThumb";

/**
 * Miniatura de una imagen de la biblioteca dentro de una tabla del panel.
 *
 * Tres estados, en este orden:
 *   1. la imagen carga → se pinta;
 *   2. la imagen no carga → marcador de posición (`ImageIcon` sobre
 *      `bg-neutral-soft`), el mismo que usa `HeroPreviewCard`;
 *   3. el registro no tiene imagen → `empty`, o el marcador si no se pasa.
 *
 * El caller decide tamaño, radio y borde vía `className`; aquí solo vive la
 * caída elegante, que antes no existía y dejaba el icono de imagen rota del
 * navegador en las filas con medios sembrados sin fichero.
 */

export interface MediaThumbProps {
  url?: string | null;
  alt: string;
  /** Contenedor: tamaño, radio y borde. Debe permitir posicionamiento (`relative`). */
  className?: string;
  /** `sizes` de `next/image`; las miniaturas son pequeñas y fijas. */
  sizes?: string;
  iconSize?: number;
  /** Qué mostrar cuando el registro no trae imagen (unas iniciales, p. ej.). */
  empty?: ReactNode;
}

export function MediaThumb({
  url,
  alt,
  className = "",
  sizes = "64px",
  iconSize = 16,
  empty,
}: MediaThumbProps) {
  const { src, broken, handleError, registerImg } = useMediaThumb(url);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-neutral-soft ${className}`}
    >
      {src ? (
        <Image
          ref={registerImg}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          onError={handleError}
          style={{ objectFit: "cover" }}
        />
      ) : broken || !empty ? (
        <span className="flex h-full w-full items-center justify-center text-neutral-muted">
          <ImageIcon size={iconSize} aria-hidden="true" />
        </span>
      ) : (
        empty
      )}
    </div>
  );
}
