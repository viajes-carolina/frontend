"use client";

import React from "react";
import { TravelAdvisorDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface AdvisorsSectionProps {
  advisors: TravelAdvisorDTO[];
  className?: string;
}

// El frontend consume una lista de perfiles publicados y decide el layout
// según cuántos haya — nunca hay tarjetas vacías ni "espacios reservados"
// para integrantes futuros (especificación de Figma "565:15"). Con 1 sola
// asesora activa se muestra un relato editorial de una persona; con 2+, una
// grilla protagonista + secundarias.
export function AdvisorsSection({ advisors, className = "" }: AdvisorsSectionProps) {
  if (!advisors || advisors.length === 0) return null;

  if (advisors.length === 1) {
    return <SingleAdvisorEditorial advisor={advisors[0]} className={className} />;
  }

  return <AdvisorsGrid advisors={advisors} className={className} />;
}

function SingleAdvisorEditorial({ advisor, className = "" }: { advisor: TravelAdvisorDTO; className?: string }) {
  const phone = advisor.whatsappPhone || DEFAULT_WHATSAPP_PHONE;
  const message = advisor.whatsappMessageTemplate || `Hola ${advisor.fullName}, me gustaría una asesoría personalizada para planificar mi viaje.`;
  const firstName = advisor.fullName.split(" ")[0];

  return (
    <section className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[430px] pl-6 pt-6">
              <div className="absolute -left-6 top-4 bottom-0 right-4 rounded-[56px] bg-atmosphere-pale-sky" aria-hidden="true" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[40px] shadow-hover">
                <ResponsiveImage src={advisor.photoMediaUrl || "/media/demo-cartagena-caribe.webp"} alt={advisor.fullName} fill className="w-full h-full" />
              </div>
              <span className="absolute -top-2 right-2 h-12 w-12 rounded-full bg-brand-accent shadow-[0px_8px_16px_0px_rgba(255,121,0,0.35)]" aria-hidden="true" />
              <div className="absolute bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-[10px] bg-white px-5 py-3 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]">
                <p className="font-sora text-[11px] font-semibold text-brand-navy">
                  {advisor.fullName.toUpperCase()} · {advisor.roleTitle.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
              04 · Quién te acompaña
            </p>
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl lg:text-[50px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              Hay alguien que conoce tu viaje por tu nombre.
            </h2>
            <p className="font-inter mt-6 text-base text-brand-navy/75 sm:text-lg">{advisor.bio}</p>
            {advisor.quote && (
              <p
                className="font-display mt-6 text-xl italic leading-snug text-brand-navy sm:text-2xl"
                style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
              >
                &ldquo;{advisor.quote}&rdquo;
              </p>
            )}
            <div className="mt-8">
              <span className="block h-1 w-16 rounded-full bg-brand-accent" aria-hidden="true" />
              <p className="mt-3 font-inter text-sm font-semibold text-brand-navy">
                {advisor.fullName} · Viajes Carolina
              </p>
            </div>
            <div className="mt-6">
              <WhatsAppButton phone={phone} message={message} variant="link">
                {`Conversa con ${firstName} →`}
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdvisorsGrid({ advisors, className = "" }: { advisors: TravelAdvisorDTO[]; className?: string }) {
  return (
    <section className={`relative w-full overflow-hidden py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
            04 · Quién te acompaña
          </p>
          <h2
            className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl lg:text-[46px]"
            style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
          >
            Hay alguien que conoce tu viaje por tu nombre.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {advisors.map((advisor) => {
            const phone = advisor.whatsappPhone || DEFAULT_WHATSAPP_PHONE;
            const message = advisor.whatsappMessageTemplate || `Hola ${advisor.fullName}, me gustaría una asesoría personalizada para planificar mi viaje.`;

            return (
              <div
                key={advisor.id}
                className="group flex flex-col overflow-hidden rounded-[24px] border border-neutral-border bg-white shadow-sm transition-shadow hover:shadow-hover"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-navy">
                  <ResponsiveImage
                    src={advisor.photoMediaUrl || "/media/demo-cartagena-caribe.webp"}
                    alt={advisor.fullName}
                    fill
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block rounded-full bg-brand-navy/90 px-3 py-1 font-sora text-[11px] font-semibold text-brand-accent backdrop-blur-md">
                      {advisor.specialty}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3
                      className="font-display text-xl font-semibold text-brand-navy"
                      style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                    >
                      {advisor.fullName}
                    </h3>
                    <p className="font-inter mt-0.5 text-xs font-semibold text-brand-accent">{advisor.roleTitle}</p>
                    <p className="font-inter mt-3 text-sm leading-relaxed text-brand-navy/75">{advisor.bio}</p>
                  </div>
                  <div className="mt-5 border-t border-neutral-border pt-4">
                    <WhatsAppButton phone={phone} message={message} variant="link" size="sm">
                      {`Consultar con ${advisor.fullName.split(" ")[0]}`}
                    </WhatsAppButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
