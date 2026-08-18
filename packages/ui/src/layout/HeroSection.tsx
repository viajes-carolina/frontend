"use client";

import React from "react";
import { HomeHeroDTO, SiteSettingsDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { Button } from "../primitives/Button";
import { ResponsiveImage } from "../primitives/ResponsiveImage";
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
      {/* Background Decorative Blur Orbs */}
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
                className="w-full sm:w-auto"
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

          {/* Right Column: Interactive Featured Card */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-brand-sunset/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-brand-accent/10 blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md bg-brand-navy border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden group hover:border-brand-accent/40 transition-all duration-300">
              
              {/* Media Container with Focal Point */}
              <div className="relative w-full aspect-video sm:h-72 rounded-2xl overflow-hidden mb-5 border border-white/10">
                {hero.backgroundMediaUrl ? (
                  <ResponsiveImage
                    src={hero.backgroundMediaUrl}
                    alt={hero.featuredCardTitle || "Hero Banner"}
                    fill
                    priority
                    focalPoint={{
                      x: hero.backgroundFocalX || 50,
                      y: hero.backgroundFocalY || 40,
                    }}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-blue/30 to-brand-navy flex flex-col items-center justify-center p-5">
                    <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                      <PlaneIcon size={32} />
                    </div>
                  </div>
                )}

                {/* Card Top Badge */}
                {hero.featuredCardBadge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-navy/80 backdrop-blur-md border border-white/20 text-white font-sora text-xs font-bold tracking-wider uppercase shadow-md">
                    {hero.featuredCardBadge}
                  </div>
                )}

                {/* Origin and Price Bar */}
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-xs font-inter text-white/90 bg-brand-navy/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 shadow-md">
                  <span>{hero.featuredCardOrigin || "Desde Lima"}</span>
                  <span className="text-brand-sunset font-sora font-bold text-sm">
                    {hero.featuredCardPricePen ? `Desde S/ ${Number(hero.featuredCardPricePen).toLocaleString()}` : "Cotización a medida"}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="flex flex-col text-left space-y-2">
                <h3 className="font-sora font-bold text-xl text-white">
                  {hero.featuredCardTitle || "Machu Picchu & Valle Sagrado"}
                </h3>
                <p className="font-inter text-atmosphere-sky text-xs">
                  {hero.featuredCardSubtitle || "Experiencia personalizada de 5 días / 4 noches"}
                </p>
                <p className="font-inter text-neutral-subtle text-sm leading-relaxed pt-1">
                  Vuelos confirmados + hoteles seleccionados + asesoría permanente antes, durante y después del viaje.
                </p>
                <div className="flex items-center gap-2 text-xs font-inter text-emerald-400 font-medium pt-2">
                  <CheckIcon size={16} />
                  <span>Salidas disponibles para esta temporada 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
