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
      className={`relative w-full overflow-hidden bg-white py-16 sm:py-24 border-b border-neutral-border text-neutral-ink ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-soft border border-neutral-border shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Viajeros Satisfechos
            </span>
          </div>

          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-navy mb-3">
            Historias y experiencias que <span className="text-brand-accent">nos respaldan</span>
          </h2>

          <p className="font-inter text-neutral-muted text-base sm:text-lg leading-relaxed">
            La tranquilidad de nuestros clientes es nuestro mayor orgullo. Conoce lo que dicen quienes ya viajaron con nosotros.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-neutral-soft border border-neutral-border rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-brand-accent/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4 text-left">
                {/* Stars Rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                    <StarIcon key={idx} size={16} />
                  ))}
                </div>

                {/* Comment */}
                <p className="font-inter text-xs sm:text-sm text-brand-navy/90 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3.5 pt-5 mt-4 border-t border-neutral-border">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white border border-neutral-border shrink-0 flex items-center justify-center shadow-sm">
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
                  <span className="font-sora font-bold text-sm text-brand-navy block truncate">
                    {t.clientName}
                  </span>
                  <span className="font-inter text-xs text-brand-accent font-medium block truncate">
                    {t.tripDestination}
                  </span>
                  {t.clientLocation && (
                    <span className="font-inter text-[11px] text-neutral-muted block truncate">
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
