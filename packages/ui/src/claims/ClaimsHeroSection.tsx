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
    <section className="pt-32 pb-14 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden border-b border-slate-700/60">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-950/80 border border-primary-500/30 text-primary-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <span>📖</span>
          <span>Libro de Reclamaciones Virtual</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-sora text-white tracking-tight mb-4 leading-tight">
          Hoja de Reclamación Digital
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-inter">
          Conforme a lo establecido en el Código de Protección y Defensa del Consumidor (Ley N° 29571) y el D.S. N° 011-2011-PCM de la República del Perú.
        </p>

        {/* Legal Identity Card */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 max-w-2xl mx-auto text-xs text-slate-300 space-y-1.5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-2">
            <span className="font-semibold text-slate-400">Razón Social:</span>
            <span className="font-bold text-white uppercase">{companyName}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-2">
            <span className="font-semibold text-slate-400">RUC:</span>
            <span className="font-mono font-bold text-primary-300">{companyRuc}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="font-semibold text-slate-400">Domicilio Legal:</span>
            <span className="text-white text-right">{officeAddress}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
