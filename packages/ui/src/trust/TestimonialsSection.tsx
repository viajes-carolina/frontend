"use client";

import React from "react";
import { TestimonialDTO } from "@vc/api-client";
import { StarIcon } from "../icons/icons";

export interface TestimonialsSectionProps {
  testimonials: TestimonialDTO[];
  className?: string;
}

export function TestimonialsSection({
  testimonials,
  className = "",
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      id="testimonios"
      className={`relative w-full overflow-hidden bg-gradient-to-b from-atmosphere-twilight to-brand-navy py-16 sm:py-24 border-b border-white/10 text-white ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-sunset/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 shadow-sm backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-sunset animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-sunset">
              Viajeros Satisfechos
            </span>
          </div>

          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-white mb-3">
            Historias y experiencias que <span className="text-brand-accent">nos respaldan</span>
          </h2>

          <p className="font-inter text-atmosphere-sky text-base sm:text-lg leading-relaxed">
            La tranquilidad de nuestros clientes es nuestro mayor orgullo. Conoce lo que dicen quienes ya viajaron con nosotros.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-brand-navy/90 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl hover:border-brand-accent/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4 text-left">
                {/* Stars Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                    <StarIcon key={idx} size={16} />
                  ))}
                </div>

                {/* Comment */}
                <p className="font-inter text-xs sm:text-sm text-white/90 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3.5 pt-5 mt-4 border-t border-white/10">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-brand-blue/30 border border-white/20 shrink-0 flex items-center justify-center">
                  {t.avatarMediaUrl ? (
                    <img
                      src={t.avatarMediaUrl.startsWith("http") || t.avatarMediaUrl.startsWith("/") ? t.avatarMediaUrl : `/${t.avatarMediaUrl}`}
                      alt={t.clientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-sora font-bold text-sm text-brand-accent">
                      {t.clientName.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="text-left overflow-hidden">
                  <span className="font-sora font-bold text-sm text-white block truncate">
                    {t.clientName}
                  </span>
                  <span className="font-inter text-xs text-brand-sunset block truncate">
                    {t.tripDestination}
                  </span>
                  {t.clientLocation && (
                    <span className="font-inter text-[11px] text-neutral-subtle block truncate">
                      {t.clientLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
