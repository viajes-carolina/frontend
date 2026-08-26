"use client";

import React, { useId } from "react";
import { TestimonialDTO, HomeTestimonialsSectionDTO } from "@vc/api-client";
import { Reveal } from "../primitives/Reveal";

export interface TestimonialsSectionProps {
  testimonials: TestimonialDTO[];
  config?: HomeTestimonialsSectionDTO;
  className?: string;
}

const DEFAULT_CONFIG: HomeTestimonialsSectionDTO = {
  badgeText: "05 · Experiencias reales",
  title: "Lo que nuestros viajeros más valoran",
  subtitle: "Escucha, claridad y acompañamiento antes, durante y después del viaje.",
};

// Papel continuo hacia FAQ — ola en la base con el color real de la
// siguiente sección.
const WAVE_TO_FAQ_PATH = "M0 62C165 20 325 90 490 54C660 16 825 86 990 50C1155 14 1300 70 1440 36V120H0V62Z";

// "Foto real" — silueta orgánica. `PhotoBlob` recorta `config.blobMediaUrl`
// contra este mismo path vía `<clipPath>`; sin foto cargada cae a esta
// ilustración degradada. 2 variantes reales: compacta (mobile/tablet) y
// panorámica (desktop, nodes 396:905 / 396:435). Los paths tienen puntos de
// control fuera de su propio viewBox — el `<svg>` raíz necesita `overflow:
// visible` explícito o el navegador recorta esa punta.
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
  // `<image>` solo pinta dentro de su propia caja x/y/width/height, que debe
  // cubrir la extensión real del path orgánico (con margen), no el viewBox
  // nominal. `preserveAspectRatio="none"` porque "slice" no calcula el
  // cover-fit correctamente contra una caja con coordenadas negativas.
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

function FeaturedTestimonialCard({ testimonial, className = "" }: { testimonial: TestimonialDTO; className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-3 rounded-[24px] bg-atmosphere-sand px-6 py-6 sm:px-8 sm:py-7 ${className}`}>
      <span className="font-display text-[38px] font-semibold leading-none text-brand-accent sm:text-[46px]">“</span>
      <p className="font-display text-lg italic leading-snug text-brand-navy sm:text-2xl">{testimonial.comment}</p>
      <p className="font-inter text-xs font-semibold text-brand-navy sm:text-sm">
        {testimonial.clientName}
        {testimonial.tripDestination ? ` · ${testimonial.tripDestination}` : ""}
      </p>
    </div>
  );
}

function SupportVoice({ testimonial, className = "" }: { testimonial: TestimonialDTO; className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <p className="font-display text-sm italic leading-snug text-white/84 sm:text-base">“{testimonial.comment}”</p>
      <p className="font-inter text-[10px] font-semibold text-white/66 sm:text-xs">
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

  return (
    <section
      id="testimonios"
      className={`relative w-full overflow-hidden bg-brand-navy py-16 sm:py-20 xl:py-28 text-neutral-ink ${className}`}
    >
      {/* Papel continuo hacia FAQ — ola full-bleed en la base. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 xl:h-24">
        <svg viewBox="0 0 1440 120" className="h-full w-full" preserveAspectRatio="none">
          <path d={WAVE_TO_FAQ_PATH} className="fill-surface-ivory" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-[1180px] lg:px-8">
        {/* Dos columnas desde lg: izquierda = encabezado + foto (apiladas);
            derecha = testimonio + voces (apiladas), arrancando a la misma
            altura que el encabezado, no debajo de la foto — así el
            testimonio "flota" junto al título, como en el Figma. En mobile
            ambas columnas se apilan en una sola, en el orden correcto
            (encabezado, foto, testimonio, voces). */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex flex-col gap-8 lg:w-[35%] lg:shrink-0">
            <Reveal>
              <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
                {config.badgeText}
              </span>
              <h2 className="font-display mt-3 text-3xl font-semibold leading-[1.05] text-white sm:text-4xl lg:text-[38px] lg:leading-[1.1]">
                {config.title}
              </h2>
              <p className="font-inter mt-3 text-base leading-relaxed text-white/80 sm:text-lg">{config.subtitle}</p>
            </Reveal>

            <Reveal delayMs={80}>
              <PhotoBlob variant="compact" className="aspect-[341/203.5] w-full lg:hidden" imageUrl={config.blobMediaUrl} />
              <PhotoBlob variant="wide" className="hidden aspect-[560/360] w-full lg:block" imageUrl={config.blobMediaUrl} />
            </Reveal>
          </div>

          <div className="flex flex-1 flex-col gap-8 lg:gap-10">
            {featured && (
              <Reveal delayMs={160}>
                <FeaturedTestimonialCard testimonial={featured} />
              </Reveal>
            )}

            <div className="flex flex-col gap-6 divide-y divide-white/15 lg:flex-row lg:gap-10 lg:divide-x lg:divide-y-0">
              {voice1 && (
                <Reveal delayMs={240} className="lg:flex-1 lg:pr-10">
                  <SupportVoice testimonial={voice1} />
                </Reveal>
              )}
              {voice2 && (
                <Reveal delayMs={320} className="pt-6 lg:flex-1 lg:pl-10 lg:pt-0">
                  <SupportVoice testimonial={voice2} />
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
