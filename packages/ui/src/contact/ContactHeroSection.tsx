"use client";

import React from "react";
import { ContactPageDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface ContactHeroSectionProps {
  page: ContactPageDTO;
  whatsappPhone?: string;
  className?: string;
}

export function ContactHeroSection({ page, whatsappPhone = DEFAULT_WHATSAPP_PHONE, className = "" }: ContactHeroSectionProps) {
  return (
    <section className={`relative w-full overflow-hidden bg-surface-ivory pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">{page.heroBadge}</p>
            <h1
              className="font-display mt-4 text-4xl font-semibold leading-[1.05] text-brand-navy sm:text-5xl lg:text-[58px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.heroTitle}
            </h1>
            <p className="font-inter mt-5 max-w-lg text-base text-brand-navy/75 sm:text-lg">{page.heroSubtitle}</p>
            <div className="mt-8">
              <WhatsAppButton phone={whatsappPhone} message={page.heroCtaMessage}>
                {page.heroCtaText}
              </WhatsAppButton>
            </div>
            {page.heroNoteText && <p className="font-inter mt-4 text-sm text-brand-navy/60">{page.heroNoteText}</p>}
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-[781/827] w-full max-w-[520px] overflow-hidden rounded-[56px] bg-atmosphere-pale-sky sm:rounded-[90px]">
              <div className="absolute right-[8%] top-[5.5%] h-[12%] w-[12%] rounded-full bg-brand-accent" aria-hidden="true" />

              <div className="absolute left-[7.5%] top-[11.9%] w-[71.7%] rounded-[20px] bg-white p-4 shadow-hover sm:p-5">
                <p
                  className="font-display text-sm italic leading-snug text-brand-navy sm:text-base"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  &ldquo;{page.heroChatBubble1}&rdquo;
                </p>
              </div>

              <div className="absolute left-[20.8%] top-[36.8%] w-[68.3%] rounded-[20px] bg-brand-navy p-4 shadow-hover sm:p-5">
                <p className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">{page.heroChatLabel}</p>
                <p
                  className="font-display mt-1.5 text-sm font-semibold leading-snug text-white sm:text-base"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  {page.heroChatBubble2}
                </p>
              </div>

              <div className="absolute left-[6.5%] top-[68.4%] w-[61.4%] rounded-[20px] bg-[#f2e5cc] p-4 shadow-hover sm:p-5">
                <p
                  className="font-display text-sm italic leading-snug text-brand-navy sm:text-base"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  {page.heroChatBubble3}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
