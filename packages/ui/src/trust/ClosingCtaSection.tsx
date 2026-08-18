"use client";

import React from "react";
import { SiteSettingsDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { CheckIcon } from "../icons/icons";

export interface ClosingCtaSectionProps {
  settings?: SiteSettingsDTO;
  className?: string;
}

export function ClosingCtaSection({ settings, className = "" }: ClosingCtaSectionProps) {
  const whatsappPhone = settings?.whatsappPhone;
  const message =
    settings?.whatsappDefaultMessage ||
    "Hola Viajes Carolina, quiero empezar a planear mi próximo viaje. ¿Me podrían asesorar?";

  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-b from-brand-navy to-atmosphere-twilight py-20 sm:py-28 border-b border-white/10 text-white ${className}`}
    >
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-sunset/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 shadow-sm backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
          <span className="font-sora text-xs font-bold uppercase tracking-[0.1em] text-brand-accent">
            Atención Personalizada
          </span>
        </div>

        {/* Title */}
        <h2 className="font-sora font-extrabold text-3xl sm:text-5xl lg:text-[44px] leading-tight text-white max-w-2xl mx-auto">
          Tu próximo viaje comienza con <span className="text-brand-sunset">una conversación</span>
        </h2>

        {/* Subtitle */}
        <p className="font-inter text-atmosphere-sky text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Desde una escapada de fin de semana hasta tu gran aventura soñada. Una asesora experta está lista para diseñar tu itinerario ideal.
        </p>

        {/* CTA Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <WhatsAppButton
            size="lg"
            phone={whatsappPhone}
            message={message}
            className="w-full sm:w-auto shadow-2xl px-8 py-4 text-base"
          >
            Hablar con una Asesora por WhatsApp
          </WhatsAppButton>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-inter text-white/80">
          <div className="flex items-center gap-2">
            <CheckIcon size={16} className="text-emerald-400" />
            <span>Asesoría 100% gratuita</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon size={16} className="text-emerald-400" />
            <span>Sin letra chica</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon size={16} className="text-emerald-400" />
            <span>Respaldo antes y durante tu viaje</span>
          </div>
        </div>

      </div>
    </section>
  );
}
