"use client";

import React from "react";
import {
  BRAND_CONFIG,
  DEFAULT_PRIMARY_PHONE,
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
import { PlaneIcon, MapPinIcon } from "../icons/icons";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface FooterProps {
  siteName?: string;
  brandTagline?: string;
  contactEmail?: string;
  primaryPhone?: string;
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

export function Footer({
  siteName = BRAND_CONFIG.name,
  brandTagline = BRAND_CONFIG.tagline,
  contactEmail = DEFAULT_CONTACT_EMAIL,
  primaryPhone = DEFAULT_PRIMARY_PHONE,
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
    <footer className="w-full bg-brand-navy border-t border-white/10 text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Marca primero, jerarquía visual clara — misma información que antes, ya no
            en 4 columnas iguales tipo grilla corporativa. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">

          {/* Marca & acompañamiento — bloque líder, más ancho */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            <a href="/" className="focus:outline-none" aria-label="Viajes Carolina">
              <BrandLogo variant="light" className="h-9 w-auto mb-2" />
            </a>

            <p className="font-display italic text-lg text-white/90 leading-relaxed max-w-sm">
              {brandTagline}. Diseñamos viajes memorables y a medida, acompañándote en cada paso.
            </p>

            <div className="pt-2">
              <WhatsAppButton
                size="sm"
                phone={whatsappPhone}
                message={whatsappMessage}
              >
                Atención por WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          {/* Navegación, oficina y legal — secundarios, más compactos */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-2.5">
              <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-brand-sunset mb-1">
                Recorre el Sitio
              </h4>
              <ul className="space-y-2 font-sora text-sm text-atmosphere-sky">
                <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="/promociones" className="hover:text-white transition-colors">Promociones</a></li>
                <li><a href="/nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contacto" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div className="flex flex-col space-y-2.5">
              <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-brand-sunset mb-1">
                Oficina y Atención
              </h4>
              <div className="space-y-2.5 font-sora text-sm text-atmosphere-sky">
                <div className="flex items-start gap-2">
                  <MapPinIcon size={16} className="text-brand-accent shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{address}, {district} — {city}</span>
                </div>
                <div className="text-xs text-neutral-subtle leading-relaxed space-y-0.5">
                  <p>{scheduleWeekdays}</p>
                  <p>{scheduleSaturdays}</p>
                </div>
                <a href={`mailto:${contactEmail}`} className="text-xs text-white hover:text-brand-accent transition-colors font-medium block">
                  {contactEmail}
                </a>
              </div>
            </div>

            <div className="flex flex-col space-y-2.5">
              <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-brand-sunset mb-1">
                Legal
              </h4>
              <ul className="space-y-2 font-sora text-xs text-neutral-subtle">
                <li>
                  <a href="/reclamaciones" className="hover:text-brand-accent transition-colors">
                    📖 Libro de Reclamaciones
                  </a>
                </li>
                <li><a href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="/privacidad" className="hover:text-white transition-colors">Políticas de Privacidad</a></li>
              </ul>

              <div className="pt-3 flex items-center gap-3 text-xs text-white/70">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors" aria-label="Instagram">
                    Instagram
                  </a>
                )}
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors" aria-label="Facebook">
                    Facebook
                  </a>
                )}
                {tiktokUrl && (
                  <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors" aria-label="TikTok">
                    TikTok
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-inter text-neutral-subtle">
          <p>© {new Date().getFullYear()} {siteName}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span>Agencia de Viajes y Turismo Registrada</span>
            <span>·</span>
            <span>Perú</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
