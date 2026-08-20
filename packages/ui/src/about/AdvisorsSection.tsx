"use client";

import React from "react";
import { TravelAdvisorDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface AdvisorsSectionProps {
  advisors: TravelAdvisorDTO[];
  className?: string;
}

export function AdvisorsSection({ advisors, className = "" }: AdvisorsSectionProps) {
  if (!advisors || advisors.length === 0) return null;

  return (
    <section
      id="asesoras"
      className={`relative w-full overflow-hidden bg-white py-16 sm:py-24 border-b border-neutral-border text-neutral-ink ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-soft border border-neutral-border shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Equipo de Expertas
            </span>
          </div>

          <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-brand-navy">
            Conoce a tus Asesoras de Viaje
          </h2>

          <p className="font-inter text-neutral-muted text-base sm:text-lg">
            Atención humana, recomendaciones de primera mano y total respaldo para que tu única tarea sea disfrutar.
          </p>
        </div>

        {/* Advisors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advisors.map((advisor) => {
            const photoUrl = advisor.photoMediaUrl || "/media/demo-cartagena-caribe.webp";
            const message = advisor.whatsappMessageTemplate || `Hola ${advisor.fullName}, me gustaría una asesoría personalizada para planificar mi viaje.`;
            const phone = advisor.whatsappPhone || DEFAULT_WHATSAPP_PHONE;

            return (
              <div
                key={advisor.id}
                className="group relative rounded-3xl overflow-hidden bg-white border border-neutral-border hover:border-brand-accent/40 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
              >
                {/* Photo & Role Header */}
                <div className="relative w-full aspect-4/3 overflow-hidden bg-brand-navy">
                  <img
                    src={photoUrl.startsWith("http") || photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`}
                    alt={advisor.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
                  
                  {/* Specialty Pill */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-navy/90 border border-white/15 font-sora text-[11px] font-bold text-brand-accent backdrop-blur-md">
                      {advisor.specialty}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-1.5">
                    <h3 className="font-sora font-bold text-xl text-brand-navy">
                      {advisor.fullName}
                    </h3>
                    <p className="font-inter text-xs font-semibold text-brand-accent">
                      {advisor.roleTitle}
                    </p>
                    <p className="font-inter text-xs sm:text-sm text-neutral-muted leading-relaxed pt-2">
                      {advisor.bio}
                    </p>
                  </div>

                  {/* Direct WhatsApp Action */}
                  <div className="pt-4 border-t border-neutral-border">
                    <WhatsAppButton
                      variant="link"
                      size="sm"
                      phone={phone}
                      message={message}
                      className="w-full justify-center"
                    >
                      {`Consultar con ${advisor.fullName.split(" ")[0]}`}
                    </WhatsAppButton>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
