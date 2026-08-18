"use client";

import React, { useState } from "react";
import { TravelIntentionDTO, SiteSettingsDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { ResponsiveImage } from "../primitives/ResponsiveImage";
import {
  SunIcon,
  LandmarkIcon,
  HeartIcon,
  CompassIcon,
  PlaneIcon,
  ArrowUpRightIcon,
  CheckIcon,
} from "../icons/icons";

export interface IntentionsSectionProps {
  intentions: TravelIntentionDTO[];
  settings?: SiteSettingsDTO;
  className?: string;
}

function renderIntentionIcon(iconName: string, size = 20) {
  switch (iconName) {
    case "LandmarkIcon":
      return <LandmarkIcon size={size} />;
    case "HeartIcon":
      return <HeartIcon size={size} />;
    case "CompassIcon":
      return <CompassIcon size={size} />;
    case "SunIcon":
    default:
      return <SunIcon size={size} />;
  }
}

export function IntentionsSection({
  intentions,
  settings,
  className = "",
}: IntentionsSectionProps) {
  const activeList = intentions.filter((i) => i.active);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!activeList || activeList.length === 0) {
    return null;
  }

  const current = activeList[selectedIndex] || activeList[0];
  const whatsappPhone = settings?.whatsappPhone;

  return (
    <section
      id="intenciones"
      className={`relative w-full overflow-hidden bg-brand-navy py-16 sm:py-24 border-b border-white/10 text-white ${className}`}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-blue/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-sunset/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 shadow-sm backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-sunset" />
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-sunset">
              ¿Qué tipo de experiencia buscas?
            </span>
          </div>

          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-[40px] leading-tight text-white mb-4">
            Elige tu próxima <span className="text-brand-accent">intención de viaje</span>
          </h2>

          <p className="font-inter text-atmosphere-sky text-base sm:text-lg leading-relaxed">
            Personalizamos cada detalle de tu itinerario según tu estilo: playa, cultura, romance o aventura.
          </p>
        </div>

        {/* Intention Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {activeList.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id || item.slug}
                onClick={() => setSelectedIndex(idx)}
                className={`flex items-center gap-3 p-4 sm:p-5 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                  isSelected
                    ? "bg-white/15 border-brand-accent text-white shadow-lg ring-1 ring-brand-accent/50 scale-[1.02]"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-brand-accent text-brand-navy"
                      : "bg-white/10 text-brand-sunset"
                  }`}
                >
                  {renderIntentionIcon(item.iconName, 22)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sora font-bold text-sm sm:text-base leading-snug truncate">
                    {item.title}
                  </span>
                  <span className="font-inter text-[11px] text-atmosphere-sky truncate">
                    {item.featuredDestinations?.length || 0} destinos
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Intention Featured Showcase */}
        <div className="bg-atmosphere-twilight/80 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Info Column */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-sunset/20 border border-brand-sunset/40 flex items-center justify-center text-brand-sunset">
                  {renderIntentionIcon(current.iconName, 26)}
                </div>
                <div>
                  <h3 className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
                    {current.title}
                  </h3>
                  <span className="font-inter text-xs text-brand-sunset font-semibold uppercase tracking-wider">
                    Experiencia a Medida
                  </span>
                </div>
              </div>

              <p className="font-inter text-atmosphere-sky text-base sm:text-lg leading-relaxed">
                {current.tagline}
              </p>

              {/* Destinations Pills */}
              <div className="w-full pt-2">
                <span className="font-sora text-xs font-bold text-neutral-subtle uppercase tracking-wider block mb-3">
                  Destinos recomendados para esta intención:
                </span>
                <div className="flex flex-wrap gap-2">
                  {current.featuredDestinations?.map((dest, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white font-inter text-xs font-medium hover:border-brand-accent/50 hover:bg-white/15 transition-colors"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              {/* WhatsApp Action */}
              <div className="pt-4 w-full sm:w-auto">
                <WhatsAppButton
                  size="lg"
                  phone={whatsappPhone}
                  message={current.whatsappMessageTemplate}
                  className="w-full sm:w-auto shadow-xl"
                >
                  {`Cotizar ${current.title}`}
                </WhatsAppButton>
              </div>

              {/* Support note */}
              <div className="flex items-center gap-2 text-xs font-inter text-emerald-400 font-medium pt-1">
                <CheckIcon size={16} />
                <span>Asesoría personalizada con opciones de vuelos y hoteles</span>
              </div>
            </div>

            {/* Right Image Showcase */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full aspect-video sm:h-80 rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
                {current.coverMediaUrl ? (
                  <ResponsiveImage
                    src={current.coverMediaUrl}
                    alt={current.title}
                    fill
                    priority
                    focalPoint={{
                      x: current.coverFocalX || 50,
                      y: current.coverFocalY || 50,
                    }}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-blue/40 to-brand-navy flex flex-col items-center justify-center p-6">
                    <PlaneIcon size={40} className="text-brand-accent mb-2" />
                    <span className="font-sora text-sm text-white font-bold">{current.title}</span>
                  </div>
                )}

                {/* Bottom Overlay Info Tag */}
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between bg-brand-navy/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-xs text-white">
                  <span className="font-sora font-semibold">Salidas Todo el Año</span>
                  <span className="text-brand-sunset font-inter font-medium">Asesoría sin costo</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
