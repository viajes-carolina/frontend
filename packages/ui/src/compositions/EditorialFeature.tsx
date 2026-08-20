"use client";

import React from "react";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export type EditorialPanelColor = "sand" | "sky" | "cloud";

const panelColorClass: Record<EditorialPanelColor, string> = {
  sand: "bg-atmosphere-sand",
  sky: "bg-atmosphere-sky",
  cloud: "bg-atmosphere-cloud",
};

export interface EditorialFeatureItem {
  key: string | number;
  imageUrl?: string;
  imageAlt: string;
  focalX?: number;
  focalY?: number;
  eyebrow?: string;
  title: string;
  summary?: string;
  meta?: string;
  panelColor?: EditorialPanelColor;
}

export interface EditorialFeatureProps {
  featured: EditorialFeatureItem;
  secondary: EditorialFeatureItem[];
  featuredBadge?: string;
  /** Slot de acción — cada sección decide su propio CTA (WhatsApp, enlace "Leer más", etc.). */
  renderCta: (item: EditorialFeatureItem, isFeatured: boolean) => React.ReactNode;
  className?: string;
}

/**
 * Patrón editorial compartido: 1 destacado grande + N secundarios, fotografía dominante,
 * panel de texto de color sólido (no card blanca con borde). Reemplaza la grilla de
 * tarjetas idénticas en Promociones y Blog del Inicio.
 *
 * Robustez de imagen: la foto vive en su propio bloque de aspecto fijo con `focalPoint`
 * (object-cover), el texto siempre vive en un panel de color aparte — nunca superpuesto
 * a la imagen — así que funciona igual con fotos horizontales, verticales, oscuras,
 * claras o con rostros, sin depender de que todas compartan proporción.
 */
export function EditorialFeature({
  featured,
  secondary,
  featuredBadge,
  renderCta,
  className = "",
}: EditorialFeatureProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 ${className}`}>
      {/* Destacado */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-5 rounded-3xl overflow-hidden shadow-card">
        <div className="sm:col-span-3 relative aspect-[4/3] sm:aspect-auto bg-neutral-soft">
          <ResponsiveImage
            src={featured.imageUrl || "/media/placeholder.webp"}
            alt={featured.imageAlt}
            fill
            focalPoint={{ x: featured.focalX ?? 50, y: featured.focalY ?? 50 }}
            className="w-full h-full"
          />
          {featuredBadge && (
            <span className="absolute top-4 left-4 font-sora text-[11px] font-bold uppercase tracking-wider text-brand-accent bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              {featuredBadge}
            </span>
          )}
        </div>
        <div className={`sm:col-span-2 flex flex-col justify-center p-6 sm:p-8 ${panelColorClass[featured.panelColor || "sand"]}`}>
          {featured.eyebrow && (
            <span className="font-sora text-xs font-bold uppercase tracking-wider text-brand-accent mb-2">
              {featured.eyebrow}
            </span>
          )}
          <h3 className="font-display font-medium text-2xl sm:text-3xl text-brand-navy leading-tight mb-3">
            {featured.title}
          </h3>
          {featured.summary && (
            <p className="font-sora text-sm text-neutral-muted leading-relaxed mb-4 line-clamp-3">
              {featured.summary}
            </p>
          )}
          {featured.meta && (
            <span className="font-sora text-xs font-semibold text-brand-navy/70 mb-4">{featured.meta}</span>
          )}
          <div className="mt-auto pt-2">{renderCta(featured, true)}</div>
        </div>
      </div>

      {/* Secundarios */}
      <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
        {secondary.map((item) => (
          <div
            key={item.key}
            className="flex-1 grid grid-cols-5 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="col-span-2 relative bg-neutral-soft">
              <ResponsiveImage
                src={item.imageUrl || "/media/placeholder.webp"}
                alt={item.imageAlt}
                fill
                focalPoint={{ x: item.focalX ?? 50, y: item.focalY ?? 50 }}
                className="w-full h-full"
              />
            </div>
            <div className={`col-span-3 flex flex-col justify-center p-4 sm:p-5 ${panelColorClass[item.panelColor || "sky"]}`}>
              {item.eyebrow && (
                <span className="font-sora text-[10px] font-bold uppercase tracking-wider text-brand-navy/60 mb-1">
                  {item.eyebrow}
                </span>
              )}
              <h4 className="font-display font-medium text-base sm:text-lg text-brand-navy leading-snug mb-1.5 line-clamp-2">
                {item.title}
              </h4>
              {item.meta && (
                <span className="font-sora text-[11px] text-neutral-muted mb-2">{item.meta}</span>
              )}
              <div className="mt-1">{renderCta(item, false)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
