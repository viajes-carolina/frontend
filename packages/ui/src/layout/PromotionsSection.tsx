"use client";

import React, { useState } from "react";
import { PromotionDTO, SiteSettingsDTO, HomePromotionsSectionDTO } from "@vc/api-client";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { Reveal } from "../primitives/Reveal";
import { ResponsiveImage } from "../primitives/ResponsiveImage";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface PromotionsSectionProps {
  promotions: PromotionDTO[];
  settings?: SiteSettingsDTO;
  config?: HomePromotionsSectionDTO;
  className?: string;
}

const DEFAULT_CONFIG: HomePromotionsSectionDTO = {
  badgeText: "VIAJES LISTOS PARA COTIZAR",
  title: "Elige una experiencia. Nosotros la adaptamos a ti.",
  subtitle: "Paquetes que podemos ajustar a tus fechas, presupuesto y forma de viajar.",
  bottomCtaQuestion: "Cuéntanos qué imaginas y lo armamos contigo.",
  bottomCtaEyebrow: "SI NINGUNO ENCAJA EXACTAMENTE",
  bottomCtaCopy: "Fechas, presupuesto y tipo de viaje: una asesora prepara opciones reales para ti.",
  bottomCtaWhatsappText: "Quiero una propuesta a mi medida",
  bottomCtaWhatsappMessage: "Hola Viajes Carolina, me gustaría conversar sobre una de sus promociones.",
};

