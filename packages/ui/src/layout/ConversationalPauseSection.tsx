"use client";

import React from "react";
import { SiteSettingsDTO, HomeConversationalPauseDTO } from "@vc/api-client";
import { Reveal } from "../primitives/Reveal";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface ConversationalPauseSectionProps {
  config?: HomeConversationalPauseDTO;
  settings?: SiteSettingsDTO;
  className?: string;
}

// Papel continuo hacia Experiencias — ola en la base con el color real de
// la siguiente sección (blanco en base/md, navy en xl). Esta sección en sí
// (arena) no cambia de color por breakpoint, a diferencia de la mayoría.
const WAVE_TO_EXPERIENCIAS_PATH = "M0 60C180 20 340 92 500 55C660 18 820 88 980 50C1140 12 1300 72 1440 38V120H0V60Z";

// Ruta horizontal (Mobile/Tablet) — Figma "Pausa CTA · Ruta · Mobile"
// (node 487:85), mismo trazo proporcionalmente escalado en ambos tramos —
// un solo path, mismo criterio que el resto de rutas horizontales de Inicio.
const ROUTE_HORIZONTAL_PATH = "M0.461934 16.8137C48.4619 -8.18627 92.4619 38.8137 140.462 11.8137C184.462 -9.18627 228.462 30.8137 270.462 0.813733";

// Ruta diagonal (Desktop/Wide) — Figma "Pausa CTA · Ruta · Wide" (node
// 484:79). viewBox 680.742x35.6161.
const ROUTE_WIDE_PATH = "M0.344255 28.9176C120.344 -15.0824 220.344 64.9176 340.344 20.9176C450.344 -19.0824 560.344 52.9176 680.344 0.917556";

const DEFAULT_CONFIG: HomeConversationalPauseDTO = {
  badgeText: "04 · Antes de seguir",
  title: "¿Ya imaginas cómo podría sentirse tu próximo viaje?",
  subtitle: "No necesitas tener todo decidido. Cuéntanos qué te ilusiona y una asesora te ayuda a darle forma.",
  whatsappCtaText: "Conversarlo por WhatsApp",
  whatsappMessageTemplate: "Hola Viajes Carolina, quiero contarles qué tengo en mente para mi próximo viaje.",
};

export function ConversationalPauseSection({ config = DEFAULT_CONFIG, settings, className = "" }: ConversationalPauseSectionProps) {
  return (
    <section
      id="antes-de-seguir"
      className={`relative w-full overflow-hidden bg-atmosphere-sand py-16 sm:py-20 xl:py-28 text-neutral-ink ${className}`}
    >
      {/* Papel continuo hacia Experiencias — ola full-bleed en la base. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 xl:h-24">
        <svg viewBox="0 0 1440 120" className="h-full w-full" preserveAspectRatio="none">
          <path d={WAVE_TO_EXPERIENCIAS_PATH} className="fill-white xl:fill-brand-navy" />
        </svg>
      </div>

      {/* Ruta decorativa — horizontal en base/md, diagonal en xl. Siempre
          bajo el contenido real (no interfiere con el layout). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[20%] flex justify-center xl:hidden">
        <svg viewBox="0 0 270.462 21.4849" className="h-4 w-[180px]" fill="none">
          <path d={ROUTE_HORIZONTAL_PATH} className="stroke-brand-navy" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[14%] hidden w-[28%] xl:block">
        <svg viewBox="0 0 680.742 35.6161" className="h-auto w-full" fill="none" preserveAspectRatio="none">
          <path d={ROUTE_WIDE_PATH} className="stroke-brand-navy" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent"
          style={{ left: `${(680.344 / 680.742) * 100}%`, top: `${(0.917556 / 35.6161) * 100}%` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] xl:px-16">
        <Reveal className="flex flex-col items-center gap-6 text-center xl:flex-row xl:items-center xl:justify-between xl:gap-10 xl:text-left">
          <div className="max-w-xl xl:max-w-none xl:flex-1">
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
            <h2 className="font-display mt-3 text-[32px] font-semibold leading-[1.15] text-brand-navy sm:text-[42px] xl:text-[46px] xl:leading-[1.13]">
              {config.title}
            </h2>
            <p className="font-inter mt-4 text-base leading-relaxed text-neutral-muted xl:max-w-xl">
              {config.subtitle}
            </p>
          </div>

          <WhatsAppButton
            size="lg"
            phone={settings?.whatsappPhone}
            message={config.whatsappMessageTemplate}
            className="shrink-0"
          >
            {config.whatsappCtaText}
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}
