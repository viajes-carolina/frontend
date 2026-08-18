"use client";

import React from "react";
import { PromotionDTO, SiteSettingsDTO } from "@vc/api-client";
import { PromotionCard } from "../cards/PromotionCard";
import { Button } from "../primitives/Button";
import { ArrowUpRightIcon } from "../icons/icons";

export interface PromotionsSectionProps {
  promotions: PromotionDTO[];
  settings?: SiteSettingsDTO;
  className?: string;
  showViewAllButton?: boolean;
}

export function PromotionsSection({
  promotions,
  settings,
  className = "",
  showViewAllButton = true,
}: PromotionsSectionProps) {
  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <section
      id="promociones"
      className={`relative w-full overflow-hidden bg-gradient-to-b from-brand-navy to-atmosphere-twilight py-16 sm:py-24 border-b border-white/10 text-white ${className}`}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-sunset/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-blue/15 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 shadow-sm backdrop-blur-md mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
                Ofertas y Temporada 2026
              </span>
            </div>

            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-[40px] leading-tight text-white mb-3">
              Promociones que <span className="text-brand-sunset">inspiran a viajar</span>
            </h2>

            <p className="font-inter text-atmosphere-sky text-base sm:text-lg leading-relaxed">
              Paquetes diseñados por nuestras asesoras expertas con vuelos, hoteles seleccionados y experiencias completas.
            </p>
          </div>

          {showViewAllButton && (
            <a href="/promociones">
              <Button
                variant="secondary"
                size="md"
                icon={<ArrowUpRightIcon size={18} />}
                className="shrink-0"
              >
                Ver todas las promociones
              </Button>
            </a>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {promotions.slice(0, 3).map((promo) => (
            <PromotionCard
              key={promo.id || promo.slug}
              promotion={promo}
              settings={settings}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
