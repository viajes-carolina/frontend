"use client";

import React from "react";
import { PromotionDTO, SiteSettingsDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { MapPinIcon, CheckIcon, PlaneIcon } from "../icons/icons";

export interface PromotionCardProps {
  promotion: PromotionDTO;
  settings?: SiteSettingsDTO;
  className?: string;
}

export function PromotionCard({
  promotion,
  settings,
  className = "",
}: PromotionCardProps) {
  const whatsappPhone = settings?.whatsappPhone;
  const message =
    promotion.whatsappMessageTemplate ||
    `Hola Viajes Carolina, me interesa la promoción "${promotion.title}". ¿Tienen fechas disponibles?`;

  return (
    <div
      className={`group bg-brand-navy border border-white/15 rounded-3xl overflow-hidden shadow-xl hover:border-brand-accent/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Card Image Header */}
        <div className="relative w-full aspect-video sm:h-56 overflow-hidden bg-neutral-surface border-b border-white/10">
          {promotion.featuredMediaUrl ? (
            <ResponsiveImage
              src={promotion.featuredMediaUrl}
              alt={promotion.title}
              fill
              focalPoint={{
                x: promotion.featuredMediaFocalX || 50,
                y: promotion.featuredMediaFocalY || 50,
              }}
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-blue/30 to-brand-navy flex flex-col items-center justify-center p-4">
              <PlaneIcon size={32} className="text-brand-accent mb-1" />
              <span className="font-sora text-xs text-white font-semibold">
                {promotion.destination}
              </span>
            </div>
          )}

          {/* Top Duration & Origin Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy/85 backdrop-blur-md border border-white/20 text-white font-sora text-xs font-bold shadow-md">
            <span>{`${promotion.durationDays}D / ${promotion.durationNights}N`}</span>
            <span className="text-brand-sunset">·</span>
            <span className="text-atmosphere-sky">{promotion.departureCity || "Desde Lima"}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7 space-y-4 text-left">
          
          {/* Destination */}
          <div className="flex items-center gap-1.5 text-xs font-inter text-brand-sunset font-semibold uppercase tracking-wider">
            <MapPinIcon size={14} className="shrink-0" />
            <span className="truncate">{promotion.destination}</span>
          </div>

          {/* Title */}
          <h3 className="font-sora font-bold text-xl sm:text-2xl text-white group-hover:text-brand-accent transition-colors leading-snug line-clamp-2">
            {promotion.title}
          </h3>

          {/* Summary */}
          <p className="font-inter text-xs sm:text-sm text-atmosphere-sky leading-relaxed line-clamp-2">
            {promotion.summary}
          </p>

          {/* Inclusions */}
          {promotion.inclusions && promotion.inclusions.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              {promotion.inclusions.slice(0, 3).map((inc, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-inter text-white/80">
                  <CheckIcon size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{inc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Prices & WhatsApp CTA */}
      <div className="p-6 sm:p-7 pt-0 space-y-4">
        <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <span className="font-inter text-[11px] text-neutral-subtle uppercase tracking-wider block">
              Precio por persona
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-sora font-extrabold text-2xl text-white">
                USD {Number(promotion.priceUsd).toLocaleString()}
              </span>
              {promotion.pricePen && (
                <span className="font-inter text-xs text-brand-sunset font-semibold">
                  (aprox. S/ {Number(promotion.pricePen).toLocaleString()})
                </span>
              )}
            </div>
          </div>
        </div>

        <WhatsAppButton
          size="md"
          phone={whatsappPhone}
          message={message}
          className="w-full shadow-lg"
        >
          Cotizar Paquete
        </WhatsAppButton>
      </div>
    </div>
  );
}
