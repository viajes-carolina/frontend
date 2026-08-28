"use client";

import React from "react";

export interface ClaimsHeroSectionProps {
  companyName?: string;
  companyRuc?: string;
  officeAddress?: string;
}

export const ClaimsHeroSection: React.FC<ClaimsHeroSectionProps> = ({
  companyName = "VIAJES CAROLINA S.A.C.",
  companyRuc = "20601234567",
  officeAddress = "Av. Larco 101, Oficina 502, Miraflores, Lima, Perú",
}) => {
  return (
    <section className="pt-32 pb-14 relative overflow-hidden border-b border-neutral-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-border text-brand-accent text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <span>📖</span>
          <span>Libro de Reclamaciones Virtual</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-sora text-brand-navy tracking-tight mb-4 leading-tight">
          Hoja de Reclamación Digital
        </h1>

        <p className="text-neutral-muted text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-inter">
          Conforme a lo establecido en el Código de Protección y Defensa del Consumidor (Ley N° 29571) y el D.S. N° 011-2011-PCM de la República del Perú.
        </p>

        {/* Legal Identity Card */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-border max-w-2xl mx-auto text-xs text-neutral-muted space-y-1.5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-border pb-2">
            <span className="font-semibold text-neutral-muted">Razón Social:</span>
            <span className="font-bold text-brand-navy uppercase">{companyName}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-border pb-2">
            <span className="font-semibold text-neutral-muted">RUC:</span>
            <span className="font-mono font-bold text-brand-navy">{companyRuc}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="font-semibold text-neutral-muted">Domicilio Legal:</span>
            <span className="text-brand-navy text-right">{officeAddress}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
