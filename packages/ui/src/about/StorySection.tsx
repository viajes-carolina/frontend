"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";
import { CheckIcon } from "../icons/icons";

export interface StorySectionProps {
  page: AboutPageDTO;
  className?: string;
}

export function StorySection({ page, className = "" }: StorySectionProps) {
  const imageUrl = page.storyMediaUrl || "/media/demo-cusco-machupicchu.webp";

  return (
    <section
      id="historia"
      className={`relative w-full overflow-hidden bg-atmosphere-twilight py-16 sm:py-24 border-b border-white/10 text-white ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative & Values */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-sunset" />
              <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-sunset">
                Trayectoria & Compromiso
              </span>
            </div>

            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-white leading-tight">
              {page.storyTitle}
            </h2>

            <p className="font-inter text-atmosphere-sky text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {page.storyBody}
            </p>

            {/* Values Pills */}
            {page.values && page.values.length > 0 && (
              <div className="pt-4 space-y-3">
                <h3 className="font-sora font-bold text-sm uppercase tracking-wider text-brand-accent">
                  Nuestros Principios Rectores:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {page.values.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckIcon size={14} />
                      </div>
                      <span className="font-inter text-xs sm:text-sm text-white/90 font-medium">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Image with Decorative Glow */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-white/15">
              <img
                src={imageUrl.startsWith("http") || imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}
                alt="Historia de Viajes Carolina"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-brand-navy/80 backdrop-blur-md border border-white/10">
                <span className="font-sora font-bold text-sm text-white block">
                  Miraflores, Lima — Perú
                </span>
                <span className="font-inter text-xs text-brand-sunset block">
                  Sede Principal · Atención Personalizada
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
