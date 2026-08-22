"use client";

import React, { useId } from "react";
import { PromotionDTO, SiteSettingsDTO } from "@vc/api-client";
import { Reveal } from "../primitives/Reveal";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface PromotionsSectionProps {
  promotions: PromotionDTO[];
  settings?: SiteSettingsDTO;
  className?: string;
}

// Ruta vertical (Desktop/Wide) — Figma "Ruta continua · Promociones · Vertical"
// (nodes 401:36 / 409:37, idéntica entre ambos tramos). viewBox 150x760.
const ROUTE_VERTICAL_PATH = "M92 0C26 128 132 214 70 342C20 447 132 526 72 662C57 696 60 730 82 760";

// Ruta horizontal (Mobile/Tablet) — Figma "Ruta · 02 Descubrir" (nodes 396:832 /
// 396:597), mismo trazo proporcionalmente escalado en ambos — un solo path.
const ROUTE_HORIZONTAL_PATH = "M0.96 16.32C45.12 1.92 81.12 22.56 128.16 10.56C169.92 0 206.4 15.36 264 3.84";

// Papel continuo hacia Blog — ola suave en la base de Promociones que se
// mete en el color real de la siguiente sección (blanco en base/md, cielo
// en xl), para que el cambio de fondo se sienta como marea, no un corte de
// regla. Mismo criterio que las olas del Hero (WAVE_BLUE_PATH/WAVE_SAND_PATH).
const WAVE_TO_BLOG_PATH = "M0 60C180 20 340 92 500 55C660 18 820 88 980 50C1140 12 1300 72 1440 38V120H0V60Z";

// Ilustración "escaparate" — silueta orgánica con degradado cielo→atardecer y
// trazo de ruta interior. 2 variantes reales exportadas de Figma, no la misma
// forma reescalada: compacta (Mobile/Tablet, ~1.52:1) y panorámica (Desktop/
// Wide, 1.7:1, nodes 396:370 / 409:45).
const BLOB_COMPACT_PATH =
  "M11.2499 40.5C36.8999 8.10002 95.8499 10.35 142.65 17.55C198.45 26.1 261.45 3.60002 307.8 34.65C339.75 56.25 323.1 109.35 320.4 148.95C317.7 189 279.45 207.45 231.75 202.95C179.55 198 145.35 214.65 92.2499 204.75C40.9499 195.3 7.1999 174.15 5.3999 131.85C3.5999 95.85 -11.2501 68.85 11.2499 40.5Z";
const BLOB_COMPACT_ROUTE = "M25.2 165.6C73.35 123.3 108.45 152.55 152.1 107.55C189.45 69.3 226.35 102.6 302.85 40.95";
const BLOB_COMPACT_DOT = { cx: 303.3, cy: 40.95, r: 5.4 };

const BLOB_WIDE_PATH =
  "M29.1096 93.75C95.4794 18.75 248.014 23.9583 369.11 40.625C513.493 60.4167 676.507 8.33333 796.438 80.2083C879.11 130.208 836.027 253.125 829.041 344.792C822.055 437.5 723.082 480.208 599.657 469.792C464.589 458.333 376.096 496.875 238.699 473.958C105.959 452.083 18.6301 403.125 13.9726 305.208C9.31507 221.875 -29.1096 159.375 29.1096 93.75Z";
const BLOB_WIDE_ROUTE = "M65.2055 383.333C189.795 285.417 280.616 353.125 393.562 248.958C490.206 160.417 585.685 237.5 783.63 94.7917";
const BLOB_WIDE_DOT = { cx: 784.795, cy: 94.7917, r: 13.5 };

function PromoBlob({ variant, className }: { variant: "compact" | "wide"; className?: string }) {
  const isWide = variant === "wide";
  const rawId = useId();
  const gradientId = `promo-blob-${variant}-${rawId.replace(/:/g, "")}`;
  return (
    <svg
      viewBox={isWide ? "0 0 850 500" : "0 0 328.5 216"}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="8%" y1="7%" x2="83%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9FD5E8" />
          <stop offset="0.52" stopColor="#E7D7B7" />
          <stop offset="1" stopColor="#FFB76A" />
        </linearGradient>
      </defs>
      <path d={isWide ? BLOB_WIDE_PATH : BLOB_COMPACT_PATH} fill={`url(#${gradientId})`} />
      <path
        d={isWide ? BLOB_WIDE_ROUTE : BLOB_COMPACT_ROUTE}
        opacity={0.75}
        className="stroke-surface-ivory"
        strokeWidth={isWide ? 4 : 1.8}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle {...(isWide ? BLOB_WIDE_DOT : BLOB_COMPACT_DOT)} className="fill-brand-accent" />
    </svg>
  );
}

