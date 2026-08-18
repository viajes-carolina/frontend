"use client";

import React, { useState } from "react";
import { FaqItemDTO, SiteSettingsDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { ChevronDownIcon, HelpCircleIcon } from "../icons/icons";

export interface FaqSectionProps {
  faqs: FaqItemDTO[];
  settings?: SiteSettingsDTO;
  className?: string;
}

export function FaqSection({ faqs, settings, className = "" }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className={`relative w-full overflow-hidden bg-neutral-soft py-16 sm:py-24 border-b border-neutral-border text-neutral-ink ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-border shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Dudas Frecuentes
            </span>
          </div>

          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-navy mb-3">
            Preguntas Frecuentes sobre <span className="text-brand-accent">tu próximo viaje</span>
          </h2>

          <p className="font-inter text-neutral-muted text-base leading-relaxed">
            Resolvemos tus principales inquietudes sobre formas de pago, asesoría y planificación.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="bg-white border border-neutral-border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:border-brand-accent/40"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-sora font-semibold text-base sm:text-lg text-brand-navy hover:text-brand-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircleIcon size={20} className="text-brand-accent shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <div
                    className={`shrink-0 text-neutral-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-brand-accent" : ""
                    }`}
                  >
                    <ChevronDownIcon size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-neutral-border font-inter text-sm text-neutral-muted leading-relaxed animate-fade-in text-left">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Support Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-brand-navy border border-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xl">
          <div>
            <h3 className="font-sora font-bold text-lg text-white">
              ¿Tienes otra pregunta sobre tu itinerario?
            </h3>
            <p className="font-inter text-xs sm:text-sm text-atmosphere-sky mt-1">
              Nuestras asesoras te responden en minutos por WhatsApp.
            </p>
          </div>

          <WhatsAppButton
            size="md"
            phone={settings?.whatsappPhone}
            message="Hola Viajes Carolina, tengo una consulta sobre sus servicios y paquetes turísticos."
            className="shrink-0"
          >
            Consultar por WhatsApp
          </WhatsAppButton>
        </div>

      </div>
    </section>
  );
}
