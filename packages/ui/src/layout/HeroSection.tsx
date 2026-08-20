"use client";

import React from "react";
import { HomeHeroDTO, SiteSettingsDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { OrganicPhoto } from "../primitives/OrganicPhoto";
import { HeartIcon } from "../icons/icons";

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

  return (
    <section className={`relative w-full overflow-hidden bg-surface-ivory ${className}`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 items-center">
        {/* Columna texto — voz de la agencia, no de una persona individual */}
        <div className="flex flex-col gap-6 max-w-xl animate-hero-fade-up">
          <div>
            <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-[50px] leading-[1.14] tracking-[-0.01em] text-brand-navy">
              {hero.titleHighlight} {hero.titleAccent}
            </h1>
            <svg width="230" height="14" viewBox="0 0 230 14" className="mt-1.5 ml-0.5" aria-hidden="true">
              <path
                d="M3 9 C 50 3, 100 12, 150 6 S 210 3, 227 8"
                stroke="#FF8A1F"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="font-inter text-neutral-muted text-base sm:text-lg leading-relaxed max-w-md">
            {hero.description}
          </p>

          <div>
            <WhatsAppButton size="lg" phone={whatsappPhone} message={message}>
              {hero.whatsappCtaText}
            </WhatsAppButton>
          </div>

          {hero.trustStatText && (
            <div className="flex items-start gap-2.5 max-w-sm">
              <HeartIcon size={18} className="text-brand-accent shrink-0 mt-0.5" />
              <p className="font-inter text-sm text-neutral-muted leading-snug">{hero.trustStatText}</p>
            </div>
          )}
        </div>

        {/* Collage: 1 foto grande de clientes + 4 de apoyo — nunca personal de la agencia.
            5 fotos en total: más densidad para transmitir "hemos acompañado varios viajes". */}
        <div className="relative h-[480px] sm:h-[580px] lg:h-[680px]">
          {/* Bloques de color de fondo, atmósfera cálida, detrás del collage */}
          <div
            className="absolute -right-6 -top-8 w-[85%] h-[55%] rounded-[40px] bg-atmosphere-sky/45 rotate-[8deg] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-2 -bottom-6 w-[75%] h-[48%] rounded-[40px] bg-surface-sand/80 -rotate-[6deg] pointer-events-none"
            aria-hidden="true"
          />

          <OrganicPhoto
            imageUrl={hero.backgroundMediaUrl}
            alt={hero.titleHighlight || "Clientes de Viajes Carolina en su viaje"}
            focalPoint={{ x: hero.backgroundFocalX ?? 50, y: hero.backgroundFocalY ?? 50 }}
            priority
            caption="Viajeros reales, en su propio viaje"
            className="absolute left-0 top-0 w-[58%] h-[86%] -rotate-[1deg] z-[2]"
          />
          <OrganicPhoto
            imageUrl={hero.secondaryMedia1Url}
            alt="Un momento del viaje de un cliente"
            focalPoint={{ x: hero.secondaryMedia1FocalX ?? 50, y: hero.secondaryMedia1FocalY ?? 50 }}
            className="absolute right-0 top-0 w-[38%] h-[42%] rotate-[5deg] z-[3]"
          />
          <OrganicPhoto
            imageUrl={hero.secondaryMedia2Url}
            alt="Otro momento del viaje de un cliente"
            focalPoint={{ x: hero.secondaryMedia2FocalX ?? 50, y: hero.secondaryMedia2FocalY ?? 50 }}
            className="absolute right-[2%] top-[45%] w-[36%] h-[40%] -rotate-[3deg] z-[4]"
          />
          <OrganicPhoto
            imageUrl={hero.secondaryMedia3Url}
            alt="Otro viaje que acompañamos"
            focalPoint={{ x: hero.secondaryMedia3FocalX ?? 50, y: hero.secondaryMedia3FocalY ?? 50 }}
            className="absolute left-[6%] bottom-0 w-[32%] h-[30%] rotate-[4deg] z-[5]"
          />
          <OrganicPhoto
            imageUrl={hero.secondaryMedia4Url}
            alt="Otro viaje que acompañamos"
            focalPoint={{ x: hero.secondaryMedia4FocalX ?? 50, y: hero.secondaryMedia4FocalY ?? 50 }}
            className="absolute left-[36%] bottom-[-4%] w-[26%] h-[26%] -rotate-[6deg] z-[6]"
          />
        </div>
      </div>
    </section>
  );
}
