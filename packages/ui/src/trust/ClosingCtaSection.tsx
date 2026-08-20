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
      className={`w-full bg-neutral-soft py-16 sm:py-24 border-b border-neutral-border ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-atmosphere-twilight via-brand-navy to-atmosphere-twilight rounded-3xl p-8 sm:p-14 border border-white/15 shadow-2xl text-white text-center space-y-8">
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 shadow-sm backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
              <span className="font-sora text-xs font-bold uppercase tracking-[0.1em] text-brand-accent">
                Atención Personalizada
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-[48px] leading-tight text-white max-w-2xl mx-auto">
              Tu próximo viaje comienza con <span className="text-brand-sunset">una conversación</span>
            </h2>

            {/* Subtitle */}
            <p className="font-sora text-atmosphere-sky text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Desde una escapada de fin de semana hasta tu gran aventura soñada. Una asesora experta está lista para diseñar tu itinerario ideal.
            </p>

            {/* CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-sora text-white/80 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckIcon size={16} className="text-emerald-400" />
                <span>Asesoría 100% gratuita</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon size={16} className="text-emerald-400" />
                <span>Respaldo de agencia formal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon size={16} className="text-emerald-400" />
                <span>Atención humana y continua</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
