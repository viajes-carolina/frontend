"use client";

import React from "react";
import { HomeHeroDTO, SiteSettingsDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { Button } from "../primitives/Button";
import { TravelMaskFrame } from "../primitives/TravelMaskFrame";
import { PlaneIcon, ArrowUpRightIcon, CheckIcon } from "../icons/icons";

export interface HeroSectionProps {
  hero: HomeHeroDTO;
  settings?: SiteSettingsDTO;
  className?: string;
}

export function HeroSection({ hero, settings, className = "" }: HeroSectionProps) {
  const whatsappPhone = settings?.whatsappPhone;
  const message =
    hero.whatsappMessageOverride ||
    settings?.whatsappDefaultMessage ||
    "Hola Viajes Carolina, quiero empezar a planear mi próximo viaje.";

  const trustList =
    hero.trustIndicators && hero.trustIndicators.length > 0
      ? hero.trustIndicators
      : ["Asesoría sin costo", "Respuesta rápida", "Acompañamiento real"];

  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-b from-atmosphere-twilight via-brand-navy to-atmosphere-twilight pt-24 sm:pt-32 pb-16 sm:pb-24 border-b border-white/10 ${className}`}
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-brand-blue/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-sunset/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Column: Headline & Action */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            
            {/* Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy/90 border border-white/20 shadow-md backdrop-blur-md mb-6 hover:border-brand-sunset/50 transition-colors">
              <span className="w-2 h-2 rounded-full bg-brand-sunset animate-pulse" />
              <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-sunset">
                {hero.badgeText}
              </span>
            </div>

            {/* Main H1 Title */}
            <h1 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-[52px] leading-[1.12] tracking-[-0.025em] text-white mb-6">
              {hero.titleHighlight}{" "}
              <span className="text-brand-accent">{hero.titleAccent}</span>
            </h1>

            {/* Description */}
            <p className="font-inter text-atmosphere-sky text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              {hero.description}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <WhatsAppButton
                size="lg"
                phone={whatsappPhone}
                message={message}
                className="w-full sm:w-auto shadow-xl"
              >
                {hero.whatsappCtaText}
              </WhatsAppButton>

              {hero.secondaryCtaText && (
                <a href={hero.secondaryCtaUrl || "#promociones"} className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={<ArrowUpRightIcon size={18} />}
                    className="w-full sm:w-auto"
                  >
                    {hero.secondaryCtaText}
                  </Button>
                </a>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-white/10 w-full">
              <div className="font-sora text-[11px] sm:text-xs font-bold tracking-[0.1em] text-neutral-subtle uppercase flex flex-wrap items-center gap-2 sm:gap-3">
                {trustList.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span>{item}</span>
                    {idx < trustList.length - 1 && (
                      <span className="text-brand-accent">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Travel Mask Frame with Featured Trip & Live Trust Micro-Cards */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:items-end relative">
            <TravelMaskFrame
              imageUrl={hero.backgroundMediaUrl || "/media/demo-hero-travel.webp"}
              alt={hero.featuredCardTitle || "Destino de viaje"}
              focalPoint={{
                x: hero.backgroundFocalX || 50,
                y: hero.backgroundFocalY || 40,
              }}
              topBadge={hero.featuredCardBadge || "Destino Recomendado"}
              originText={hero.featuredCardOrigin || "Salidas desde Lima"}
              priceText={
                hero.featuredCardPricePen
                  ? `Desde S/ ${Number(hero.featuredCardPricePen).toLocaleString()}`
                  : "Cotización a medida"
              }
              priority
            />

            {/* Travel Experience Context Bar */}
            <div className="mt-8 w-full max-w-[380px] bg-brand-navy/85 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-lg text-left space-y-1.5 animate-fade-in hover:border-brand-sunset/40 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="font-sora font-bold text-base text-white">
                  {hero.featuredCardTitle || "Machu Picchu & Valle Sagrado"}
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Temporada 2026
                </span>
              </div>
              <p className="font-inter text-xs text-atmosphere-sky line-clamp-1">
                {hero.featuredCardSubtitle || "Experiencia personalizada de 5 días / 4 noches"}
              </p>
              <div className="flex items-center gap-2 text-[11px] font-inter text-neutral-subtle pt-1 border-t border-white/10">
                <CheckIcon size={14} className="text-emerald-400 shrink-0" />
                <span>Vuelos confirmados + hoteles y asesoría permanente</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
