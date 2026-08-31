"use client";

import React from "react";
import { ContactPageDTO } from "@vc/api-client";

export interface OfficeMapSectionProps {
  page: ContactPageDTO;
  officeGoogleMapsUrl?: string;
  officeAddress?: string;
  officeHours?: string;
  officeScheduleSaturdays?: string;
  officeLatitude?: number;
  officeLongitude?: number;
  className?: string;
}

export function OfficeMapSection({
  page,
  officeGoogleMapsUrl,
  officeAddress,
  officeHours,
  officeScheduleSaturdays,
  officeLatitude,
  officeLongitude,
  className = "",
}: OfficeMapSectionProps) {
  if (!page.officeSectionTitle) return null;

  // Coordenadas exactas > dirección en texto: el geocodificador de "output=embed"
  // puede desviarse con direcciones de oficina/piso específico dentro de un edificio.
  const mapQuery =
    officeLatitude != null && officeLongitude != null
      ? `${officeLatitude},${officeLongitude}`
      : officeAddress || page.officeMapPinSubtitle || "";

  /* La sección no pinta fondo propio a propósito: el sitio público pinta en el
     `body` el marfil con la textura de curvas de nivel, y aquí se tapaba a
     sangre con el celeste `atmosphere-pale-sky`. Ese tono se sigue usando —en
     esta misma página y en el resto del sitio— pero como superficie de tarjeta
     o panel redondeado, nunca como fondo de sección a ancho completo. Era lo
     que hacía que Contacto se viera distinta de las demás páginas. */
  return (
    <section className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {page.officeSectionBadge && (
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">{page.officeSectionBadge}</p>
            )}
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl lg:text-[48px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.officeSectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <p className="font-inter text-base text-brand-navy/75 sm:text-lg">{officeAddress}</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* Mapa real de Google Maps */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[32px] border border-neutral-border bg-surface-ivory">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Ubicación de ${page.officeMapPinTitle || "Viajes Carolina"} en Google Maps`}
              />

              <div className="pointer-events-none absolute bottom-5 left-5 max-w-[75%] rounded-[18px] bg-white p-4 shadow-hover sm:p-5">
                <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-navy">{page.officeMapPinTitle}</p>
                <p className="font-inter mt-1 text-sm text-brand-navy/70">{page.officeMapPinSubtitle}</p>
              </div>
            </div>

            {officeGoogleMapsUrl && (
              <a
                href={officeGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter mt-4 inline-block text-sm font-semibold text-brand-navy underline decoration-brand-accent/40 underline-offset-4 hover:text-brand-accent"
              >
                {page.officeMapsLinkText} ↗
              </a>
            )}
          </div>

          {/* Panel de información */}
          <div className="lg:col-span-5 lg:pt-2">
            <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">{page.officeMapEyebrow}</p>
            <h3
              className="font-display mt-2 text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {page.officeMapTitle}
            </h3>
            <div className="font-inter mt-3 text-base text-brand-navy/75">
              {officeHours && <p>{officeHours}</p>}
              {officeScheduleSaturdays && <p>{officeScheduleSaturdays}</p>}
            </div>

            <div className="mt-6">
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">{page.officeVisitLabel}</p>
              <p className="font-inter mt-2 text-base font-semibold text-brand-navy">{page.officeVisitNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
