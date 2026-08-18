"use client";

import React from "react";
import { ContactPageDTO } from "@vc/api-client";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { MapPinIcon, WhatsAppIcon, MailIcon, PhoneIcon } from "../icons/icons";

export interface ContactDirectBoxProps {
  page?: ContactPageDTO;
  whatsappPhone?: string;
  primaryPhone?: string;
  contactEmail?: string;
  officeAddress?: string;
  officeHours?: string;
  className?: string;
}

export function ContactDirectBox({
  page,
  whatsappPhone = "+51987654321",
  primaryPhone = "+51 987 654 321",
  contactEmail = "contacto@viajescarolina.com",
  officeAddress = "Av. Larco 101, Oficina 502, Miraflores, Lima",
  officeHours = "Lunes a Viernes: 9:00 AM – 7:00 PM | Sábados: 9:00 AM – 4:00 PM",
  className = "",
}: ContactDirectBoxProps) {
  const boxTitle = page?.whatsappBoxTitle || "¿Prefieres atención inmediata?";
  const boxSubtitle =
    page?.whatsappBoxSubtitle ||
    "Escríbenos por WhatsApp y una asesora experta te atenderá en minutos en horario de oficina.";

  return (
    <div
      className={`bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 flex flex-col justify-between shadow-2xl ${className}`}
    >
      <div className="space-y-6">
        {/* WhatsApp Hero Card */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-brand-navy border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-whatsapp/20 border border-brand-whatsapp/40 flex items-center justify-center text-brand-whatsapp">
              <WhatsAppIcon size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-whatsapp">
                Canal Directo 24/7
              </span>
              <h3 className="font-sora font-bold text-lg text-white">{boxTitle}</h3>
            </div>
          </div>

          <p className="font-inter text-xs text-atmosphere-sky leading-relaxed mb-5">
            {boxSubtitle}
          </p>

          <WhatsAppButton
            phone={whatsappPhone}
            message="Hola Viajes Carolina, deseo cotizar un viaje y recibir asesoría personalizada."
            className="w-full justify-center !py-3 shadow-lg text-sm font-bold"
          >
            Iniciar Chat por WhatsApp
          </WhatsAppButton>
        </div>

        {/* Channels Information */}
        <div className="space-y-4 pt-2">
          <h4 className="font-sora font-bold text-sm text-white uppercase tracking-wider text-xs text-white/70">
            Canales y Ubicación
          </h4>

          {/* Teléfono */}
          <div className="flex items-start gap-3 text-sm">
            <div className="p-2 rounded-lg bg-white/10 text-brand-accent shrink-0 mt-0.5">
              <PhoneIcon size={16} />
            </div>
            <div>
              <span className="block text-xs text-white/60 font-inter">Central Telefónica</span>
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                className="font-inter text-sm font-medium text-white hover:text-brand-accent transition-colors"
              >
                {primaryPhone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 text-sm">
            <div className="p-2 rounded-lg bg-white/10 text-brand-accent shrink-0 mt-0.5">
              <MailIcon size={16} />
            </div>
            <div>
              <span className="block text-xs text-white/60 font-inter">Correo Electrónico</span>
              <a
                href={`mailto:${contactEmail}`}
                className="font-inter text-sm font-medium text-white hover:text-brand-accent transition-colors"
              >
                {contactEmail}
              </a>
            </div>
          </div>

          {/* Oficina */}
          <div className="flex items-start gap-3 text-sm">
            <div className="p-2 rounded-lg bg-white/10 text-brand-accent shrink-0 mt-0.5">
              <MapPinIcon size={16} />
            </div>
            <div>
              <span className="block text-xs text-white/60 font-inter">Oficina en Miraflores</span>
              <p className="font-inter text-sm font-medium text-white/90 leading-snug">
                {officeAddress}
              </p>
            </div>
          </div>

          {/* Horarios */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-sunset block">
              Horario de Atención
            </span>
            <p className="font-inter text-xs text-white/80 leading-relaxed">
              {officeHours}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
