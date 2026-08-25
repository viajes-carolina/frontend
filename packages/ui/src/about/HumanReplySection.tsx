"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";

export interface HumanReplySectionProps {
  page: AboutPageDTO;
  className?: string;
}

// Las 3 burbujas son un recurso ilustrativo (una conversación de ejemplo que
// demuestra la promesa "te lee, te orienta, permanece") — no son contenido
// real administrable, por eso el copy vive fijo acá y no en la base de datos.
export function HumanReplySection({ page, className = "" }: HumanReplySectionProps) {
  if (!page.humanTitle) return null;

  return (
    <section className={`relative w-full overflow-hidden bg-brand-navy py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            {page.humanBadge && (
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
                {page.humanBadge}
              </p>
            )}
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[48px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.humanTitle}
            </h2>
            <p className="font-inter mt-5 max-w-md text-base text-white/80 sm:text-lg">{page.humanSubtitle}</p>
            {page.humanTagline && (
              <p className="font-sora mt-8 text-xs font-semibold uppercase tracking-wider text-brand-whatsapp">
                {page.humanTagline}
              </p>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-col gap-4">
              <div className="max-w-[80%] rounded-tl-[8px] rounded-tr-[26px] rounded-bl-[26px] rounded-br-[26px] bg-white p-6">
                <p
                  className="font-display text-lg italic leading-snug text-brand-navy sm:text-xl"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  &ldquo;Todavía no sé a dónde quiero viajar.&rdquo;
                </p>
              </div>
              <div className="max-w-[85%] self-end rounded-tl-[28px] rounded-tr-[8px] rounded-bl-[28px] rounded-br-[28px] bg-atmosphere-pale-sky p-6">
                <p
                  className="font-display text-lg font-semibold leading-snug text-brand-navy sm:text-xl"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  Empecemos por algo más sencillo: ¿cómo te gustaría sentirte en ese viaje?
                </p>
              </div>
              <div className="max-w-[75%] rounded-tl-[26px] rounded-tr-[26px] rounded-bl-[8px] rounded-br-[26px] bg-[#f0e5d2] p-6">
                <p
                  className="font-display text-lg italic leading-snug text-brand-navy sm:text-xl"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  Cuéntame eso. Yo te ayudo a ordenar el resto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
