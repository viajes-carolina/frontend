"use client";

import React from "react";
import {
  BRAND_CONFIG,
  DEFAULT_WHATSAPP_PHONE,
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_OFFICE_ADDRESS_LINE,
  DEFAULT_OFFICE_DISTRICT,
  DEFAULT_OFFICE_CITY,
  DEFAULT_OFFICE_SCHEDULE_WEEKDAYS,
  DEFAULT_OFFICE_SCHEDULE_SATURDAYS,
  DEFAULT_FACEBOOK_URL,
  DEFAULT_INSTAGRAM_URL,
  DEFAULT_TIKTOK_URL,
} from "@vc/config";
import { BrandLogo } from "../brand/BrandLogo";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface FooterProps {
  siteName?: string;
  contactEmail?: string;
  whatsappPhone?: string;
  whatsappMessage?: string;
  address?: string;
  district?: string;
  city?: string;
  scheduleWeekdays?: string;
  scheduleSaturdays?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

// Trazos reales exportados desde Figma ("Footer · Guía de llegada y
// responsive", node 317:15, y sus 4 referencias de breakpoint 298:3/67/131/195).
const ARRIVAL_PAPER_PATH =
  "M0 0H1440V198C1274 232 1114 246 948 220C764 191 618 228 452 244C284 260 142 244 0 214V0Z";
const ARRIVAL_ROUTE_PATH = "M10 72C88 20 154 86 236 50C314 16 378 52 472 24";

const SITE_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export function Footer({
  siteName = BRAND_CONFIG.name,
  contactEmail = DEFAULT_CONTACT_EMAIL,
  whatsappPhone = DEFAULT_WHATSAPP_PHONE,
  whatsappMessage = "Hola Viajes Carolina, deseo consultar sobre un viaje.",
  address = DEFAULT_OFFICE_ADDRESS_LINE,
  district = DEFAULT_OFFICE_DISTRICT,
  city = DEFAULT_OFFICE_CITY,
  scheduleWeekdays = DEFAULT_OFFICE_SCHEDULE_WEEKDAYS,
  scheduleSaturdays = DEFAULT_OFFICE_SCHEDULE_SATURDAYS,
  facebookUrl = DEFAULT_FACEBOOK_URL,
  instagramUrl = DEFAULT_INSTAGRAM_URL,
  tiktokUrl = DEFAULT_TIKTOK_URL,
}: FooterProps) {
  return (
    <footer className="relative w-full overflow-hidden bg-brand-navy text-white">
      {/* Llegada: el punto de arribo de la ruta narrativa — pregunta final +
          CTA sobre un papel cálido que se funde hacia el navy del footer. */}
      <div className="relative">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={ARRIVAL_PAPER_PATH} className="fill-surface-ivory" />
        </svg>

        <div className="relative mx-auto max-w-[1440px] px-6 pb-16 pt-10 sm:pt-12 md:px-10 md:pb-20 xl:px-16">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
            <div className="flex max-w-[560px] flex-col gap-2.5 xl:max-w-[650px]">
              <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-accent sm:text-xs">
                Llegaste hasta aquí
              </p>
              <h2 className="font-display font-semibold leading-[1.08] tracking-[-0.02em] text-brand-navy text-[32px] sm:text-[38px] xl:text-[44px]">
                Llegaste hasta aquí.
                <br />
                ¿Hacia dónde seguimos?
              </h2>
              <p className="max-w-[500px] font-inter text-sm leading-[1.5] text-brand-navy/80">
                Cuéntanos qué imaginas. Te escuchamos y pensamos contigo el siguiente paso.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-4 xl:items-end xl:pt-8">
              <svg
                width="180"
                height="38"
                viewBox="0 0 500 104"
                className="hidden h-auto w-[150px] sm:block xl:w-[180px]"
                aria-hidden="true"
              >
                <path d={ARRIVAL_ROUTE_PATH} className="stroke-brand-navy" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="480" cy="22" r="10" className="fill-brand-accent" />
              </svg>
              <WhatsAppButton size="md" phone={whatsappPhone} message={whatsappMessage} className="w-full sm:w-auto">
                Conversemos por WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </div>

      {/* Información principal — una sola fuente de contenido (configuración
          global del sitio), nunca repetida a mano en otros componentes. */}
      <div className="relative mx-auto max-w-[1440px] px-6 pb-10 pt-14 md:px-10 xl:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:flex xl:flex-row xl:gap-[50px]">
          {/* Marca */}
          <div className="flex flex-col gap-4 xl:w-[360px]">
            <a href="/" className="focus:outline-none" aria-label={siteName}>
              <BrandLogo variant="light" className="h-8 w-auto" />
            </a>
            <p className="max-w-[350px] font-display text-base italic leading-relaxed text-white/90">
              Viajes memorables, diseñados contigo y acompañados hasta el regreso.
            </p>
          </div>

          {/* Recorre el sitio */}
          <div className="flex flex-col gap-3.5 xl:w-[130px]">
            <h3 className="font-inter text-xs font-semibold uppercase tracking-[0.07em] text-brand-accent">
              Recorre el sitio
            </h3>
            <ul className="hidden flex-col font-inter text-sm text-white/80 md:flex">
              {SITE_LINKS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-block py-1 leading-[1.4] hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            {/* Móvil: enlaces del sitio en dos líneas, no una lista vertical */}
            <p className="font-inter text-sm leading-relaxed text-white/80 md:hidden">
              Inicio · Nosotros
              <br />
              Blog · Contacto
            </p>
          </div>

          {/* Oficina y atención */}
          <div className="flex flex-col gap-3.5 xl:w-[260px]">
            <h3 className="font-inter text-xs font-semibold uppercase tracking-[0.07em] text-brand-accent">
              Oficina y atención
            </h3>
            <div className="font-inter text-[13.5px] leading-[1.6] text-white/80">
              <p>{address},</p>
              <p>
                {district} — {city}
              </p>
              <p className="mt-2.5">{scheduleWeekdays}</p>
              <p>{scheduleSaturdays}</p>
              <a href={`mailto:${contactEmail}`} className="mt-2.5 block font-semibold text-white hover:text-brand-accent transition-colors">
                {contactEmail}
              </a>
            </div>
          </div>

          {/* Legal y redes */}
          <div className="flex flex-col gap-3.5 xl:w-[220px]">
            <h3 className="font-inter text-xs font-semibold uppercase tracking-[0.07em] text-brand-accent">Legal</h3>
            <div className="flex flex-col font-inter text-[13.5px] leading-[1.9] text-white/80">
              <a href="/reclamaciones" className="hover:text-white transition-colors">
                Libro de reclamaciones
              </a>
              <a href="/terminos" className="hover:text-white transition-colors">
                Términos y condiciones
              </a>
              <a href="/privacidad" className="hover:text-white transition-colors">
                Política de privacidad
              </a>
            </div>
            <p className="font-inter text-[13.5px] text-white/80">
              {[
                instagramUrl && { label: "Instagram", url: instagramUrl },
                facebookUrl && { label: "Facebook", url: facebookUrl },
                tiktokUrl && { label: "TikTok", url: tiktokUrl },
              ]
                .filter((item): item is { label: string; url: string } => Boolean(item))
                .map((item, idx, arr) => (
                  <React.Fragment key={item.label}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {item.label}
                    </a>
                    {idx < arr.length - 1 && " · "}
                  </React.Fragment>
                ))}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-2 border-t border-white/15 pt-6 text-[12.5px] text-white/60 sm:flex-row sm:items-center sm:justify-between xl:mt-14">
          <p>
            © {new Date().getFullYear()} {siteName}. Todos los derechos reservados.
          </p>
          <p>Agencia de Viajes y Turismo Registrada · Perú</p>
        </div>
      </div>
    </footer>
  );
}
