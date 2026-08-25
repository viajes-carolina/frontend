"use client";

import React, { useId } from "react";
import { TestimonialDTO, HomeTestimonialsSectionDTO } from "@vc/api-client";
import { PolaroidPhoto } from "../primitives/PolaroidPhoto";
import { Reveal } from "../primitives/Reveal";
import type { FocalPoint } from "../primitives/ResponsiveImage";

export interface TestimonialsSectionProps {
  testimonials: TestimonialDTO[];
  config?: HomeTestimonialsSectionDTO;
  className?: string;
}

const DEFAULT_CONFIG: HomeTestimonialsSectionDTO = {
  badgeText: "05 · Historias reales",
  title: "Viajes que hoy se recuerdan así",
  subtitle: "Cada fotografía guarda una experiencia que comenzó con una conversación.",
};

// Papel continuo hacia FAQ — ola en la base con el color real de la
// siguiente sección (blanco en base/md, cloud en xl).
const WAVE_TO_FAQ_PATH = "M0 62C165 20 325 90 490 54C660 16 825 86 990 50C1155 14 1300 70 1440 36V120H0V62Z";

// Ruta "derecha a izquierda" (Desktop/Wide) — Figma nodes 408:36 / 409:879,
// idéntica entre ambos tramos. viewBox 1260x590.
const ROUTE_WIDE_PATH =
  "M1240 16C1010 104 1034 228 798 260C566 292 546 102 298 176C78 242 84 478 280 548C190 570 100 576 18 574";

// Ruta horizontal (Mobile/Tablet) — "Ruta · 04 Recordar" (nodes 396:898 /
// 396:663), propia de esta sección (no la misma curva que Promociones/Blog).
const ROUTE_COMPACT_PATH = "M0.96 16.32C48.96 1.44 87.84 21.12 133.44 9.6C178.08 -1.92 212.64 12.96 264 3.84";

// "Foto real" — silueta orgánica. `PhotoBlob` recorta `config.blobMediaUrl`
// (foto propia de esta sección, configurable por el admin) contra este mismo
// path vía `<clipPath>`; sin foto cargada aún cae a esta ilustración degradada. 2
// variantes reales: compacta (Mobile/Tablet) y panorámica (Desktop/Wide,
// nodes 396:435 / 409:890). Los paths tienen puntos de control fuera de su
// propio viewBox (p.ej. x negativo) — el `<svg>` raíz necesita
// `overflow: visible` explícito o el navegador recorta esa punta (default
// UA es `overflow: hidden` en <svg>), cortando el borde izquierdo del blob.
const PHOTO_BLOB_COMPACT_PATH =
  "M15.95 43.45C48.4 5.49999 106.7 18.15 157.85 12.1C218.35 4.94999 288.75 -8.80001 326.7 42.9C360.25 89.1 333.3 154.55 287.1 183.15C238.15 213.4 187 191.4 136.4 195.8C80.3 200.2 26.4 188.65 8.25 143C-7.15 105.05 -9.9 73.7 15.95 43.45Z";
const PHOTO_BLOB_COMPACT_ROUTE = "M52.25 155.65C100.65 119.35 135.85 141.9 179.85 106.15C226.05 68.2 262.9 102.3 302.5 56.65";

const PHOTO_BLOB_WIDE_PATH =
  "M26.1935 76.8649C79.4839 9.72973 175.226 32.1081 259.226 21.4054C358.581 8.75676 474.194 -15.5676 536.516 75.8919C591.613 157.622 547.355 273.405 471.484 324C391.097 377.513 307.097 338.595 224 346.378C131.871 354.162 43.3548 333.73 13.5484 252.973C-11.7419 185.838 -16.2581 130.378 26.1935 76.8649Z";
const PHOTO_BLOB_WIDE_ROUTE =
  "M85.8064 275.351C165.29 211.135 223.097 251.027 295.355 187.784C371.226 120.649 431.742 180.973 496.774 100.216";

