"use client";

import React, { useId } from "react";
import { ResponsiveImage, FocalPoint } from "../primitives/ResponsiveImage";
import { PolaroidPhoto } from "../primitives/PolaroidPhoto";
import { ImageIcon } from "../icons/icons";

export interface TravelMemory {
  id: string;
  src?: string;
  alt: string;
  focalPoint?: FocalPoint;
  placement: "main" | "top" | "side" | "bottom";
  /** Clases Tailwind de filtro (saturate/contrast/brightness/hue-rotate) para
   * unificar el tratamiento fotográfico entre fotos de distinta luz/clima. */
  colorGrade?: string;
}

// Trazo real exportado desde Figma ("Foto principal · máscara orgánica",
// node 268:279) — viewBox 620x640. Se reutiliza en los 3 breakpoints:
// clipPathUnits="objectBoundingBox" estira la misma silueta orgánica a la
// caja de cada tamaño (mobile/tablet/desktop), igual que hace el resto del
// collage con sus propias proporciones por breakpoint.
const MAIN_PHOTO_CLIP_PATH =
  "M112 18C190 4 270 28 350 13C442 -4 532 15 620 48V618C540 631 470 612 394 626C310 642 222 624 150 634C105 640 72 616 77 580C81 546 47 520 63 486C78 453 38 424 55 388C70 355 35 321 53 287C71 252 36 219 55 184C73 150 46 116 65 83C77 59 86 36 112 18Z";
const MAIN_PHOTO_CLIP_SCALE_X = 1 / 620;
const MAIN_PHOTO_CLIP_SCALE_Y = 1 / 640;

function MainPhoto({ memory, className }: { memory: TravelMemory; className: string }) {
  const clipId = useId();
  const maskId = `hero-main-photo-${clipId.replace(/:/g, "")}`;

  return (
    <figure className={`${className} overflow-hidden`}>
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id={maskId} clipPathUnits="objectBoundingBox">
            <path d={MAIN_PHOTO_CLIP_PATH} transform={`scale(${MAIN_PHOTO_CLIP_SCALE_X}, ${MAIN_PHOTO_CLIP_SCALE_Y})`} />
          </clipPath>
        </defs>
      </svg>
      <div className="relative w-full h-full" style={{ clipPath: `url(#${maskId})`, WebkitClipPath: `url(#${maskId})` }}>
        {memory.src ? (
          <ResponsiveImage
            src={memory.src}
            alt={memory.alt}
            fill
            priority
            focalPoint={memory.focalPoint}
            className="w-full h-full"
            imgClassName={memory.colorGrade}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-atmosphere-sky via-brand-blue to-brand-navy flex items-center justify-center">
            <ImageIcon size={44} className="text-white/25" />
          </div>
        )}
        {/* Fundido hacia el texto: recortado a la misma silueta orgánica de
            la foto (no un rectángulo aparte flotando encima). */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--color-surface-ivory) 0%, color-mix(in srgb, var(--color-surface-ivory) 88%, transparent) 12%, color-mix(in srgb, var(--color-surface-ivory) 55%, transparent) 30%, color-mix(in srgb, var(--color-surface-ivory) 22%, transparent) 45%, transparent 62%)",
          }}
        />
      </div>
    </figure>
  );
}

export interface TravelMemoriesCollageProps {
  memories: TravelMemory[];
  className?: string;
}

/**
 * Collage editorial de recuerdos de viaje reales — implementa la "Guía ·
 * Comportamiento responsive" (Figma node 288:100) y sus 4 referencias de
 * breakpoint (Mobile 390 / Tablet 1024 / Desktop 1440 / Wide Desktop 1920,
 * nodes 281:84 / 281:57 / 281:30 / 281:3). Sin cajas propias: cada foto se
 * posiciona en % contra el mismo canvas 390×908 / 1024×908 / 1440×828 que
 * usa `HeroSection` para el texto — mismo sistema de coordenadas en los 3
 * tramos. "Recuerdo 02 · puente" solo existe desde el tramo desktop (≥1280);
 * mobile y tablet muestran únicamente 2 recuerdos, tal como pide la guía.
 */
export function TravelMemoriesCollage({ memories, className = "" }: TravelMemoriesCollageProps) {
  const main = memories.find((item) => item.placement === "main");
  const top = memories.find((item) => item.placement === "top");
  const side = memories.find((item) => item.placement === "side");
  const bottom = memories.find((item) => item.placement === "bottom");

  if (!main) return null;

  return (
    <div className={`${className} overflow-hidden`}>
      <MainPhoto
        memory={main}
        className="absolute z-10 left-[6.67%] top-[54.63%] w-[76.92%] h-[35.24%] md:left-[38.09%] md:top-[9.25%] md:w-[48.83%] md:h-[60.35%] xl:left-[35.07%] xl:top-[6.04%] xl:w-[43.06%] xl:h-[77.29%] animate-hero-postal-in animation-delay-100"
      />

      {top && (
        <PolaroidPhoto
          imageUrl={top.src}
          alt={top.alt}
          focalPoint={top.focalPoint}
          rotate={-6}
          tape="top"
          colorGrade={top.colorGrade}
          className="absolute z-30 left-[51.17%] top-[48.96%] w-[44.62%] h-[12.78%] md:left-[69.2%] md:top-[2.37%] md:w-[26.17%] md:h-[19.6%] xl:left-[72.3%] xl:top-[1.82%] xl:w-[24.31%] xl:h-[28.02%] animate-hero-postal-in animation-delay-200"
        />
      )}

      {side && (
        <PolaroidPhoto
          imageUrl={side.src}
          alt={side.alt}
          focalPoint={side.focalPoint}
          rotate={4}
          tape="none"
          colorGrade={side.colorGrade}
          className="hidden xl:block absolute z-30 xl:left-[74.41%] xl:top-[34.42%] xl:w-[22.36%] xl:h-[28.02%] animate-hero-postal-in animation-delay-300"
        />
      )}

      {bottom && (
        <PolaroidPhoto
          imageUrl={bottom.src}
          alt={bottom.alt}
          focalPoint={bottom.focalPoint}
          rotate={-5}
          tape="top"
          colorGrade={bottom.colorGrade}
          className="absolute z-30 left-[37.73%] top-[78.87%] w-[56.92%] h-[14.1%] md:left-[59.36%] md:top-[57.58%] md:w-[33.2%] md:h-[21.59%] xl:left-[58.3%] xl:top-[60.59%] xl:w-[28.47%] xl:h-[28.5%] animate-hero-postal-in animation-delay-400"
        />
      )}
    </div>
  );
}
