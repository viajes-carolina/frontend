"use client";

import React from "react";
import { ResponsiveImage, FocalPoint } from "./ResponsiveImage";
import { ImageIcon } from "../icons/icons";

export type PolaroidTape = "top" | "left" | "right" | "none";

export interface PolaroidPhotoProps {
  imageUrl?: string;
  alt: string;
  focalPoint?: FocalPoint;
  /** Grados de rotación (Figma: -6/+4/-5 según el recuerdo) — no un enum. */
  rotate?: number;
  tape?: PolaroidTape;
  priority?: boolean;
  /** Clases Tailwind de filtro para unificar el tratamiento fotográfico. */
  colorGrade?: string;
  className?: string;
}

/**
 * Recuerdo físico superpuesto — "Recuerdo NN · polaroid ..." en Figma
 * (node 266:231). Marco blanco con el borde asimétrico clásico de una
 * polaroid real (14px arriba/lados, 28px abajo), cinta adhesiva opcional,
 * sombra amplia y suave. Nunca un card de interfaz — sin radio, sin borde
 * de sistema. Sin imageUrl, muestra un placeholder abstracto, nunca una
 * foto de archivo.
 */
export function PolaroidPhoto({
  imageUrl,
  alt,
  focalPoint = { x: 50, y: 50 },
  rotate = 0,
  tape = "none",
  priority = false,
  colorGrade,
  className = "",
}: PolaroidPhotoProps) {
  return (
    // La posición/tamaño dentro del layout del consumidor vive en `className`
    // — nunca fijar aquí una clase `relative`/`absolute` que choque con la
    // pasada desde afuera (gana `.relative` en el cascade de Tailwind sin
    // importar el orden en el string de clases).
    <figure className={className} style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}>
      <div className="relative w-full h-full bg-neutral-white shadow-[0_16px_40px_rgba(27,42,56,0.18)]">
        {tape !== "none" && (
          <span
            aria-hidden="true"
            className={[
              "absolute z-20 h-[30px] w-[110px] bg-atmosphere-sand/70 shadow-sm",
              tape === "top" && "-top-3.5 left-1/2 -translate-x-1/2 -rotate-4",
              tape === "left" && "left-1/2 top-2 -translate-x-1/2 -rotate-3",
              tape === "right" && "right-4 top-1 rotate-3",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        )}
        <div className="absolute left-[14px] right-[14px] top-[14px] bottom-[28px] overflow-hidden bg-neutral-soft">
          {imageUrl ? (
            <ResponsiveImage
              src={imageUrl}
              alt={alt}
              fill
              priority={priority}
              focalPoint={focalPoint}
              className="w-full h-full"
              imgClassName={colorGrade}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-atmosphere-sky via-brand-blue to-brand-navy flex items-center justify-center">
              <ImageIcon size={28} className="text-white/25" />
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
