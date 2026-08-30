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
 * Fila de selección de imagen del editor de contenidos (Figma 930:4):
 * miniatura de 104×68, nombre de archivo y dos líneas de metadatos a su
 * derecha, y el botón "Cambiar" al final.
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
      <p id={labelId} className="mb-1.5 font-inter text-[9px] font-semibold uppercase tracking-[0.45px] text-neutral-muted">
        {label}
      </p>

      <div className="flex items-center gap-3 rounded-[6px] bg-admin-field p-2.5">
        <div className="relative h-[68px] w-[104px] shrink-0 overflow-hidden rounded-[5px] border border-neutral-border bg-neutral-soft">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              unoptimized
              sizes="104px"
              style={{ objectFit: "cover", objectPosition: `${focalX ?? 50}% ${focalY ?? 50}%` }}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-neutral-muted">
              <ImageIcon size={20} aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-inter text-[11px] font-semibold text-neutral-ink">{summary.name}</p>
          <p className="mt-1 truncate font-inter text-[10px] text-neutral-muted">{summary.specs}</p>
          <p className="mt-0.5 truncate font-inter text-[10px] text-neutral-muted">{summary.focal}</p>
        </div>

        <button
          type="button"
          onClick={onOpenPicker}
          // El nombre accesible empieza por el texto visible ("Cambiar") y lo
          // completa con la ranura, para distinguir las cuatro filas entre sí.
          aria-label={`Cambiar ${label}`}
          className="shrink-0 cursor-pointer rounded-[6px] border border-neutral-border bg-white px-3 py-2 font-inter text-[10px] font-semibold text-brand-navy transition-colors hover:bg-neutral-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          Cambiar
        </button>
      </div>
    </div>
  );
}