function openWhatsApp(phone: string | undefined, message: string) {
  const cleanPhone = (phone || DEFAULT_WHATSAPP_PHONE).replace(/[^0-9]/g, "");
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function whatsappMessageFor(promo: PromotionDTO) {
  return (
    promo.whatsappMessageTemplate ||
    `Hola Viajes Carolina, me interesa la promoción "${promo.title}". ¿Tienen fechas disponibles?`
  );
}

// Paleta de respaldo cuando la promoción no tiene featuredMediaUrl — en el
// mismo orden que las tarjetas: protagonista, secundaria 1, secundaria 2.
// Colores tomados del Figma "Promociones más vendible" (703:4 / 703:6).
const FALLBACK_GRADIENTS = [
  "bg-gradient-to-br from-[#66c2e8] via-[#1a82b8] via-40% to-[#0a527a]",
  "bg-gradient-to-br from-[#faa159] to-[#a3402e]",
  "bg-gradient-to-br from-[#3dab85] to-[#0d5245]",
];

function DestinationMedia({
  promo,
  gradientClass,
  labelClassName,
  showSunAccent = false,
}: {
  promo: PromotionDTO;
  gradientClass: string;
  labelClassName: string;
  showSunAccent?: boolean;
}) {
  const hasPhoto = Boolean(promo.featuredMediaUrl);
  return (
    <div className={`relative size-full ${hasPhoto ? "" : gradientClass}`}>
      {hasPhoto ? (
        <ResponsiveImage
          src={promo.featuredMediaUrl!}
          alt={promo.destination || promo.title}
          fill
          objectFit="cover"
          focalPoint={{ x: promo.featuredMediaFocalX ?? 50, y: promo.featuredMediaFocalY ?? 50 }}
          className="!rounded-none"
        />
      ) : (
        showSunAccent && (
          <span
            aria-hidden="true"
            className="absolute right-[8%] top-[10%] size-[26%] rounded-full bg-brand-accent/85 blur-[1px]"
          />
        )
      )}
      {/* Velo para legibilidad del nombre del destino, tanto sobre foto real como sobre gradiente. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent" />
      {promo.destination?.trim() && (
        <p
          className={`font-display absolute bottom-4 left-4 right-4 truncate font-semibold uppercase leading-none text-white sm:bottom-5 sm:left-6 ${labelClassName}`}
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          {shortDestination(promo.destination)}
        </p>
      )}
    </div>
  );
}

// El overlay grande sobre la foto quiere el nombre corto del destino ("PUNTA
// CANA"), no la ubicación completa ("Punta Cana, República Dominicana") que
// guarda `destination` — esa versión completa sí se usa en textos chicos.
function shortDestination(destination: string) {
  return destination.split(",")[0].trim();
}

function toDurationLabel(promo: PromotionDTO) {
  return `${promo.durationDays} días / ${promo.durationNights} noches`;
}

// El resumen de una promoción suele venir pegado tal cual del post de
// Facebook original: un solo párrafo largo con emojis que funcionan como
// viñetas (✈️ vuelo, 🏨 hotel, 💰 precio...). Partimos en una línea nueva
// antes de cada emoji para que se lea como lista en vez de un bloque
// compacto — no hay forma de saber la intención real del texto libre, pero
// esta heurística cubre bien el patrón real de estos textos.
function formatOfferSummary(text: string): string[] {
  return text
    .replace(/\s*(\p{Extended_Pictographic})/gu, "\n$1")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function FeaturedPromoCard({
  promo,
  whatsappPhone,
  className = "",
}: {
  promo: PromotionDTO;
  whatsappPhone?: string;
  className?: string;
}) {
  const [showExclusions, setShowExclusions] = useState(false);
  const hasExclusions = promo.exclusions && promo.exclusions.length > 0;

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-[32px] aspect-[4/3] sm:aspect-[16/10]">
        <DestinationMedia
          promo={promo}
          gradientClass={FALLBACK_GRADIENTS[0]}
          labelClassName="text-3xl sm:text-4xl lg:text-[46px]"
          showSunAccent
        />
      </div>

      <div className="relative z-10 -mt-16 mx-4 flex flex-col gap-3 rounded-[26px] bg-white/95 p-6 shadow-[0_18px_40px_-8px_rgba(20,41,59,0.2)] backdrop-blur-md sm:-mt-20 sm:mx-6 sm:p-7">
        <span className="w-fit rounded-full bg-brand-accent px-3.5 py-1.5 font-sora text-[10px] font-semibold uppercase tracking-wider text-white">
          Más solicitado
        </span>

        <h3 className="font-display text-[26px] font-semibold leading-[1.1] text-brand-navy sm:text-[30px]">
          {promo.title}
        </h3>

        <p className="font-inter text-sm font-medium text-brand-navy">{toDurationLabel(promo)}</p>

        {promo.summary?.trim() && (
          <div className="flex flex-col gap-1">
            {formatOfferSummary(promo.summary).map((line, i) => (
              <p key={i} className="font-inter text-sm leading-[1.5] text-brand-navy/80">
                {line}
              </p>
            ))}
          </div>
        )}

        {promo.inclusions?.length > 0 && (
          <ul className="flex flex-col gap-1 font-inter text-[13px] leading-[1.6] text-brand-navy">
            {promo.inclusions.map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <span aria-hidden="true" className="text-brand-whatsapp">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {Number(promo.priceUsd) > 0 && (
          <p className="font-inter text-lg font-semibold text-brand-navy">
            Desde US$ {Number(promo.priceUsd).toLocaleString()} por persona
          </p>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
          <WhatsAppButton
            size="md"
            phone={whatsappPhone}
            message={whatsappMessageFor(promo)}
            className="w-full sm:w-auto"
          >
            Cotizar {promo.destination ? shortDestination(promo.destination) : "este viaje"} por WhatsApp
          </WhatsAppButton>

          {hasExclusions && (
            <button
              type="button"
              onClick={() => setShowExclusions((v) => !v)}
              aria-expanded={showExclusions}
              className="font-inter text-[13px] font-semibold text-brand-navy underline decoration-brand-navy/30 underline-offset-2 transition-colors hover:text-brand-accent hover:decoration-brand-accent"
            >
              {showExclusions ? "Ocultar detalles ←" : "Ver qué incluye →"}
            </button>
          )}
        </div>

        {showExclusions && hasExclusions && (
          <ul className="flex flex-col gap-1 border-t border-brand-navy/10 pt-3 font-inter text-[13px] leading-[1.6] text-brand-navy/70">
            <li className="font-semibold text-brand-navy/80">No incluye:</li>
            {promo.exclusions.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SecondaryPromoCard({
  promo,
  gradientClass,
  whatsappPhone,
  className = "",
}: {
  promo: PromotionDTO;
  gradientClass: string;
  whatsappPhone?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex overflow-hidden rounded-[24px] border border-neutral-border bg-neutral-white ${className}`}
    >
      <div className="w-[112px] shrink-0 sm:w-[140px] lg:w-[156px]">
        <DestinationMedia promo={promo} gradientClass={gradientClass} labelClassName="text-[11px] tracking-wide" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <span className="font-sora text-[9px] font-semibold uppercase tracking-wider text-brand-accent">
          {toDurationLabel(promo)}
        </span>
        <h4 className="font-display text-lg font-semibold leading-[1.15] text-brand-navy sm:text-[21px]">
          {promo.title}
        </h4>
        {promo.summary?.trim() && (
          <p className="font-inter text-xs leading-[1.4] text-brand-navy/80 line-clamp-2">{promo.summary}</p>
        )}
        {Number(promo.priceUsd) > 0 && (
          <p className="font-inter text-sm font-semibold text-brand-navy">
            Desde US$ {Number(promo.priceUsd).toLocaleString()}
          </p>
        )}
        <button
          type="button"
          onClick={() => openWhatsApp(whatsappPhone, whatsappMessageFor(promo))}
          className="mt-auto w-fit rounded-full bg-brand-navy px-4 py-2 font-inter text-[13px] font-semibold text-white transition-colors hover:bg-brand-navy/90"
        >
          Ver viaje →
        </button>
      </div>
    </div>
  );
}

function PromotionsClosingCta({
  config,
  whatsappPhone,
  className = "",
}: {
  config: HomePromotionsSectionDTO;
  whatsappPhone?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start gap-5 rounded-[28px] bg-brand-navy px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="max-w-xl">
        {config.bottomCtaEyebrow?.trim() && (
          <p className="font-sora text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
            {config.bottomCtaEyebrow}
          </p>
        )}
        <p className="font-display mt-2 text-2xl font-semibold leading-[1.15] text-white sm:text-[28px]">
          {config.bottomCtaQuestion}
        </p>
        {config.bottomCtaCopy?.trim() && (
          <p className="font-inter mt-2.5 text-sm leading-relaxed text-white/75">{config.bottomCtaCopy}</p>
        )}
      </div>
      <WhatsAppButton
        size="lg"
        phone={whatsappPhone}
        message={config.bottomCtaWhatsappMessage}
        className="w-full shrink-0 lg:w-auto"
      >
        {config.bottomCtaWhatsappText}
      </WhatsAppButton>
    </div>
  );
}

export function PromotionsSection({ promotions, settings, config = DEFAULT_CONFIG, className = "" }: PromotionsSectionProps) {
  if (!promotions || promotions.length === 0) {
    return null;
  }

  // El backend ya devuelve como máximo 3 promociones activas, ordenadas por
  // recencia (la más reciente/protagonista primero) — no hace falta reordenar
  // aquí. El .slice(0, 2) se mantiene como defensa si algún día llegaran más.
  const [featuredPromo, ...rest] = promotions;
  const secondaryPromos = rest.slice(0, 2);

  return (
    <section
      id="promociones"
      className={`relative w-full overflow-hidden py-16 sm:py-20 xl:py-24 text-neutral-ink ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-[1180px] lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
            {config.badgeText}
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold leading-[1.08] text-brand-navy sm:text-4xl lg:text-[44px]">
            {config.title}
          </h2>
          <p className="font-inter mt-3 text-base leading-relaxed text-brand-navy sm:text-lg">{config.subtitle}</p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-6 lg:mt-14 lg:flex-row lg:items-start lg:gap-8">
          <Reveal delayMs={80} className="lg:flex-[1.7]">
            <FeaturedPromoCard promo={featuredPromo} whatsappPhone={settings?.whatsappPhone} />
          </Reveal>

          <div className="flex flex-col gap-5 lg:w-[380px] lg:shrink-0">
            {secondaryPromos.map((p, i) => (
              <Reveal key={p.id || p.slug} delayMs={160 + i * 80}>
                <SecondaryPromoCard
                  promo={p}
                  gradientClass={FALLBACK_GRADIENTS[i + 1] || FALLBACK_GRADIENTS[1]}
                  whatsappPhone={settings?.whatsappPhone}
                />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delayMs={320} className="mt-10 lg:mt-14">
          <PromotionsClosingCta config={config} whatsappPhone={settings?.whatsappPhone} />
        </Reveal>

        <p className="mt-6 text-center font-inter text-xs text-brand-navy/55 lg:text-left">
          Asesoría sin costo · Opciones personalizadas · Tarifas sujetas a disponibilidad
        </p>
      </div>
    </section>
  );
}
