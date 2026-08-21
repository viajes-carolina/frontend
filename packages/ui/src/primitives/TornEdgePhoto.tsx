"use client";

import React, { useId } from "react";
import { ResponsiveImage, FocalPoint } from "./ResponsiveImage";
import { ImageIcon } from "../icons/icons";

export interface TornEdgePhotoProps {
  imageUrl?: string;
  alt: string;
  focalPoint?: FocalPoint;
  priority?: boolean;
  className?: string;
}

/**
 * Foto principal a sangre completa con un borde izquierdo irregular tipo
 * "papel rasgado", sin marco ni cinta — para que se funda con el fondo
 * cálido en vez de leerse como una tarjeta aparte. Reservada a la foto
 * protagonista del collage (las de apoyo usan PolaroidPhoto).
 */
export function TornEdgePhoto({
  imageUrl,
  alt,
  focalPoint = { x: 50, y: 50 },
  priority = false,
  className = "",
}: TornEdgePhotoProps) {
  const clipId = useId();
  const maskId = `torn-edge-${clipId.replace(/:/g, "")}`;

  return (
    <div className={className}>
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id={maskId} clipPathUnits="objectBoundingBox">
            {/* Trazo de pincel suave, no zigzag geométrico — curvas, no ángulos */}
            <path d="M0.11,0 C0.02,0.05 0.09,0.11 0.04,0.16 C0.01,0.2 0.08,0.24 0.07,0.29 C0.06,0.34 0.01,0.37 0.03,0.42 C0.06,0.47 0.1,0.49 0.05,0.55 C0.01,0.6 0.07,0.63 0.06,0.68 C0.05,0.73 0,0.77 0.04,0.82 C0.08,0.87 0.09,0.9 0.05,0.94 C0.02,0.97 0.06,0.99 0.08,1 L1,1 L1,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative w-full h-full overflow-hidden shadow-hover"
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
            <ImageIcon size={44} className="text-white/25" />
          </div>
        )}
      </div>
    </div>
  );
}
