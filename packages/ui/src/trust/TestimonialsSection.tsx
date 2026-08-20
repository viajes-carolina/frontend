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

  const [featured, ...rest] = testimonials;
  const secondaryList = rest.slice(0, 2);

  const avatarSrc = (t: TestimonialDTO) =>
    t.avatarMediaUrl
      ? (t.avatarMediaUrl.startsWith("http") || t.avatarMediaUrl.startsWith("/") ? t.avatarMediaUrl : `/${t.avatarMediaUrl}`)
      : undefined;

  return (
    <section
      id="testimonios"
      className={`relative w-full overflow-hidden bg-white py-16 sm:py-24 border-b border-neutral-border text-neutral-ink ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent border-b-2 border-brand-accent pb-1">
            Viajeros Satisfechos
          </span>

          <h2 className="font-display font-medium text-3xl sm:text-4xl text-brand-navy mt-3 mb-3">
            Historias y experiencias que <span className="text-brand-accent">nos respaldan</span>
          </h2>

          <p className="font-sora text-neutral-muted text-base sm:text-lg leading-relaxed">
            La tranquilidad de nuestros clientes es nuestro mayor orgullo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Testimonio protagonista */}
          <div className="lg:col-span-3 bg-atmosphere-sand rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="font-display italic text-6xl text-brand-accent/50 leading-none block mb-2">"</span>
              <p className="font-display italic text-xl sm:text-2xl text-brand-navy leading-snug -mt-6">
                {featured.comment}
              </p>
            </div>
            <div className="flex items-center gap-4 pt-8 mt-6 border-t border-brand-navy/10">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white border border-white shrink-0 flex items-center justify-center shadow-sm">
                {avatarSrc(featured) ? (
                  <img src={avatarSrc(featured)} alt={featured.clientName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-sora font-bold text-lg text-brand-accent">{featured.clientName.charAt(0)}</span>
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                  {Array.from({ length: featured.rating || 5 }).map((_, idx) => (
                    <StarIcon key={idx} size={13} />
                  ))}
                </div>
                <span className="font-sora font-bold text-sm text-brand-navy block">{featured.clientName}</span>
                <span className="font-sora text-xs text-neutral-muted block">
                  {featured.tripDestination}{featured.clientLocation ? ` · ${featured.clientLocation}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Testimonios de apoyo */}
          <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
            {secondaryList.map((t) => (
              <div key={t.id} className="flex-1 bg-neutral-soft rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
                <p className="font-sora text-sm text-brand-navy/90 leading-relaxed italic mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white border border-neutral-border shrink-0 flex items-center justify-center">
                    {avatarSrc(t) ? (
                      <img src={avatarSrc(t)} alt={t.clientName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-sora font-bold text-xs text-brand-accent">{t.clientName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-left overflow-hidden">
                    <span className="font-sora font-bold text-xs text-brand-navy block truncate">{t.clientName}</span>
                    <span className="font-sora text-[11px] text-neutral-muted block truncate">{t.tripDestination}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
