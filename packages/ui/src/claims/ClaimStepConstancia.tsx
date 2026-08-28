"use client";

import React from "react";

export interface ClaimStepConstanciaProps {
  claimCode: string;
  createdAt?: string;
  email: string;
  pdfUrl: string;
}

// Los botones de esta pantalla son <a> reales (descarga/navegación), no <button> —
// por eso reutilizan las clases visuales de Button en vez del componente en sí
// (anidar un <button> dentro de un <a> es HTML inválido).
const primaryLinkClass =
  "inline-flex items-center justify-center font-sora font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm px-5 py-2.5 rounded-xl gap-2 bg-brand-accent text-brand-navy hover:bg-brand-sunset active:scale-[0.98] shadow-sm focus:ring-brand-accent";
const outlineLinkClass =
  "inline-flex items-center justify-center font-sora font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm px-5 py-2.5 rounded-xl gap-2 border-2 border-brand-navy/20 text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5 active:scale-[0.98] focus:ring-brand-navy";

/**
 * Pantalla de constancia — resultado del asistente, ya no forma parte del
 * stepper de 4 pasos.
 */
export function ClaimStepConstancia({ claimCode, createdAt, email, pdfUrl }: ClaimStepConstanciaProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <main className="min-h-screen">
      <header className="border-b border-neutral-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="font-sora font-bold text-brand-navy text-sm sm:text-base">
            Viajes Carolina
          </span>
          <a
            href="/"
            className="font-sora text-xs sm:text-sm font-semibold text-neutral-muted hover:text-brand-navy transition-colors"
          >
            ← Volver al sitio
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-neutral-border shadow-sm p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
            ✓
          </div>
          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Hoja registrada
          </span>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl text-brand-navy">Recibimos tu reclamo.</h1>
            <p className="text-sm text-neutral-muted">
              Enviaremos la constancia y nuestra respuesta al correo que indicaste:{" "}
              <strong className="text-brand-navy">{email}</strong>.
            </p>
          </div>

          <div className="bg-neutral-soft border-2 border-dashed border-brand-navy/20 rounded-2xl p-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-muted mb-1">
              Código de registro
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brand-navy font-mono tracking-widest">
              {claimCode}
            </div>
            {formattedDate && (
              <p className="text-xs text-neutral-muted mt-2">Registrado el {formattedDate}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={primaryLinkClass}>
              Descargar constancia PDF
            </a>
            <a href="/" className={outlineLinkClass}>
              Volver al sitio
            </a>
          </div>

          <div className="bg-atmosphere-pale-sky rounded-2xl p-4 text-left space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy">
              ¿Qué sigue?
            </div>
            <p className="text-xs text-brand-navy leading-relaxed">
              Viajes Carolina responderá por escrito en un máximo de 15 días hábiles. Conserva este
              código y la constancia.
            </p>
          </div>

          <p className="text-[11px] text-neutral-subtle leading-relaxed">
            Si no recibes atención dentro del plazo, puedes acudir a Indecopi adjuntando tu constancia.
          </p>
        </div>
      </div>
    </main>
  );
}
