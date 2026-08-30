"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { HeartIcon } from "../icons/icons";

export interface AboutHeroSectionProps {
  page: AboutPageDTO;
  whatsappPhone?: string;
  className?: string;
}

// Mismo subrayado orgánico a mano alzada usado en HeroSection.tsx (Inicio) y
// BlogHeroSection.tsx — se reutiliza el trazo tal cual para mantener la
// misma "voz" gráfica entre heroes del sitio.
const UNDERLINE_PATH = "M3 10.5C40 2 90 2 130 8C175 14.5 230 3 297 6";

// Atmósfera decorativa detrás de la ficha institucional — mismo criterio que
// `AtmosphereCircle` en BlogFeaturedStoryCard.tsx (degradado radial simple,
// sin foto real detrás). Vive local a este archivo: es el único hero del
// sitio sin fotografía, no amerita una primitiva compartida para 1 solo uso.
function AtmosphereGlow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-2xl ${className}`}
      style={{ background: "linear-gradient(135deg, #9FD5E8 0%, #E7D7B7 52%, #FFB76A 100%)" }}
    />
  );
}

export function AboutHeroSection({ page, whatsappPhone = DEFAULT_WHATSAPP_PHONE, className = "" }: AboutHeroSectionProps) {
  const detailLines = (page.heroCardDetail || "").split("\n").filter(Boolean);

  return (
    <section className={`relative w-full overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
              {page.heroBadge}
            </p>
            <div className="mt-4 flex flex-col gap-1">
              <h1
                className="font-display text-4xl font-semibold leading-[1.05] text-brand-navy sm:text-5xl lg:text-[58px]"
                style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
              >
                {page.heroTitle}
              </h1>
              <svg aria-hidden="true" viewBox="0 0 300 16" className="h-3 w-40 text-brand-accent sm:w-52" fill="none">
                <path d={UNDERLINE_PATH} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
            <p className="font-inter mt-5 max-w-lg text-base text-brand-navy/75 sm:text-lg">
              {page.heroSubtitle}
            </p>
            <div className="mt-8">
              <WhatsAppButton phone={whatsappPhone} message="Hola Viajes Carolina, me gustaría conversar sobre mi próximo viaje.">
                Conversemos por WhatsApp
              </WhatsAppButton>
            </div>
            {page.heroNoteText && (
              <div className="mt-4 flex items-center gap-2">
                <HeartIcon size={18} className="shrink-0 text-brand-accent" />
                <p className="font-inter text-sm text-brand-navy/60">{page.heroNoteText}</p>
              </div>
            )}
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto w-full max-w-[480px] py-8">
              <AtmosphereGlow className="-top-8 -right-6 h-2/3 w-2/3 opacity-70" />
              <AtmosphereGlow className="-bottom-10 -left-8 h-1/2 w-1/2 opacity-50" />

              <div className="relative overflow-hidden rounded-[32px] bg-brand-navy px-8 py-10 shadow-[0px_24px_48px_0px_rgba(20,41,59,0.28)] sm:px-10 sm:py-12">
                {page.heroCardBadge && (
                  <p className="font-sora text-[11px] font-semibold uppercase tracking-wider text-brand-accent">
                    {page.heroCardBadge}
                  </p>
                )}
                {page.heroCardTitle && (
                  <p
                    className="font-display mt-3 text-2xl font-semibold text-white sm:text-3xl"
                    style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                  >
                    {page.heroCardTitle}
                  </p>
                )}
                {page.heroCardLocation && (
                  <p className="font-inter mt-4 text-sm font-semibold text-white/90">{page.heroCardLocation}</p>
                )}
                {detailLines.length > 0 && (
                  <div className="mt-6 space-y-1 border-t border-white/15 pt-6">
                    {detailLines.map((line, i) => (
                      <p key={i} className="font-inter text-sm text-white/70">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
