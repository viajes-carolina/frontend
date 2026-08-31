"use client";

import Image from "next/image";
import { ImageIcon } from "@vc/ui";
import type { MediaSummary } from "../lib/mediaSummary";

export interface HeroPhotoRowProps {
  /** Id del control que abre el selector; sirve de `aria-labelledby` de la fila. */
  labelId: string;
  label: string;
  summary: MediaSummary;
  imageSrc?: string;
  focalX?: number;
  focalY?: number;
  onOpenPicker: () => void;
}

/**
 * Ficha de una foto del collage del Hero (Figma 958:459, punto 1).
 *
 * La revisión de Figma la encoge para que quepan dos por fila: miniatura de
 * 76×54 con radio 6px, nombre y metadatos a su derecha y una acción TEXTUAL
 * "Cambiar" — antes era una miniatura de 104×68 y un botón con borde, que en
 * una rejilla 2×2 no entra.
 *
 * "Cambiar" sigue siendo un `<button>` real (no un `<span>` con `onClick`):
 * lo que cambia es su apariencia, no su semántica ni su foco visible.
 *
 * Es solo la parte visible: el modal, la carga de la biblioteca y el guardado
 * del punto focal siguen viviendo en `HeroPhotoSlot`, que es quien la usa.
 */
export function HeroPhotoRow({
  labelId,
  label,
  summary,
  imageSrc,
  focalX,
  focalY,
  onOpenPicker,
}: HeroPhotoRowProps) {
  return (
    <div>
      <p
        id={labelId}
        className="mb-1.5 font-inter text-[9px] font-semibold uppercase tracking-[0.45px] text-neutral-muted"
      >
        {label}
      </p>

      <div className="flex items-center gap-2.5 rounded-[6px] border border-neutral-border bg-admin-field p-2.5">
        <div className="relative h-[54px] w-[76px] shrink-0 overflow-hidden rounded-[6px] border border-neutral-border bg-neutral-soft">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              unoptimized
              sizes="76px"
              style={{ objectFit: "cover", objectPosition: `${focalX ?? 50}% ${focalY ?? 50}%` }}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-neutral-muted">
              <ImageIcon size={18} aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-inter text-[11px] font-semibold text-neutral-ink">
            {summary.name}
          </p>
          <p className="mt-0.5 truncate font-inter text-[10px] text-neutral-muted">
            {summary.specs}
          </p>
          <p className="mt-0.5 truncate font-inter text-[10px] text-neutral-muted">
            {summary.focal}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPicker}
          // El nombre accesible empieza por el texto visible ("Cambiar") y lo
          // completa con la ranura, para distinguir las cuatro fichas entre sí.
          aria-label={`Cambiar ${label}`}
          className="shrink-0 cursor-pointer rounded-[4px] px-1 font-inter text-[10px] font-semibold text-brand-accent underline-offset-2 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          Cambiar
        </button>
      </div>
    </div>
  );
}
