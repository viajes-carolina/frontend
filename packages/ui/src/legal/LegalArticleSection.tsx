"use client";

import React from "react";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";

export interface LegalArticleSectionItem {
  number: string;
  title: string;
  body: string;
}

export interface LegalArticleDeclaration {
  eyebrow: string;
  title: string;
  body: string;
}

export interface LegalArticleVerification {
  eyebrow: string;
  buttonLabel: string;
  note: string;
  legalCompanyName: string;
  taxId: string;
  registrationNumber?: string;
  location: string;
  certificateUrl?: string;
}

export interface LegalArticleSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  updatedLabel: string;
  tocLabel?: string;
  /** Bloque de declaración de principios, renderizado antes del índice — usado solo por ESNNA. */
  declaration?: LegalArticleDeclaration;
  /** Bloque de verificación de registro MINCETUR, renderizado antes del índice — usado solo por Constancia MINCETUR. */
  verification?: LegalArticleVerification;
  sections: LegalArticleSectionItem[];
  closingTitle: string;
  closingBody: string;
  whatsappCtaLabel: string;
  whatsappPhone?: string;
  whatsappMessage?: string;
}

// Plantilla compartida de página legal (Términos, y a futuro Privacidad,
// Cookies, ESNNA con el mismo tratamiento) — hero + índice + secciones
// numeradas + cierre contextual hacia WhatsApp. Header y footer del sitio
// se heredan de RootLayout, no se repiten aquí.
export function LegalArticleSection({
  eyebrow,
  title,
  intro,
  updatedLabel,
  tocLabel = "ÍNDICE DEL DOCUMENTO",
  declaration,
  verification,
  sections,
  closingTitle,
  closingBody,
  whatsappCtaLabel,
  whatsappPhone = DEFAULT_WHATSAPP_PHONE,
  whatsappMessage = "Hola Viajes Carolina, tengo una consulta antes de reservar.",
}: LegalArticleSectionProps) {
  const handleWhatsAppClick = () => {
    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="w-full">
      {/* Hero legal */}
      <section className="w-full bg-brand-navy px-6 pb-12 pt-16 sm:px-10 sm:pb-[68px] sm:pt-[72px] lg:px-[192px]">
        <div className="flex flex-col items-start gap-4 sm:gap-5">
          <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">{eyebrow}</p>
          <h1
            className="font-display max-w-[920px] text-[43px] font-semibold leading-[1.04] text-white sm:text-[52px] lg:text-[66px]"
            style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
          >
            {title}
          </h1>
          <p className="max-w-[780px] font-inter text-base leading-[1.55] text-atmosphere-pale-sky sm:text-xl">{intro}</p>
          <div className="inline-flex items-center gap-[9px] rounded-full bg-white/[0.14] px-3.5 py-2.5">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-brand-accent" aria-hidden="true" />
            <span className="font-inter text-xs font-semibold text-white">{updatedLabel}</span>
          </div>
        </div>
      </section>

      {/* Declaración de principios (solo ESNNA) */}
      {declaration && (
        <section className="w-full px-6 pt-10 sm:px-10 sm:pt-12 lg:px-[192px]">
          <div className="flex flex-col items-start gap-3 rounded-[22px] bg-atmosphere-pale-sky p-6 sm:p-[30px]">
            <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {declaration.eyebrow}
            </p>
            <h2
              className="max-w-[760px] font-display text-2xl font-semibold leading-[1.15] text-brand-navy sm:text-[32px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {declaration.title}
            </h2>
            <p className="max-w-[760px] font-inter text-[15px] leading-[1.65] text-neutral-muted sm:text-base">
              {declaration.body}
            </p>
          </div>
        </section>
      )}

      {/* Verificación de registro MINCETUR (solo Constancia MINCETUR) */}
      {verification && (
        <section className="w-full px-6 pt-10 sm:px-10 sm:pt-12 lg:px-[192px]">
          <div className="flex flex-col gap-5 rounded-[22px] border border-neutral-border bg-white p-6 shadow-sm sm:p-[30px]">
            <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {verification.eyebrow}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-muted">
                  Razón social
                </p>
                <p className="font-inter text-base font-semibold text-brand-navy">{verification.legalCompanyName}</p>
              </div>
              <div>
                <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-muted">RUC</p>
                <p className="font-inter text-base font-semibold text-brand-navy">{verification.taxId}</p>
              </div>
              {verification.registrationNumber && (
                <div>
                  <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-muted">
                    N.° de registro MINCETUR
                  </p>
                  <p className="font-inter text-base font-semibold text-brand-navy">{verification.registrationNumber}</p>
                </div>
              )}
              <div>
                <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-muted">
                  Ubicación registrada
                </p>
                <p className="font-inter text-base font-semibold text-brand-navy">{verification.location}</p>
              </div>
            </div>
            {verification.certificateUrl && (
              <a
                href={verification.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-brand-navy px-[22px] py-[14px] font-inter text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto"
              >
                {verification.buttonLabel}
              </a>
            )}
            <p className="max-w-[700px] font-inter text-[13.5px] leading-[1.6] text-neutral-muted">{verification.note}</p>
          </div>
        </section>
      )}

      {/* Contenido principal */}
      <section className="w-full px-6 pb-14 pt-10 sm:px-10 sm:pb-[90px] sm:pt-[70px] lg:px-[192px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-[58px]">
          {/* Índice de contenidos */}
          <div className="flex w-full flex-col gap-3 rounded-[20px] bg-atmosphere-pale-sky p-5 sm:p-6 lg:sticky lg:top-24 lg:w-[260px] lg:shrink-0">
            <p className="font-sora text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-accent">{tocLabel}</p>
            {sections.map((s) => (
              <a
                key={s.number}
                href={`#seccion-${s.number}`}
                className="flex gap-2 font-inter text-sm font-semibold leading-[1.4] text-brand-navy transition-colors hover:text-brand-accent"
              >
                <span>{s.number}</span>
                <span>{s.title}</span>
              </a>
            ))}
          </div>

          {/* Secciones numeradas */}
          <div className="flex min-w-0 flex-1 flex-col gap-7 lg:gap-[34px]">
            {sections.map((s, idx) => (
              <React.Fragment key={s.number}>
                <div id={`seccion-${s.number}`} className="flex scroll-mt-24 flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex shrink-0 items-center rounded-full bg-atmosphere-twilight px-2.5 py-[7px] font-sora text-[10px] font-semibold text-brand-accent">
                      {s.number}
                    </span>
                    <h2
                      className="font-display text-2xl font-semibold leading-[1.15] text-brand-navy sm:text-[31px]"
                      style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                    >
                      {s.title}
                    </h2>
                  </div>
                  <p className="max-w-[760px] font-inter text-[15px] leading-[1.65] text-neutral-muted sm:text-base">{s.body}</p>
                </div>
                <div className="h-px w-full max-w-[760px] bg-neutral-border" />
              </React.Fragment>
            ))}

            {/* Cierre contextual */}
            <div className="flex flex-col items-start gap-3 rounded-[22px] bg-atmosphere-pale-sky p-6 sm:p-[30px]">
              <h3
                className="max-w-[700px] font-display text-2xl font-semibold leading-[1.15] text-brand-navy sm:text-[34px]"
                style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
              >
                {closingTitle}
              </h3>
              <p className="max-w-[700px] font-inter text-base leading-[1.55] text-neutral-muted">{closingBody}</p>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-brand-navy px-[22px] py-[14px] font-inter text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto"
              >
                {whatsappCtaLabel}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
