"use client";

import React from "react";
import { AccompanyStepDTO, TravelAdvisorDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface AdvisorsSectionProps {
  advisors: TravelAdvisorDTO[];
  advisorsBadge: string;
  advisorsHighlights: AccompanyStepDTO[];
  className?: string;
}

// El frontend consume una lista de perfiles publicados y decide el layout
// según cuántos haya — nunca hay tarjetas vacías ni "espacios reservados"
// para integrantes futuros (especificación de Figma "565:15"). Con 1 sola
// asesora activa se muestra un relato editorial de una persona; con 2+, una
// grilla protagonista + secundarias.
export function AdvisorsSection({ advisors, advisorsBadge, advisorsHighlights, className = "" }: AdvisorsSectionProps) {
  if (!advisors || advisors.length === 0) return null;

  if (advisors.length === 1) {
    return (
      <SingleAdvisorEditorial
        advisor={advisors[0]}
        advisorsBadge={advisorsBadge}
        advisorsHighlights={advisorsHighlights}
        className={className}
      />
    );
  }

  return <AdvisorsGrid advisors={advisors} advisorsBadge={advisorsBadge} className={className} />;
}

function whatsappFor(advisor: TravelAdvisorDTO) {
  const phone = advisor.whatsappPhone || DEFAULT_WHATSAPP_PHONE;
  const message =
    advisor.whatsappMessageTemplate || `Hola ${advisor.fullName}, me gustaría una asesoría personalizada para planificar mi viaje.`;
  return { phone, message };
}

function SingleAdvisorEditorial({
  advisor,
  advisorsBadge,
  advisorsHighlights,
  className = "",
}: {
  advisor: TravelAdvisorDTO;
  advisorsBadge?: string;
  advisorsHighlights: AccompanyStepDTO[];
  className?: string;
}) {
  const { phone, message } = whatsappFor(advisor);
  const firstName = advisor.fullName.split(" ")[0];

  return (
    <section className={`relative w-full overflow-hidden bg-brand-navy py-16 sm:py-20 lg:py-24 ${className}`}>
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
            {advisorsBadge && (
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
                {advisorsBadge}
              </p>
            )}
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[50px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {advisor.fullName}
            </h2>
            <p className="font-inter mt-2 text-sm font-semibold uppercase tracking-wide text-white/60">
              {advisor.roleTitle}
            </p>
            <p className="font-inter mt-6 text-base text-white/80 sm:text-lg">{advisor.bio}</p>
            {advisor.quote && (
              <p
                className="font-display mt-6 text-xl italic leading-snug text-white sm:text-2xl"
                style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
              >
                &ldquo;{advisor.quote}&rdquo;
              </p>
            )}
            <div className="mt-8">
              <WhatsAppButton phone={phone} message={message}>
                {`Conversa con ${firstName}`}
              </WhatsAppButton>
            </div>

            {advisorsHighlights.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/15 pt-8 sm:grid-cols-2 sm:divide-x sm:divide-white/15">
                {advisorsHighlights.map((item, i) => (
                  <div key={i} className={i > 0 ? "sm:pl-6" : ""}>
                    <h4 className="font-sora text-sm font-semibold text-brand-accent">{item.title}</h4>
                    <p className="font-inter mt-1.5 text-sm text-white/70">{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdvisorsGrid({
  advisors,
  advisorsBadge,
  className = "",
}: {
  advisors: TravelAdvisorDTO[];
  advisorsBadge?: string;
  className?: string;
}) {
  const sorted = [...advisors].sort((a, b) => a.displayOrder - b.displayOrder);
  const [protagonist, ...rest] = sorted;
  const { phone, message } = whatsappFor(protagonist);

  return (
    <section className={`relative w-full overflow-hidden bg-brand-navy py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Protagonista — misma voz editorial de SingleAdvisorEditorial, sin voces de apoyo */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-12 sm:gap-8">
              <div className="relative sm:col-span-5">
                <div className="relative mx-auto w-full max-w-[320px] pl-6 pt-6">
                  <div className="absolute -left-6 top-4 bottom-0 right-4 rounded-[48px] bg-atmosphere-pale-sky" aria-hidden="true" />
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] shadow-hover">
                    <ResponsiveImage
                      src={protagonist.photoMediaUrl || "/media/demo-cartagena-caribe.webp"}
                      alt={protagonist.fullName}
                      fill
                      className="w-full h-full"
                    />
                  </div>
                  <span className="absolute -top-2 right-2 h-10 w-10 rounded-full bg-brand-accent shadow-[0px_8px_16px_0px_rgba(255,121,0,0.35)]" aria-hidden="true" />
                </div>
              </div>
              <div className="sm:col-span-7">
                {advisorsBadge && (
                  <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
                    {advisorsBadge}
                  </p>
                )}
                <h2
                  className="font-display mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl"
                  style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                >
                  {protagonist.fullName}
                </h2>
                <p className="font-inter mt-2 text-sm font-semibold uppercase tracking-wide text-white/60">
                  {protagonist.roleTitle}
                </p>
                <p className="font-inter mt-5 text-base text-white/80">{protagonist.bio}</p>
                {protagonist.quote && (
                  <p
                    className="font-display mt-5 text-lg italic leading-snug text-white"
                    style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                  >
                    &ldquo;{protagonist.quote}&rdquo;
                  </p>
                )}
                <div className="mt-6">
                  <WhatsAppButton phone={phone} message={message}>
                    {`Conversa con ${protagonist.fullName.split(" ")[0]}`}
                  </WhatsAppButton>
                </div>
              </div>
            </div>
          </div>

          {/* Secundarias — fila de tarjetas compactas al lado en desktop, lista vertical en mobile */}
          {rest.length > 0 && (
            <div className="flex flex-col gap-4 lg:col-span-5">
              {rest.map((advisor) => {
                const secondary = whatsappFor(advisor);
                return (
                  <div key={advisor.id} className="flex items-center gap-4 rounded-[20px] bg-white p-4 shadow-sm">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                      <ResponsiveImage
                        src={advisor.photoMediaUrl || "/media/demo-cartagena-caribe.webp"}
                        alt={advisor.fullName}
                        fill
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-display truncate text-base font-semibold text-brand-navy"
                        style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
                      >
                        {advisor.fullName}
                      </h3>
                      <p className="font-inter text-xs font-semibold text-brand-accent">{advisor.roleTitle}</p>
                      <div className="mt-1.5">
                        <WhatsAppButton phone={secondary.phone} message={secondary.message} variant="link" size="sm">
                          {`Consultar con ${advisor.fullName.split(" ")[0]}`}
                        </WhatsAppButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
