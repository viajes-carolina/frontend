"use client";

import React, { useId, useState } from "react";
import { FaqItemDTO, SiteSettingsDTO, HomeFaqSectionDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { Reveal } from "../primitives/Reveal";

export interface FaqSectionProps {
  faqs: FaqItemDTO[];
  settings?: SiteSettingsDTO;
  config?: HomeFaqSectionDTO;
  className?: string;
}

const DEFAULT_CONFIG: HomeFaqSectionDTO = {
  badgeText: "06 · Antes de continuar",
  title: "Lo que solemos conversar antes de viajar",
  subtitle: "Es normal tener dudas sobre fechas, pagos o destinos. Aquí respondemos las más frecuentes.",
};

// Ruta "hacia la llegada" (Desktop/Wide) — Figma node 408:40, un punto por
// pregunta (el primero relleno, los siguientes huecos) que termina en el
// CTA de WhatsApp. viewBox 760x390.
const ROUTE_TALL_PATH = "M54 0C24 72 86 108 54 170C24 230 82 278 54 310C164 374 442 344 708 382";
const ROUTE_TALL_DOTS = [
  { cx: 54, cy: 0, hollow: false },
  { cx: 54, cy: 150, hollow: true },
  { cx: 54, cy: 228, hollow: true },
  { cx: 54, cy: 306, hollow: true },
  { cx: 708, cy: 382, hollow: false },
];

// Ruta horizontal (Mobile/Tablet) — "Ruta · 05 Aclarar" (nodes 396:928 /
// 396:693), propia de esta sección.
const ROUTE_HORIZONTAL_PATH = "M0.96 15.84C47.04 2.4 84.48 21.6 129.6 10.08C175.2 -1.44 212.16 12.48 264 3.84";

function openWhatsApp(phone: string | undefined, message: string) {
  const cleanPhone = (phone || DEFAULT_WHATSAPP_PHONE).replace(/[^0-9]/g, "");
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function AskDifferentBox({
  phone,
  className = "",
  textClassName = "",
}: {
  phone?: string;
  className?: string;
  textClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        openWhatsApp(phone, "Hola Viajes Carolina, tengo una consulta sobre sus servicios y paquetes turísticos.")
      }
      className={`rounded-[20px] px-6 py-5 text-left transition-transform hover:scale-[1.01] ${className}`}
    >
      <p className={`font-inter text-sm font-semibold text-brand-navy ${textClassName}`}>
        ¿Tu pregunta es diferente?&nbsp;&nbsp;
        <span className="underline decoration-brand-navy/30 underline-offset-2">Pregúntanos por WhatsApp →</span>
      </p>
    </button>
  );
}

function AccordionItem({
  faq,
  isOpen,
  onToggle,
  variant = "plain",
}: {
  faq: FaqItemDTO;
  isOpen: boolean;
  onToggle: () => void;
  variant?: "plain" | "highlighted";
}) {
  const panelId = useId();
  return (
    <div className={`relative ${isOpen && variant === "highlighted" ? "xl:rounded-[22px] xl:bg-neutral-white xl:shadow-[0_12px_28px_-8px_rgba(20,41,59,0.12)] xl:-mx-8 xl:px-8" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-6 py-[18px] text-left"
      >
        <span className="font-inter text-[15px] font-semibold text-brand-navy">{faq.question}</span>
        <span className="font-inter shrink-0 text-xl font-semibold text-brand-accent" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <p id={panelId} className="font-inter pb-[18px] pr-8 text-sm leading-relaxed text-brand-navy">
          {faq.answer}
        </p>
      )}
      <div className="h-px w-full bg-brand-navy/[0.08]" aria-hidden="true" />
    </div>
  );
}

export function FaqSection({ faqs, settings, config = DEFAULT_CONFIG, className = "" }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className={`relative w-full overflow-hidden bg-surface-ivory py-16 sm:py-20 xl:py-28 text-neutral-ink ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] xl:px-16">
        {/* Mobile — una columna */}
        <div className="md:hidden">
          <Reveal>
            <svg aria-hidden="true" viewBox="0 0 268.8 23.04" className="mb-4 h-4 w-[180px]" fill="none">
              <path d={ROUTE_HORIZONTAL_PATH} className="stroke-brand-navy" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <circle cx="264.5" cy="3.84" r="4" className="fill-brand-accent" />
            </svg>
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy">
              {config.title}
            </h2>
            <p className="font-inter mt-3 text-sm leading-relaxed text-brand-navy">
              {config.subtitle}
            </p>
          </Reveal>

          <Reveal delayMs={160} className="mt-10">
            {faqs.map((faq, idx) => (
              <AccordionItem key={faq.id || idx} faq={faq} isOpen={openIndex === idx} onToggle={() => toggleIndex(idx)} />
            ))}
          </Reveal>

          <Reveal delayMs={240}>
            <AskDifferentBox phone={settings?.whatsappPhone} className="mt-8 w-full bg-atmosphere-pale-sky" textClassName="text-[13px]" />
          </Reveal>
        </div>

        {/* Tablet — encabezado a la izquierda, acordeón a la derecha */}
        <div className="hidden md:flex md:gap-16 xl:hidden">
          <Reveal className="w-[38%]">
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
            <h2 className="font-display mt-3 text-[32px] font-semibold leading-[1.13] text-brand-navy">
              {config.title}
            </h2>
            <p className="font-inter mt-3 text-[15px] leading-relaxed text-brand-navy">
              {config.subtitle}
            </p>
          </Reveal>
          <div className="flex-1">
            <Reveal delayMs={160}>
              {faqs.map((faq, idx) => (
                <AccordionItem key={faq.id || idx} faq={faq} isOpen={openIndex === idx} onToggle={() => toggleIndex(idx)} />
              ))}
            </Reveal>
            <Reveal delayMs={240}>
              <AskDifferentBox phone={settings?.whatsappPhone} className="mt-8 w-full bg-atmosphere-pale-sky" />
            </Reveal>
          </div>
        </div>

        {/* Desktop / Wide — con ruta punteada y respuesta abierta destacada */}
        <div className="hidden xl:block">
          <Reveal className="mb-12 max-w-2xl">
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
            <h2 className="font-display mt-3 text-[42px] font-semibold leading-[1.12] text-brand-navy">
              {config.title}
            </h2>
            <p className="font-inter mt-3 text-[15px] leading-relaxed text-brand-navy">
              {config.subtitle}
            </p>
          </Reveal>
          <div className="relative ml-[14%]">
            {/* Ruta "hacia la llegada" — un punto por pregunta, aspect ratio real
                para que los puntos se vean circulares, no ovalados. */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-0 h-full w-[70px]">
              <svg viewBox="0 0 760 390" className="h-full w-full" fill="none" preserveAspectRatio="none">
                <path d={ROUTE_TALL_PATH} className="stroke-brand-navy" strokeWidth="3.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              {ROUTE_TALL_DOTS.map((dot, i) => (
                <span
                  key={i}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    dot.hollow ? "h-3.5 w-3.5 border-2 border-brand-navy bg-neutral-white" : "h-4 w-4 bg-brand-accent"
                  }`}
                  style={{ left: `${(dot.cx / 760) * 100}%`, top: `${(dot.cy / 390) * 100}%` }}
                />
              ))}
            </div>
            <Reveal delayMs={160}>
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={faq.id || idx}
                  faq={faq}
                  isOpen={openIndex === idx}
                  onToggle={() => toggleIndex(idx)}
                  variant="highlighted"
                />
              ))}
            </Reveal>
            <div className="mt-12 flex justify-end">
              <Reveal delayMs={240} className="w-[46%]">
                <AskDifferentBox phone={settings?.whatsappPhone} className="w-full bg-atmosphere-honey" />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
