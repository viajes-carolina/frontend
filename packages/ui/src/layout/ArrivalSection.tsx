"use client";

import React from "react";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface ArrivalSectionProps {
  whatsappPhone?: string;
  whatsappMessage?: string;
  className?: string;
}

// Trazos reales exportados desde Figma ("Footer · Guía de llegada y
// responsive", node 317:15, y sus 4 referencias de breakpoint 298:3/67/131/195).
const ARRIVAL_PAPER_PATH =
  "M0 0H1440V198C1274 232 1114 246 948 220C764 191 618 228 452 244C284 260 142 244 0 214V0Z";
const ARRIVAL_ROUTE_PATH = "M10 72C88 20 154 86 236 50C314 16 378 52 472 24";

// Punto de arribo de la ruta narrativa (pregunta final + CTA sobre un papel
// cálido que se funde hacia el navy) — exclusivo de Inicio, no forma parte
// del Footer global.
export function ArrivalSection({
  whatsappPhone = DEFAULT_WHATSAPP_PHONE,
  whatsappMessage = "Hola Viajes Carolina, deseo consultar sobre un viaje.",
  className = "",
}: ArrivalSectionProps) {
  return (
    <section className={`relative w-full overflow-hidden bg-brand-navy text-white ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={ARRIVAL_PAPER_PATH} className="fill-surface-ivory" />
      </svg>

      <div className="relative mx-auto max-w-[1440px] px-6 pb-16 pt-10 sm:pt-12 md:px-10 md:pb-20 xl:px-16">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
          <div className="flex max-w-[560px] flex-col gap-2.5 xl:max-w-[650px]">
            <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-accent sm:text-xs">
              Llegaste hasta aquí
            </p>
            <h2 className="font-display font-semibold leading-[1.08] tracking-[-0.02em] text-brand-navy text-[32px] sm:text-[38px] xl:text-[44px]">
              Llegaste hasta aquí.
              <br />
              ¿Hacia dónde seguimos?
            </h2>
            <p className="max-w-[500px] font-inter text-sm leading-[1.5] text-brand-navy/80">
              Cuéntanos qué imaginas. Te escuchamos y pensamos contigo el siguiente paso.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-4 xl:items-end xl:pt-8">
            <svg
              width="180"
              height="38"
              viewBox="0 0 500 104"
              className="hidden h-auto w-[150px] sm:block xl:w-[180px]"
              aria-hidden="true"
            >
              <path d={ARRIVAL_ROUTE_PATH} className="stroke-brand-navy" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="480" cy="22" r="10" className="fill-brand-accent" />
            </svg>
            <WhatsAppButton size="md" phone={whatsappPhone} message={whatsappMessage} className="w-full sm:w-auto">
              Conversemos por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