function toMeta(promo: PromotionDTO, short = false) {
  return short
    ? `${promo.destination} · ${promo.durationDays} días`
    : `${promo.destination} · ${promo.durationDays} días / ${promo.durationNights} noches`;
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
  const message =
    promo.whatsappMessageTemplate ||
    `Hola Viajes Carolina, me interesa la promoción "${promo.title}". ¿Tienen fechas disponibles?`;
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-[28px] xl:rounded-[22px] bg-white/70 p-6 shadow-[0_18px_40px_-8px_rgba(20,41,59,0.18)] backdrop-blur-md ${className}`}
    >
      <span className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
        {toMeta(promo)}
      </span>
      <h3 className="font-display text-[28px] font-semibold leading-[32px] text-brand-navy">{promo.title}</h3>
      <p className="font-inter text-[13px] leading-[19px] text-brand-navy">{promo.summary}</p>
      <p className="font-inter text-[17px] font-semibold text-brand-navy">
        Desde US$ {Number(promo.priceUsd).toLocaleString()}
      </p>
      <WhatsAppButton size="md" phone={whatsappPhone} message={message} className="mt-1 w-fit">
        Conversemos por WhatsApp
      </WhatsAppButton>
    </div>
  );
}

function SecondaryPromoCard({
  promo,
  discoverUrl,
  className = "",
}: {
  promo: PromotionDTO;
  discoverUrl: string;
  className?: string;
}) {
  const isExternal = discoverUrl.startsWith("http");
  return (
    <a
      href={discoverUrl}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group block rounded-xl border border-dashed border-brand-navy/20 bg-neutral-white/90 px-5 py-[22px] transition-colors hover:border-brand-accent/50 ${className}`}
    >
      <span className="font-sora text-[9px] font-semibold uppercase tracking-wider text-brand-accent">
        {toMeta(promo, true)}
      </span>
      <h4 className="font-display mt-1.5 text-[21px] font-semibold leading-[25px] text-brand-navy">
        {promo.title}
      </h4>
      <p className="font-inter mt-1.5 text-xs leading-[18px] text-brand-navy">{promo.summary}</p>
      <p className="font-inter mt-2 text-[13px] font-semibold text-brand-navy">
        Desde US$ {Number(promo.priceUsd).toLocaleString()}
        <span className="mx-1.5 text-brand-navy/40">·</span>
        <span className="text-brand-navy group-hover:text-brand-accent">Conocer →</span>
      </p>
    </a>
  );
}

