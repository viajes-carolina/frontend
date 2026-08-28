"use client";

import React from "react";
import { ContactPageDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface ContactHeroSectionProps {
  page: ContactPageDTO;
  contactEmail?: string;
  officeAddress?: string;
  officeHours?: string;
  officeScheduleSaturdays?: string;
  whatsappPhone?: string;
  className?: string;
}

export function ContactHeroSection({
  page,
  contactEmail,
  officeAddress,
  officeHours,
  officeScheduleSaturdays,
  whatsappPhone = DEFAULT_WHATSAPP_PHONE,
  className = "",
}: ContactHeroSectionProps) {
  const scheduleSummary = [officeHours, officeScheduleSaturdays].filter(Boolean).join(" · ");

  return (
    <section className={`relative w-full overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
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

          <div className="lg:col-span-6">
            <div className="rounded-[32px] bg-atmosphere-pale-sky p-8 sm:p-10">
              <h2
                className="font-display text-2xl font-semibold leading-tight text-brand-navy sm:text-[32px]"
                style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
              >
                {page.heroInfoTitle}
              </h2>

              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
                    {page.heroInfoWhatsappLabel}
                  </dt>
                  <dd className="font-inter mt-0.5 text-base text-brand-navy">{page.heroInfoWhatsappValue}</dd>
                </div>
                <div>
                  <dt className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
                    {page.heroInfoEmailLabel}
                  </dt>
                  <dd className="font-inter mt-0.5 text-base text-brand-navy">{contactEmail}</dd>
                </div>
                <div>
                  <dt className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
                    {page.heroInfoScheduleLabel}
                  </dt>
                  <dd className="font-inter mt-0.5 text-base text-brand-navy">{scheduleSummary}</dd>
                </div>
                <div>
                  <dt className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
                    {page.heroInfoOfficeLabel}
                  </dt>
                  <dd className="font-inter mt-0.5 text-base text-brand-navy">{officeAddress}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
