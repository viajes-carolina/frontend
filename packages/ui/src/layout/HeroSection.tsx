"use client";

import React from "react";
import { HomeHeroDTO, SiteSettingsDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { ResponsiveImage } from "../primitives/ResponsiveImage";
import { PlaneIcon, CheckIcon, StarIcon } from "../icons/icons";

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
      className={`relative w-full overflow-hidden min-h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-5rem)] flex items-center justify-center border-b border-white/10 py-12 lg:py-0 ${className}`}
    >
      {/* 1. Cinematic Full-Bleed Panoramic Background Image */}
      {hero.backgroundMediaUrl ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <ResponsiveImage
            src={hero.backgroundMediaUrl}
            alt={hero.titleHighlight || "Fondo de viaje Viajes Carolina"}
            fill
            priority
            focalPoint={{
              x: hero.backgroundFocalX || 50,
              y: hero.backgroundFocalY || 40,
            }}
            className="w-full h-full object-cover scale-105 transition-transform duration-1000 ease-out"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-atmosphere-twilight via-brand-navy to-atmosphere-twilight" />
      )}

      {/* 2. Atmospheric & High-Contrast Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-atmosphere-twilight/80 via-brand-navy/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-atmosphere-twilight/70 via-transparent to-black/30 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-blue/20 blur-[130px] pointer-events-none rounded-full z-1" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-brand-sunset/15 blur-[120px] pointer-events-none rounded-full z-1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Column: Headline, Subtitle, Direct WhatsApp CTA & Trust */}
          <div className="w-full lg:w-7/12 flex flex-col items-start text-left">
            
            {/* Eyebrow Badge Pill */}
            <div className="animate-hero-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-md backdrop-blur-md mb-5 hover:border-brand-sunset/50 transition-colors">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-sunset">
                {hero.badgeText || "Una nueva forma de viajar"}
              </span>
            </div>

            {/* Main H1 Title */}
            <h1 className="animate-hero-fade-up animation-delay-100 font-sora font-extrabold text-3xl sm:text-4xl lg:text-[48px] leading-[1.12] tracking-[-0.025em] text-white mb-5 max-w-xl">
              {hero.titleHighlight}{" "}
              <span className="text-brand-accent">{hero.titleAccent}</span>
            </h1>

            {/* Description Subtitle */}
            <p className="animate-hero-fade-up animation-delay-200 font-inter text-atmosphere-sky text-sm sm:text-base lg:text-lg leading-relaxed mb-7 max-w-lg">
              {hero.description}
            </p>

            {/* Single Prominent WhatsApp CTA: Cuéntame tu viaje */}
            <div className="animate-hero-fade-up animation-delay-300 mb-8 w-full sm:w-auto">
              <WhatsAppButton
                size="lg"
                phone={whatsappPhone}
                message={message}
                className="w-full sm:w-auto shadow-2xl !py-4 px-8 text-base font-bold"
              >
                {hero.whatsappCtaText}
              </WhatsAppButton>
            </div>

            {/* Trust Indicators */}
            <div className="animate-hero-fade-up animation-delay-400 pt-5 border-t border-white/15 w-full">
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

          {/* Right Column: Glassmorphism Service Card (3 Core Value Pillars) */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
            <div className="animate-hero-scale-in animation-delay-200 w-full max-w-md bg-brand-navy/75 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-left space-y-4 hover:border-brand-sunset/40 transition-all duration-300">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex flex-col">
                  <span className="font-sora font-bold text-xs uppercase tracking-wider text-brand-sunset">
                    Servicios Diseñados para Ti
                  </span>
                  <span className="font-inter text-[11px] text-atmosphere-sky">
                    Todo lo que necesitas para tu viaje en un solo lugar
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  100% Flexible
                </span>
              </div>

              {/* 3 Core Service Pillars */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-brand-sunset shrink-0 mt-0.5 shadow-sm">
                    <PlaneIcon size={16} />
                  </div>
                  <div>
                    <span className="font-sora font-bold text-xs sm:text-sm text-white block">
                      Vuelos & Rutas Optimizadas
                    </span>
                    <span className="font-inter text-[11px] text-atmosphere-sky leading-snug block">
                      Conexiones inteligentes con las mejores aerolíneas y equipaje incluido.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-brand-sunset shrink-0 mt-0.5 shadow-sm">
                    <CheckIcon size={16} className="text-brand-sunset" />
                  </div>
                  <div>
                    <span className="font-sora font-bold text-xs sm:text-sm text-white block">
                      Hoteles & Resorts Seleccionados
                    </span>
                    <span className="font-inter text-[11px] text-atmosphere-sky leading-snug block">
                      Alojamientos recomendados según tu estilo, comodidad y presupuesto.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-brand-sunset shrink-0 mt-0.5 shadow-sm">
                    <span className="text-sm">🗺️</span>
                  </div>
                  <div>
                    <span className="font-sora font-bold text-xs sm:text-sm text-white block">
                      Itinerarios a tu Medida
                    </span>
                    <span className="font-inter text-[11px] text-atmosphere-sky leading-snug block">
                      Experiencias y actividades diseñadas para disfrutar a tu propio ritmo.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