export function PromotionsSection({ promotions, settings, className = "" }: PromotionsSectionProps) {
  if (!promotions || promotions.length === 0) {
    return null;
  }

  const ordered = [...promotions].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  const [featuredPromo, ...rest] = ordered;
  const secondaryPromos = rest.slice(0, 2);
  // Las promociones no tienen página de detalle propia — el catálogo completo
  // vive en Facebook. Si aún no hay facebookUrl configurado, cae al ancla de
  // esta misma sección en vez de un enlace roto.
  const discoverUrl = settings?.facebookUrl || "/#promociones";
  const discoverIsExternal = discoverUrl.startsWith("http");

  return (
    <section
      id="promociones"
      className={`relative w-full overflow-hidden bg-atmosphere-sand py-16 sm:py-20 xl:py-28 text-neutral-ink ${className}`}
    >
      {/* Papel continuo hacia Blog — ola full-bleed en la base, con el color
          real de la siguiente sección (blanco en base/md, cielo en xl). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 xl:h-24">
        <svg viewBox="0 0 1440 120" className="h-full w-full" preserveAspectRatio="none">
          <path d={WAVE_TO_BLOG_PATH} className="fill-white xl:fill-atmosphere-sky" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] xl:px-16">
        {/* Encabezado — solo base/md; en xl vive dentro del lienzo relativo
            de abajo, en su posición real de Figma (junto al blob, no
            apilado arriba de todo el bloque). */}
        <Reveal className="relative mb-10 flex flex-col gap-6 xl:hidden">
          <div className="max-w-xl">
            <svg
              aria-hidden="true"
              viewBox="0 0 268.8 23.04"
              className="mb-4 h-4 w-[180px]"
              fill="none"
            >
              <path d={ROUTE_HORIZONTAL_PATH} className="stroke-brand-navy" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <circle cx="264.5" cy="3.84" r="4" className="fill-brand-accent" />
            </svg>
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              02 · Viajes para empezar a imaginar
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl">
              Algunas formas de vivir tu próximo viaje
            </h2>
            <p className="font-inter mt-3 text-base leading-relaxed text-brand-navy sm:text-lg">
              Experiencias que podemos ajustar a tus tiempos, compañía y presupuesto.
            </p>
          </div>

          <a
            href={discoverUrl}
            {...(discoverIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-inter self-start text-sm font-semibold text-brand-navy hover:text-brand-accent transition-colors"
          >
            Ver todas las promociones →
          </a>
        </Reveal>

        {/* Mobile — flujo simple, sin superposición */}
        <div className="md:hidden">
          <div className="relative mx-auto max-w-[420px]">
            <PromoBlob variant="compact" className="mx-auto w-full aspect-[328.5/216]" />
            <Reveal delayMs={80} className="-mt-4 relative">
              <FeaturedPromoCard promo={featuredPromo} whatsappPhone={settings?.whatsappPhone} />
            </Reveal>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            {secondaryPromos.map((p, i) => (
              <Reveal key={p.id || p.slug} delayMs={160 + i * 80}>
                <SecondaryPromoCard promo={p} discoverUrl={discoverUrl} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Tablet — protagonista a ancho completo con foto orgánica; tarjeta
            flotante superpuesta sobre el blob; secundarios en pareja debajo */}
        <div className="hidden md:block xl:hidden">
          <div className="relative">
            <PromoBlob variant="compact" className="w-[64%] aspect-[620.5/408]" />
            <Reveal delayMs={80} className="absolute right-0 top-[34%] w-[46%]">
              <FeaturedPromoCard promo={featuredPromo} whatsappPhone={settings?.whatsappPhone} />
            </Reveal>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6">
            {secondaryPromos.map((p, i) => (
              <Reveal key={p.id || p.slug} delayMs={160 + i * 80}>
                <SecondaryPromoCard promo={p} discoverUrl={discoverUrl} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Desktop / Wide — lienzo relativo único basado en Figma (node
            409:36 "02 · Promociones · Escaparate panorámico · Wide", canvas
            1920x940): ruta, encabezado, "ver todas", blob y tarjetas, todos
            posicionados contra ese mismo lienzo — no bloques apilados por
            separado. Orden en el DOM = orden de apilado visual (el blob va
            primero para que el encabezado y la tarjeta destacada floten
            sobre su esquina, tal como en Figma).

            El encabezado ancla en `left-0` — ese punto coincide con donde
            arranca el contenido de Blog/Testimonios/FAQ en este mismo
            contenedor (verificado con getBoundingClientRect: ambos caen en
            x=296.5px a 1920 de viewport), así las secciones quedan
            alineadas al mismo margen izquierdo. El resto de los elementos
            usa offsets en px calculados desde ese punto (diferencia real
            entre cada elemento y el encabezado en las coordenadas de
            Figma) en vez de un % del canvas de 1920 — con % puro, el
            propio margen de página de Figma (274px antes de la ruta) se
            sumaba AL padding real de este contenedor (`xl:px-16`),
            duplicando el margen y corriendo todo el bloque hacia la
            derecha. El ancho de las tarjetas (destacada 380px, secundarias
            260px c/u) tampoco es literal de Figma (410px/290px) — a esa
            medida el texto real (más largo que el mock de Figma) envolvía
            mal o las tarjetas casi se tocaban; se ajustó a ojo verificando
            en pantalla, no es un valor que debas "corregir" de vuelta al
            literal de Figma. */}
        <div className="relative hidden xl:block xl:min-h-[760px]">
          {/* Ruta vertical — decorativa */}
          <div aria-hidden="true" className="pointer-events-none absolute left-[-126px] top-[9.15%] w-[7.81%] h-[80.85%]">
            <svg viewBox="0 0 150 760" className="h-full w-full" fill="none" preserveAspectRatio="none">
              <path d={ROUTE_VERTICAL_PATH} className="stroke-brand-navy" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            {/* Puntos como <span> aparte — dentro del SVG con preserveAspectRatio="none"
                se ven ovalados, no circulares. */}
            <span
              className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent"
              style={{ left: `${(92 / 150) * 100}%`, top: "0%" }}
            />
            <span
              className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent"
              style={{ left: `${(82 / 150) * 100}%`, top: "100%" }}
            />
          </div>

          <PromoBlob variant="wide" className="absolute left-[300px] top-[15.96%] w-[1050px] aspect-[850/500]" />

          <Reveal className="absolute left-0 top-[10.85%] max-w-xl">
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              02 · Viajes para empezar a imaginar
            </span>
            <h2 className="font-display mt-3 text-[44px] font-semibold leading-[49px] text-brand-navy">
              Algunas formas de vivir tu próximo viaje
            </h2>
            <p className="font-inter mt-3 text-base leading-relaxed text-brand-navy">
              Experiencias que podemos ajustar a tus tiempos, compañía y presupuesto.
            </p>
          </Reveal>

          <a
            href={discoverUrl}
            {...(discoverIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="absolute right-0 top-[13.19%] font-inter text-sm font-semibold text-brand-navy hover:text-brand-accent transition-colors"
          >
            Ver todas las promociones →
          </a>

          <Reveal delayMs={80} className="absolute left-[-35px] top-[46.81%] w-[420px]">
            <FeaturedPromoCard promo={featuredPromo} whatsappPhone={settings?.whatsappPhone} />
          </Reveal>

          {secondaryPromos[0] && (
            <Reveal delayMs={160} className="absolute left-[712px] top-[67.02%] w-[280px]">
              <SecondaryPromoCard promo={secondaryPromos[0]} discoverUrl={discoverUrl} />
            </Reveal>
          )}
          {secondaryPromos[1] && (
            <Reveal delayMs={240} className="absolute left-[1032px] top-[67.02%] w-[280px]">
              <SecondaryPromoCard promo={secondaryPromos[1]} discoverUrl={discoverUrl} />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
