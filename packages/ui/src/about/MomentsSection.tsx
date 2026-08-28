"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface MomentsSectionProps {
  page: AboutPageDTO;
  className?: string;
}

export function MomentsSection({ page, className = "" }: MomentsSectionProps) {
  const moments = page.moments ?? [];
  if (!page.momentsTitle && moments.length === 0) return null;

  return (
    <section className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {page.momentsBadge && (
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
                {page.momentsBadge}
              </p>
            )}
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl lg:text-[46px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.momentsTitle}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <p className="font-inter text-base text-brand-navy/75 sm:text-lg">{page.momentsSubtitle}</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-16 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[420px] pb-8 pl-6 pt-6">
              <div className="absolute -left-6 top-4 bottom-0 right-4 rounded-[48px] bg-atmosphere-pale-sky" aria-hidden="true" />
              <div className="relative aspect-[6/5] w-full overflow-hidden rounded-[36px] shadow-hover">
                <ResponsiveImage
                  src={page.momentsMediaUrl || "/media/demo-cartagena-caribe.webp"}
                  alt="Álbum de viajeros de Viajes Carolina"
                  fill
                  focalPoint={{ x: page.momentsFocalX ?? 50, y: page.momentsFocalY ?? 50 }}
                  className="w-full h-full"
                />
              </div>
              <span className="absolute -top-2 right-2 h-11 w-11 rounded-full bg-brand-accent shadow-[0px_8px_16px_0px_rgba(255,121,0,0.35)]" aria-hidden="true" />
              <div className="absolute bottom-4 left-1/2 w-[88%] -translate-x-1/2 rotate-2 rounded-[18px] bg-white p-5 shadow-[0px_12px_24px_0px_rgba(20,41,59,0.14)]">
                <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-navy">
                  Fotografías reales
                  <br />
                  de viajes realizados
                </p>
              </div>
            </div>
          </div>

          {moments.length > 0 && (
            <div className="lg:col-span-7">
              <div className="flex flex-col gap-10">
                {moments.map((moment, i) => {
                  const isLast = i === moments.length - 1;
                  return (
                    <div key={i} className="flex items-start gap-5">
                      <span
                        className={`font-sora flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-brand-navy ${isLast ? "bg-[#54a6b3] text-white" : "bg-[#f0e5d2]"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3
                          className="font-display text-xl font-semibold leading-snug text-brand-navy sm:text-2xl"
                          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                        >
                          {moment.title}
                        </h3>
                        <p className="font-inter mt-1.5 text-sm text-brand-navy/75 sm:text-base">{moment.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
