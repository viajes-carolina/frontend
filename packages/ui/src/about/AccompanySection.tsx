"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";

export interface AccompanySectionProps {
  page: AboutPageDTO;
  className?: string;
}

export function AccompanySection({ page, className = "" }: AccompanySectionProps) {
  const steps = page.accompanySteps ?? [];
  if (!page.accompanyTitle && steps.length === 0) return null;

  return (
    <section className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {page.accompanyBadge && (
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
                {page.accompanyBadge}
              </p>
            )}
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl lg:text-[48px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.accompanyTitle}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <p className="font-inter text-base text-brand-navy/80 sm:text-lg">{page.accompanySubtitle}</p>
          </div>
        </div>

        {steps.length > 0 && (
          <div className="mt-16 grid grid-cols-1 divide-y divide-[rgba(186,184,173,0.45)] md:mt-20 md:grid-cols-3 md:divide-x md:divide-y-0">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex flex-col gap-3 py-8 first:pt-0 md:py-0 md:px-10 md:first:pl-0 md:last:pr-0 ${i > 0 ? "md:pl-10" : ""}`}
              >
                <h3
                  className="font-display text-2xl font-semibold text-brand-navy sm:text-[26px]"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  {step.title}
                </h3>
                <p className="font-inter text-base text-brand-navy/75">{step.body}</p>
              </div>
            ))}
          </div>
        )}

        {page.accompanyQuote && (
          <div className="mt-14 flex justify-center lg:mt-16">
            <p className="font-sora max-w-2xl rounded-full bg-white px-8 py-4 text-center text-sm font-semibold text-brand-navy shadow-sm sm:text-base">
              {page.accompanyQuote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
