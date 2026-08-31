"use client";

import Image from "next/image";
import { ImageIcon } from "@vc/ui";
import { resolveMediaSrc } from "../../../lib/mediaSummary";

/**
 * Piezas sueltas del mock de portada que dibuja `HeroPreviewCard`: la barra de
 * navegación y cada foto del collage. Viven aparte para que la tarjeta se lea
 * de un vistazo como lo que es, una plantilla.
 */

/** Los mismos enlaces que sirve `SiteHeader` en la portada. */
const NAV_LABELS = ["Inicio", "Nosotros", "Blog", "Contacto"];

export interface PreviewNavbarProps {
  mobile: boolean;
}

/**
 * Barra de navegación del sitio, a escala, para que la miniatura se lea como
 * "la portada" y no como un recorte suelto (Figma 958:459, punto 5).
 *
 * Va `aria-hidden`: es decoración de la vista previa, no contenido editable, y
 * repetir cinco enlaces falsos en el lector de pantalla solo estorbaría.
 */
export function PreviewNavbar({ mobile }: PreviewNavbarProps) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-between gap-2 border-b border-brand-navy/10 bg-white/70 px-3 py-2"
    >
      <span className="font-display text-[10px] font-semibold tracking-[-0.01em] text-brand-navy">
        Viajes Carolina
      </span>

      {mobile ? (
        <span className="flex flex-col gap-[2px]">
          {[0, 1, 2].map((line) => (
            <span key={line} className="block h-[1.5px] w-3 rounded-full bg-brand-navy/50" />
          ))}
        </span>
      ) : (
        <span className="flex items-center gap-2.5">
          {NAV_LABELS.map((label) => (
            <span key={label} className="font-inter text-[8px] font-medium text-brand-navy/70">
              {label}
            </span>
          ))}
          <span className="rounded-full bg-brand-whatsapp px-2 py-[3px] font-sora text-[8px] font-bold text-brand-navy">
            WhatsApp
          </span>
        </span>
      )}
    </div>
  );
}

export interface PreviewPhotoProps {
  url?: string;
  focalX?: number;
  focalY?: number;
  className: string;
}

/** Una foto del collage, recortada por su punto focal como en el sitio. */
export function PreviewPhoto({ url, focalX, focalY, className }: PreviewPhotoProps) {
  const src = resolveMediaSrc(url);
  return (
    <div
      className={`relative overflow-hidden border border-white bg-neutral-soft shadow-sm ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes="200px"
          style={{ objectFit: "cover", objectPosition: `${focalX ?? 50}% ${focalY ?? 50}%` }}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-neutral-muted">
          <ImageIcon size={14} aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
