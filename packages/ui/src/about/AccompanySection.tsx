"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";

export interface AccompanySectionProps {
  page: AboutPageDTO;
  className?: string;
}

// Curva real exportada desde Figma ("Ruta humana", node 561:98) — mismo trazo
// "papel continuo" a mano alzada usado en el resto de rutas del sitio.
const HUMAN_ROUTE_PATH =
  "M77.5711 2.00001C-95.7622 162 144.238 335.333 17.5711 508.667C-42.4289 588.667 77.5711 695.333 264.238 655.333";
const HUMAN_ROUTE_VIEWBOX_W = 266.238;
const HUMAN_ROUTE_VIEWBOX_H = 666.018;

export function AccompanySection({ page, className = "" }: AccompanySectionProps) {
  const steps = page.accompanySteps ?? [];
  if (!page.accompanyTitle && steps.length === 0) return null;

  return (
    <section className={`relative w-full overflow-hidden bg-atmosphere-pale-sky py-16 sm:py-20 lg:py-24 ${className}`}>
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
          <div className="relative mt-16 lg:mt-20">
            <div className="relative flex flex-col gap-16 pl-14 sm:pl-16 lg:gap-20">
              <svg
                viewBox={`0 0 ${HUMAN_ROUTE_VIEWBOX_W} ${HUMAN_ROUTE_VIEWBOX_H}`}
                preserveAspectRatio="none"
                className="pointer-events-none absolute bottom-0 left-0 top-0 h-full w-10 sm:w-12"
                aria-hidden="true"
              >
                <path d={HUMAN_ROUTE_PATH} stroke="#14293B" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>

              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                return (
                  <div key={i} className="relative grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-6 lg:gap-10">
                    <span
                      className={`absolute -left-14 top-1 h-5 w-5 rounded-full sm:-left-16 ${isLast ? "bg-brand-accent" : "bg-brand-navy"}`}
                      aria-hidden="true"
                    />
                    <div className="sm:col-span-5">
                      <p className="font-sora text-sm font-semibold text-brand-accent">{String(i + 1).padStart(2, "0")}</p>
                      <h3
                        className="font-display mt-1 text-2xl font-semibold text-brand-navy sm:text-3xl lg:text-4xl"
                        style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <div className="sm:col-span-7">
                      <p className="font-inter text-base text-brand-navy/75 sm:mt-1 sm:text-lg">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {page.accompanyQuote && (
              <div className="mt-12 rounded-[28px] bg-brand-navy px-9 py-8 sm:px-10 lg:ml-auto lg:mt-16 lg:max-w-[45%]">
                <span
                  className="font-display block text-4xl leading-none text-brand-accent sm:text-5xl"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p
                  className="font-display -mt-4 text-lg italic leading-snug text-white sm:-mt-6 sm:text-2xl"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  {page.accompanyQuote}
                </p>
                {page.accompanyQuoteAttribution && (
                  <p className="font-inter mt-4 text-xs font-semibold text-brand-whatsapp">
                    {page.accompanyQuoteAttribution}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