function PhotoBlob({
  variant,
  className,
  imageUrl,
}: {
  variant: "compact" | "wide";
  className?: string;
  imageUrl?: string;
}) {
  const isWide = variant === "wide";
  const rawId = useId();
  const gradientId = `exp-blob-${variant}-${rawId.replace(/:/g, "")}`;
  const clipId = `exp-blob-clip-${variant}-${rawId.replace(/:/g, "")}`;
  const [vbWidth, vbHeight] = isWide ? [560, 360] : [341, 203.5];
  const blobPath = isWide ? PHOTO_BLOB_WIDE_PATH : PHOTO_BLOB_COMPACT_PATH;
  // Igual que en PromoBlob (PromotionsSection.tsx): `<image>` solo pinta
  // dentro de su propia caja x/y/width/height, que debe cubrir la extensión
  // real del path orgánico (con margen), no el viewBox nominal.
  // `preserveAspectRatio="none"` en vez de "slice" — "slice" no calcula el
  // cover-fit correctamente contra una caja con coordenadas negativas (ver
  // comentario largo en PromoBlob); "none" estira la imagen para llenar la
  // caja exacta sin ese bug, con una distorsión leve aceptable.
  const imgBox = isWide ? { x: -30, y: -30, w: 620, h: 420 } : { x: -20, y: -20, w: 390, h: 250 };
  return (
    <svg
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="5%" y1="5%" x2="95%" y2="90%" gradientUnits="userSpaceOnUse">
          <stop stopColor="#82C5D8" />
          <stop offset="0.52" stopColor="#F1C995" />
          <stop offset="1" stopColor="#F38E65" />
        </linearGradient>
        {imageUrl && (
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={blobPath} />
          </clipPath>
        )}
      </defs>
      {imageUrl ? (
        <image
          href={imageUrl}
          x={imgBox.x}
          y={imgBox.y}
          width={imgBox.w}
          height={imgBox.h}
          preserveAspectRatio="none"
          clipPath={`url(#${clipId})`}
        />
      ) : (
        <path d={blobPath} fill={`url(#${gradientId})`} />
      )}
      <path
        d={isWide ? PHOTO_BLOB_WIDE_ROUTE : PHOTO_BLOB_COMPACT_ROUTE}
        opacity={0.78}
        className="stroke-surface-ivory"
        strokeWidth={isWide ? 4 : 2.2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function FeaturedTestimonialCard({
  testimonial,
  dark = true,
  className = "",
}: {
  testimonial: TestimonialDTO;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-[30px] px-6 py-6 xl:rounded-xl xl:px-8 xl:py-7 ${
        dark ? "bg-brand-navy" : "bg-atmosphere-sand"
      } ${className}`}
    >
      <span className="font-display text-[46px] font-semibold leading-[0.8] text-brand-accent xl:text-[58px]">“</span>
      <p
        className={`font-display text-xl italic leading-snug xl:text-2xl ${
          dark ? "text-neutral-white" : "text-brand-navy"
        }`}
      >
        {testimonial.comment}
      </p>
      <p className={`font-inter text-sm font-semibold ${dark ? "text-neutral-white" : "text-brand-navy"}`}>
        {testimonial.clientName}
        {testimonial.tripDestination ? `  ·  ${testimonial.tripDestination}` : ""}
      </p>
    </div>
  );
}

function SupportVoice({ testimonial, light = false }: { testimonial: TestimonialDTO; light?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <p
        className={`font-display text-base italic leading-snug xl:text-lg ${
          light ? "text-neutral-white/80" : "text-brand-navy"
        }`}
      >
        “{testimonial.comment}”
      </p>
      <p className={`font-inter text-xs font-semibold ${light ? "text-neutral-white/80" : "text-brand-navy"}`}>
        {testimonial.clientName}
        {testimonial.tripDestination ? ` · ${testimonial.tripDestination}` : ""}
      </p>
    </div>
  );
}

export function TestimonialsSection({ testimonials, config = DEFAULT_CONFIG, className = "" }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const [featured, ...rest] = testimonials;
  const [voice1, voice2] = rest.slice(0, 2);
  const polaroidFocalPoint: FocalPoint | undefined = config.polaroidFocalX
    ? { x: config.polaroidFocalX, y: config.polaroidFocalY ?? 50 }
    : undefined;

  return (
    <section
      id="testimonios"
      className={`relative w-full overflow-hidden bg-white xl:bg-brand-navy py-16 sm:py-20 xl:py-28 text-neutral-ink ${className}`}
    >
      {/* Papel continuo hacia FAQ — ola full-bleed en la base. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 xl:h-24">
        <svg viewBox="0 0 1440 120" className="h-full w-full" preserveAspectRatio="none">
          <path d={WAVE_TO_FAQ_PATH} className="fill-surface-ivory" />
        </svg>
      </div>

      {/* Ruta — horizontal en base/md, panorámica en xl */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[6%] top-[10%] hidden h-[70%] xl:block">
        <svg viewBox="0 0 1260 590" className="h-full w-full" fill="none" preserveAspectRatio="none">
          <path d={ROUTE_WIDE_PATH} className="stroke-atmosphere-sea" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Puntos como <span> aparte — dentro del SVG con preserveAspectRatio="none"
            se ven ovalados, no circulares. */}
        <span
          className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent"
          style={{ left: `${(1240 / 1260) * 100}%`, top: `${(16 / 590) * 100}%` }}
        />
        <span
          className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent"
          style={{ left: `${(18 / 1260) * 100}%`, top: `${(574 / 590) * 100}%` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] xl:px-16">
        {/* Encabezado */}
        <Reveal className="mb-10 xl:mb-16 xl:flex xl:justify-end">
          <div className="max-w-xl xl:text-right">
            <svg aria-hidden="true" viewBox="0 0 268.8 23.04" className="mb-4 h-4 w-[180px] xl:hidden" fill="none">
              <path d={ROUTE_COMPACT_PATH} className="stroke-brand-navy" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <circle cx="264.5" cy="3.84" r="4" className="fill-brand-accent" />
            </svg>
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl xl:text-[44px] xl:leading-[49px] xl:text-neutral-white">
              {config.title}
            </h2>
            <p className="font-inter mt-3 text-base leading-relaxed text-brand-navy sm:text-lg xl:text-neutral-white/70">
              {config.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Mobile — flujo secuencial */}
        <div className="md:hidden">
          <div className="relative">
            <PhotoBlob
              variant="compact"
              className="w-full aspect-[341/203.5]"
              imageUrl={config.blobMediaUrl}
            />
            <Reveal delayMs={80} className="absolute right-[4%] top-[8%] w-[36%] aspect-[137.5/99]">
              <PolaroidPhoto
                imageUrl={config.polaroidMediaUrl}
                alt="Recuerdo de un viaje con Viajes Carolina"
                focalPoint={polaroidFocalPoint}
                priority
                rotate={-4}
                tape="top"
                className="w-full h-full"
              />
            </Reveal>
          </div>
          {featured && (
            <Reveal delayMs={160} className="mt-8">
              <FeaturedTestimonialCard testimonial={featured} />
            </Reveal>
          )}
          <div className="mt-10 flex flex-col divide-y divide-neutral-border">
            {voice1 && (
              <Reveal delayMs={240} className="pb-6">
                <SupportVoice testimonial={voice1} />
              </Reveal>
            )}
            {voice2 && (
              <Reveal delayMs={320} className="pt-6">
                <SupportVoice testimonial={voice2} />
              </Reveal>
            )}
          </div>
        </div>

        {/* Tablet — cluster de foto+recuerdo con tarjeta superpuesta */}
        <div className="relative hidden md:block xl:hidden">
          <div className="relative xl:hidden">
            <PhotoBlob
              variant="compact"
              className="w-[62%] aspect-[514.6/307.1]"
              imageUrl={config.blobMediaUrl}
            />
            <Reveal delayMs={80} className="absolute left-[42%] top-[-8%] w-[24%] aspect-[205/147.6]">
              <PolaroidPhoto
                imageUrl={config.polaroidMediaUrl}
                alt="Recuerdo de un viaje con Viajes Carolina"
                focalPoint={polaroidFocalPoint}
                priority
                rotate={-4}
                tape="top"
                className="w-full h-full"
              />
            </Reveal>
            {featured && (
              <Reveal delayMs={160} className="absolute right-0 top-[14%] w-[46%]">
                <FeaturedTestimonialCard testimonial={featured} />
              </Reveal>
            )}
          </div>
          <div className="relative mt-14 flex gap-14">
            {voice1 && (
              <Reveal delayMs={240}>
                <SupportVoice testimonial={voice1} />
              </Reveal>
            )}
            {voice2 && (
              <Reveal delayMs={320} className="border-l border-neutral-border pl-14">
                <SupportVoice testimonial={voice2} />
              </Reveal>
            )}
          </div>
        </div>

        {/* Desktop / Wide — álbum colectivo sobre fondo navy */}
        <div className="relative hidden xl:block xl:min-h-[520px]">
          <PhotoBlob
            variant="wide"
            className="absolute left-0 top-0 w-[39%] aspect-[560/360]"
            imageUrl={config.blobMediaUrl}
          />
          <Reveal delayMs={80} className="absolute left-[28%] top-[-6%] w-[20%] aspect-[270/190]">
            <PolaroidPhoto
              imageUrl={config.polaroidMediaUrl}
              alt="Recuerdo de un viaje con Viajes Carolina"
              focalPoint={polaroidFocalPoint}
              priority
              rotate={-4}
              tape="top"
              className="w-full h-full"
            />
          </Reveal>
          {featured && (
            <Reveal delayMs={160} className="absolute left-[50%] top-[8%] w-[40%]">
              <FeaturedTestimonialCard testimonial={featured} dark={false} />
            </Reveal>
          )}
          <div className="absolute bottom-0 left-[15%] flex w-[74%] gap-16">
            {voice1 && (
              <Reveal delayMs={240}>
                <SupportVoice testimonial={voice1} light />
              </Reveal>
            )}
            {voice2 && (
              <Reveal delayMs={320} className="border-l border-atmosphere-sea/30 pl-16">
                <SupportVoice testimonial={voice2} light />
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
