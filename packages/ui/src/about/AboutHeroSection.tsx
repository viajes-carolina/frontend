"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";

export interface AboutHeroSectionProps {
  page: AboutPageDTO;
  className?: string;
}

export function AboutHeroSection({ page, className = "" }: AboutHeroSectionProps) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-brand-navy pt-24 pb-16 sm:pt-32 sm:pb-20 border-b border-white/10 text-white ${className}`}
    >
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-sunset/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
            {page.heroBadge || "Conoce Nuestra Esencia"}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-sora font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white max-w-4xl mx-auto leading-tight">
          {page.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="font-inter text-atmosphere-sky text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {page.heroSubtitle}
        </p>

        {/* Stats Grid */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-sm">
            <span className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-accent block">
              {page.experienceYears}+
            </span>
            <span className="font-inter text-xs text-atmosphere-sky mt-1 block">
              Años de Experiencia
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-sm">
            <span className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-sunset block">
              {page.happyTravelers >= 1000 ? `${(page.happyTravelers / 1000).toFixed(0)}k+` : `${page.happyTravelers}+`}
            </span>
            <span className="font-inter text-xs text-atmosphere-sky mt-1 block">
              Viajeros Felices
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-sm">
            <span className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-accent block">
              {page.destinationsCount}+
            </span>
            <span className="font-inter text-xs text-atmosphere-sky mt-1 block">
              Destinos Globales
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-sm">
            <span className="font-sora font-extrabold text-3xl sm:text-4xl text-emerald-400 block">
              {page.satisfactionRatePercent}%
            </span>
            <span className="font-inter text-xs text-atmosphere-sky mt-1 block">
              Satisfacción Garantizada
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
