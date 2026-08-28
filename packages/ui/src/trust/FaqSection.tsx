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
      <div className="h-px w-full bg-[rgba(186,184,173,0.45)]" aria-hidden="true" />
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
      className={`relative w-full overflow-hidden py-16 sm:py-20 xl:py-28 text-neutral-ink ${className}`}
    >
      {/* Atmósfera mínima · FAQ — elipse difusa, ancla abajo-a-la-izquierda,
          se sale del borde de la sección. Asset exportado de Figma (blur
          gaussiano complejo, no reconstruible con un <div> + blur-* de
          Tailwind sin perder fidelidad). El SVG incluye ~100px de margen
          extra en cada lado para no recortar el degradado del blur — el
          contenedor usa el tamaño intrínseco real del SVG (no el bounding
          box "limpio" de la elipse) para que preserveAspectRatio="none" no
          la deforme. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-190px] top-[400px] h-[440px] w-[440px] md:left-[-230px] md:top-[290px] md:h-[520px] md:w-[560px] xl:left-[-260px] xl:top-[200px] xl:h-[580px] xl:w-[660px]"
      >
        <img src="/decor/faq-atmosphere-mobile.svg" alt="" className="h-full w-full md:hidden" />
        <img src="/decor/faq-atmosphere-tablet.svg" alt="" className="hidden h-full w-full md:block xl:hidden" />
        <img src="/decor/faq-atmosphere-desktop.svg" alt="" className="hidden h-full w-full xl:block" />
      </div>

      {/* Detalle lineal · Topografía — líneas onduladas + punto, ancla
          arriba-a-la-derecha. `right-*` en vez de `left-*` porque el ancho
          real de la sección en el navegador es fluido, no el frame fijo de
          Figma. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[20px] top-[20px] h-[60px] w-[100px] md:right-[44px] md:top-[28px] md:h-[90px] md:w-[200px] xl:right-[60px] xl:top-[28px] xl:h-[100px] xl:w-[260px]"
      >
        <img src="/decor/faq-topography-mobile.svg" alt="" className="h-full w-full md:hidden" />
        <img src="/decor/faq-topography-tablet.svg" alt="" className="hidden h-full w-full md:block xl:hidden" />
        <img src="/decor/faq-topography-desktop.svg" alt="" className="hidden h-full w-full xl:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] xl:px-16">
        {/* Encabezado — ancho completo en los 3 breakpoints. */}
        <Reveal>
          <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
            {config.badgeText}
          </span>
          <h2 className="font-display mt-3 text-[32px] font-semibold leading-[36px] text-brand-navy md:text-[38px] md:leading-[43px] xl:text-[42px] xl:leading-[47px]">
            {config.title}
          </h2>
          <p className="font-inter mt-3 text-sm leading-relaxed text-brand-navy md:text-[15px]">
            {config.subtitle}
          </p>
        </Reveal>

        {/* Acordeón — ancho completo, mismo margen izquierdo que el encabezado
            en los 3 breakpoints (sin indentación reservada para la ruta
            punteada que ya no existe). */}
        <Reveal delayMs={160} className="mt-10">
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

        {/* "¿Tu pregunta es diferente?" — ancho completo en mobile, ancho
            fijo alineado a la derecha desde tablet. */}
        <div className="mt-8 flex md:mt-10 md:justify-end xl:mt-12">
          <Reveal delayMs={240} className="w-full md:w-[480px]">
            <AskDifferentBox
              phone={settings?.whatsappPhone}
              className="w-full bg-atmosphere-pale-sky xl:bg-atmosphere-honey"
              textClassName="text-[13px] md:text-sm"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
