"use client";

import React from "react";
import { AboutPageDTO } from "@vc/api-client";
import { CompassIcon, StarIcon } from "../icons/icons";

export interface MissionVisionSectionProps {
  page: AboutPageDTO;
  className?: string;
}

export function MissionVisionSection({ page, className = "" }: MissionVisionSectionProps) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-neutral-soft py-16 sm:py-20 border-b border-neutral-border text-neutral-ink ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-border shadow-sm">
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Propósito & Futuro
            </span>
          </div>
          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-navy">
            Misión & Visión
          </h2>
          <p className="font-inter text-sm sm:text-base text-neutral-muted">
            El norte que orienta cada una de nuestras recomendaciones y cotizaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="relative group rounded-3xl p-8 sm:p-10 bg-white border border-neutral-border hover:border-brand-accent/40 shadow-sm transition-all duration-300 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-accent/15 text-brand-accent flex items-center justify-center border border-brand-accent/30 shadow-inner">
              <CompassIcon size={28} />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-sora font-bold text-2xl text-brand-navy">
                {page.missionTitle}
              </h3>
              <p className="font-inter text-neutral-muted text-sm sm:text-base leading-relaxed">
                {page.missionBody}
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="relative group rounded-3xl p-8 sm:p-10 bg-white border border-neutral-border hover:border-brand-sunset/40 shadow-sm transition-all duration-300 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-sunset/15 text-brand-sunset flex items-center justify-center border border-brand-sunset/30 shadow-inner">
              <StarIcon size={28} />
            </div>

            <div className="space-y-3">
              <h3 className="font-sora font-bold text-2xl text-brand-navy">
                {page.visionTitle}
              </h3>
              <p className="font-inter text-neutral-muted text-sm sm:text-base leading-relaxed">
                {page.visionBody}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
