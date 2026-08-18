"use client";

import React from "react";
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
  siteName = "Viajes Carolina",
  brandTagline = "El viaje comienza aquí",
  contactEmail = "contacto@viajescarolina.com",
  primaryPhone = "+51 987 654 321",
  whatsappPhone = "+51987654321",
  whatsappMessage = "Hola Viajes Carolina, deseo consultar sobre un viaje.",
  address = "Av. Larco 101, Oficina 502",
  district = "Miraflores",
  city = "Lima",
  scheduleWeekdays = "Lunes a Viernes: 9:00 AM – 7:00 PM",
  scheduleSaturdays = "Sábados: 9:00 AM – 2:00 PM",
  facebookUrl = "https://facebook.com/viajescarolina",
  instagramUrl = "https://instagram.com/viajescarolina",
  tiktokUrl = "https://tiktok.com/@viajescarolina",
}: FooterProps) {
  return (
    <footer className="w-full bg-brand-navy border-t border-white/10 text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Identity */}
          <div className="flex flex-col items-start space-y-4">
            <a href="/" className="focus:outline-none" aria-label="Viajes Carolina">
              <BrandLogo variant="light" className="h-8 w-auto mb-2" />
            </a>

            <p className="font-inter text-sm text-neutral-subtle leading-relaxed">
              {brandTagline}. Diseñamos viajes memorables y a medida con asesoría personalizada y acompañamiento en cada paso.
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

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-sora font-bold text-sm uppercase tracking-wider text-brand-sunset mb-1">
              Recorre el Sitio
            </h4>
            <ul className="space-y-2.5 font-inter text-sm text-atmosphere-sky">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/promociones" className="hover:text-white transition-colors">
                  Promociones Destacadas
                </a>
              </li>
              <li>
                <a href="/nosotros" className="hover:text-white transition-colors">
                  Nosotros y Experiencia
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  Blog e Inspiración
                </a>
              </li>
              <li>
                <a href="/contacto" className="hover:text-white transition-colors">
                  Contacto y Asesoría
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Office & Hours */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-sora font-bold text-sm uppercase tracking-wider text-brand-sunset mb-1">
              Oficina y Atención
            </h4>
            <div className="space-y-3 font-inter text-sm text-atmosphere-sky">
              <div className="flex items-start gap-2.5">
                <MapPinIcon size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <span>
                  {address}, {district} — {city}, Perú
                </span>
              </div>
              <div className="text-xs text-neutral-subtle leading-relaxed pt-1 space-y-1">
                <p>{scheduleWeekdays}</p>
                <p>{scheduleSaturdays}</p>
              </div>
              <div className="pt-2 text-xs text-atmosphere-sky">
                <p className="text-neutral-subtle">Correo oficial:</p>
                <a href={`mailto:${contactEmail}`} className="text-white hover:text-brand-accent transition-colors font-medium">
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Legal & Social */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-sora font-bold text-sm uppercase tracking-wider text-brand-sunset mb-1">
              Transparencia y Legal
            </h4>
            <ul className="space-y-2.5 font-inter text-sm text-atmosphere-sky mb-4">
              <li>
                <a
                  href="/reclamaciones"
                  className="inline-flex items-center gap-2 hover:text-brand-accent transition-colors font-medium"
                >
                  <span>📖 Libro de Reclamaciones</span>
                </a>
              </li>
              <li>
                <a href="/terminos" className="hover:text-white transition-colors text-xs text-neutral-subtle">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="/privacidad" className="hover:text-white transition-colors text-xs text-neutral-subtle">
                  Políticas de Privacidad
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="pt-2">
              <span className="font-sora text-xs font-semibold text-neutral-subtle block mb-2">
                Síguenos
              </span>
              <div className="flex items-center gap-3 text-white/80">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-brand-accent transition-colors"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-brand-accent transition-colors"
                    aria-label="Facebook"
                  >
                    Facebook
                  </a>
                )}
                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-brand-accent transition-colors"
                    aria-label="TikTok"
                  >
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
