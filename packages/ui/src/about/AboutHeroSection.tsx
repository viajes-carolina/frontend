"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { OrganicPhoto } from "../primitives/OrganicPhoto";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface AboutHeroSectionProps {
  page: AboutPageDTO;
  whatsappPhone?: string;
  className?: string;
}

export function AboutHeroSection({ page, whatsappPhone = DEFAULT_WHATSAPP_PHONE, className = "" }: AboutHeroSectionProps) {
  return (
    <section className={`relative w-full overflow-hidden bg-surface-ivory pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
              {page.heroBadge}
            </p>
            <h1
              className="font-display mt-4 text-4xl font-semibold leading-[1.05] text-brand-navy sm:text-5xl lg:text-[58px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.heroTitle}
            </h1>
            <p className="font-inter mt-5 max-w-lg text-base text-brand-navy/75 sm:text-lg">
              {page.heroSubtitle}
            </p>
            <div className="mt-8">
              <WhatsAppButton phone={whatsappPhone} message="Hola Viajes Carolina, me gustaría conversar sobre mi próximo viaje.">
                Cuéntanos qué imaginas
              </WhatsAppButton>
            </div>
            <p className="font-inter mt-4 text-sm text-brand-navy/60">
              Una persona te responde. Sin formularios impersonales.
            </p>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative w-full max-w-[570px] pb-14 mx-auto">
              <OrganicPhoto
                imageUrl={page.heroMediaUrl}
                alt="Viajeros reales de Viajes Carolina"
                focalPoint={{ x: page.heroFocalX ?? 50, y: page.heroFocalY ?? 50 }}
                priority
                className="aspect-[4/3] w-full"
              />

              {page.heroNoteText && (
                <div className="absolute -bottom-2 right-0 z-0 max-w-[42%] -rotate-2 rounded-[18px] bg-[#f0e5d2] p-5 shadow-sm">
                  <p
                    className="font-display text-base italic leading-snug text-brand-navy sm:text-lg"
                    style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                  >
                    {page.heroNoteText}
                  </p>
                </div>
              )}

              {page.heroCardTitle && (
                <div className="absolute bottom-6 left-4 z-10 max-w-[60%] rotate-2 rounded-[18px] bg-white p-6 shadow-[0px_14px_28px_0px_rgba(20,41,59,0.16)] sm:left-8">
                  {page.heroCardBadge && (
                    <p className="font-sora text-[9px] font-semibold uppercase tracking-wider text-brand-accent">
                      {page.heroCardBadge}
                    </p>
                  )}
                  <p
                    className="font-display mt-2 text-lg font-semibold text-brand-navy sm:text-xl"
                    style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                  >
                    {page.heroCardTitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
