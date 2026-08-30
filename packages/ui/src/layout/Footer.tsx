"use client";

import React from "react";
import {
  BRAND_CONFIG,
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

export interface FooterProps {
  siteName?: string;
  contactEmail?: string;
  address?: string;
  district?: string;
  city?: string;
  scheduleWeekdays?: string;
  scheduleSaturdays?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  legalCompanyName?: string;
  taxId?: string;
  whatsappDisplayNumber?: string;
  /**
   * `"full"` (default): footer completo de 4 columnas usado en el resto del sitio.
   * `"legal"`: variante reducida de 3 columnas (Marca/Oficina y atención/Legal) usada
   * en las páginas legales/institucionales — omite "Recorre el sitio".
   */
  variant?: "full" | "legal";
}

const SITE_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Promociones", href: "/#promociones" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export function Footer({
  siteName = BRAND_CONFIG.name,
  contactEmail = DEFAULT_CONTACT_EMAIL,
  address = DEFAULT_OFFICE_ADDRESS_LINE,
  district = DEFAULT_OFFICE_DISTRICT,
  city = DEFAULT_OFFICE_CITY,
  scheduleWeekdays = DEFAULT_OFFICE_SCHEDULE_WEEKDAYS,
  scheduleSaturdays = DEFAULT_OFFICE_SCHEDULE_SATURDAYS,
  facebookUrl = DEFAULT_FACEBOOK_URL,
  instagramUrl = DEFAULT_INSTAGRAM_URL,
  tiktokUrl = DEFAULT_TIKTOK_URL,
  legalCompanyName,
  taxId,
  whatsappDisplayNumber,
  variant = "full",
}: FooterProps) {
  return (
    <footer className="relative w-full overflow-hidden bg-brand-navy text-white">
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
            <div className="font-inter text-[11.5px] leading-[18px] text-white">
              {legalCompanyName && taxId && (
                <p>
                  {legalCompanyName} · RUC {taxId}
                </p>
              )}
              <p>Agencia de Viajes y Turismo</p>
            </div>
          </div>

          {/* Recorre el sitio — omitida en la variante "legal" */}
          {variant === "full" && (
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
                Inicio · Promociones · Nosotros
                <br />
                Blog · Contacto
              </p>
            </div>
          )}

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
              {whatsappDisplayNumber && (
                <p className="mt-2.5">WhatsApp · {whatsappDisplayNumber}</p>
              )}
              <p className={whatsappDisplayNumber ? undefined : "mt-2.5"}>{scheduleWeekdays}</p>
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
              <a href="/cookies" className="hover:text-white transition-colors">
                Política de cookies
              </a>
              <a href="/compromiso-esnna" className="hover:text-white transition-colors">
                Compromiso contra la ESNNA
              </a>
              <a href="/constancia-mincetur" className="hover:text-white transition-colors">
                Constancia MINCETUR
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
          <a href="/constancia-mincetur" className="hover:text-white transition-colors">
            Registro MINCETUR · Ver constancia
          </a>
        </div>
      </div>
    </footer>
  );
}
