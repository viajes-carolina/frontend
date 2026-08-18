"use client";

import React from "react";
import { ContactPageDTO } from "@vc/api-client";

export interface ContactHeroSectionProps {
  page?: ContactPageDTO;
  className?: string;
}

export function ContactHeroSection({ page, className = "" }: ContactHeroSectionProps) {
  const badge = page?.heroBadge || "Estamos para Ayudarte";
  const title = page?.heroTitle || "Hablemos de tu próximo destino soñado";
  const subtitle =
    page?.heroSubtitle ||
    "Déjanos tus datos o escríbenos directamente por WhatsApp. Una de nuestras asesoras te responderá con una propuesta personalizada.";

  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-b from-brand-navy via-atmosphere-night to-brand-navy pt-28 pb-16 border-b border-white/10 ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-brand-accent/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 right-10 w-[500px] h-[300px] bg-brand-sunset/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 shadow-sm backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
          <span className="font-sora text-xs font-bold uppercase tracking-[0.1em] text-brand-accent">
            {badge}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-sora font-extrabold text-3xl sm:text-5xl lg:text-[46px] leading-tight text-white max-w-3xl mx-auto">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="font-inter text-atmosphere-sky text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
