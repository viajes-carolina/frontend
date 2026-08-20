"use client";

import React, { useId } from "react";
import { ResponsiveImage, FocalPoint } from "./ResponsiveImage";
import { ImageIcon } from "../icons/icons";

export interface OrganicPhotoProps {
  imageUrl?: string;
  alt: string;
  focalPoint?: FocalPoint;
  rotate?: number;
  priority?: boolean;
  caption?: string;
  className?: string;
}

/**
 * Foto con el marco orgánico oficial de Viajes Carolina (mismo path que
 * TravelMaskFrame), sin el cluster de badges flotantes — para composiciones
 * de collage limpias (Hero, y futuras secciones) donde la foto habla por sí
 * sola. Sin imageUrl, muestra un placeholder abstracto (degradado + ícono),
 * nunca una foto de archivo.
 */
export function OrganicPhoto({
  imageUrl,
  alt,
  focalPoint = { x: 50, y: 50 },
  rotate = 0,
  priority = false,
  caption,
  className = "",
}: OrganicPhotoProps) {
  const clipId = useId();
  const maskId = `organic-photo-${clipId.replace(/:/g, "")}`;

  // Mismo SVG orgánico curvo del Figma oficial (viewBox: 0 0 360 320) que usa TravelMaskFrame.
  const maskPath =
    "M0 70C0 31.3401 31.3401 0 70 0H210C292.843 0 360 67.1573 360 150V250C360 288.66 328.66 320 290 320H150C67.1573 320 0 252.843 0 170V70Z";

  return (
    // La posición/tamaño dentro del layout del consumidor vive en `className`
    // (puede ser absolute, relative, con w/h propios) — nunca fijar aquí una
    // clase `relative` que choque con un `absolute` pasado desde afuera.
    <div className={className} style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}>
      <div className="relative w-full h-full">
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <clipPath id={maskId} clipPathUnits="objectBoundingBox">
              <path d={maskPath} transform="scale(0.00277777777, 0.003125)" />
            </clipPath>
          </defs>
        </svg>

        <div
          className="w-full h-full overflow-hidden shadow-hover"
          style={{ clipPath: `url(#${maskId})`, WebkitClipPath: `url(#${maskId})` }}
        >
          {imageUrl ? (
            <ResponsiveImage
              src={imageUrl}
              alt={alt}
              fill
              priority={priority}
              focalPoint={focalPoint}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-atmosphere-sky via-brand-blue to-brand-navy flex items-center justify-center">
              <ImageIcon size={40} className="text-white/25" />
            </div>
          )}
        </div>

        {caption && (
          // Arriba, no abajo: con 5 fotos en el collage, las esquinas inferiores
          // de la foto principal quedan cubiertas por las fotos de apoyo 3/4.
          <div className="absolute left-3.5 top-3.5 bg-brand-navy/85 backdrop-blur-md px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
            <span className="font-sora text-[11px] font-semibold text-white">{caption}</span>
          </div>
        )}
      </div>
    </div>
  );
}
