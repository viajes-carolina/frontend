"use client";

import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface BlogFeaturedStoryCardProps {
  post: BlogPostDTO;
  readMoreLabel?: string;
}

// Círculo decorativo con degradado (mismos tonos que `PromoBlob` en
// PromotionsSection.tsx) — en Figma es un simple "Atmósfera · Cielo" detrás
// de la foto, no una silueta orgánica recortada. Solo 2 usos (hero e index),
// por eso vive local aquí en vez de convertirse en primitiva compartida.
function AtmosphereCircle({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full ${className ?? ""}`}
      style={{ background: "linear-gradient(135deg, #9FD5E8 0%, #E7D7B7 52%, #FFB76A 100%)" }}
    />
  );
}

// Línea decorativa curva detrás de la foto — redibujada a mano (viewBox propio,
// no las coordenadas absolutas de export) a partir de los nodos "Ruta del
// artículo"/"Vector" de los assets de Figma citados en el módulo de blog
// (media hero b6429ce2… e index 520fffe5…): una curva de 2 ondas, mismo
// espíritu que el trazo real de `ARRIVAL_ROUTE_PATH` en ArrivalSection.tsx.
// Vive detrás de la foto (mismo criterio de capas que `AtmosphereCircle`): se
// pinta antes en el DOM y solo asoma en la esquina no cubierta por la foto real.
const DECORATIVE_LINE_PATH = "M4 78C34 34 58 88 92 52C122 20 150 42 180 6";

function DecorativeLine({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 184 92"
      preserveAspectRatio="none"
      className={`absolute text-brand-navy/20 ${className ?? ""}`}
    >
      <path d={DECORATIVE_LINE_PATH} stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export const BlogFeaturedStoryCard: React.FC<BlogFeaturedStoryCardProps> = ({
  post,
  readMoreLabel = "Abrir la historia →",
}) => {
  // Esquinas asimétricas (arriba-izq. y abajo-der. muy redondeadas, las otras
  // dos casi rectas) — la forma real del nodo "Media hero · Reemplazable
  // desde Biblioteca" en Figma, no un rectángulo redondeado uniforme.
  const photoRadius =
    "rounded-tl-[32px] rounded-tr-[8px] rounded-br-[32px] rounded-bl-[8px] lg:rounded-tl-[64px] lg:rounded-br-[64px] xl:rounded-tl-[96px] xl:rounded-br-[96px]";

  return (
    <a href={`/blog/${post.slug}`} className="group block">
      <div className="relative">
        <AtmosphereCircle className="-top-6 -right-6 h-2/3 w-2/3 sm:-top-8 sm:-right-8" />
        <div className="absolute top-6 right-12 h-8 w-8 rounded-full bg-brand-accent sm:top-10 sm:right-16 sm:h-10 sm:w-10" />
        <DecorativeLine className="-bottom-3 -left-5 h-14 w-32 sm:-bottom-4 sm:-left-6 sm:h-16 sm:w-36" />
        <div className={`relative overflow-hidden ${photoRadius}`} style={{ aspectRatio: "28 / 25" }}>
          <ResponsiveImage
            src={post.coverMediaUrl || "/media/demo-hero-travel.webp"}
            alt={post.title}
            fill
            priority
            focalPoint={{ x: post.coverFocalX ?? 50, y: post.coverFocalY ?? 50 }}
            className={photoRadius}
          />
        </div>
      </div>

      <div
        className={`relative z-10 -mt-16 mr-6 ml-4 max-w-[86%] rounded-[20px] bg-white p-5 shadow-[0px_18px_32px_0px_rgba(20,41,59,0.18)] transition-transform group-hover:-translate-y-1 sm:-mt-20 sm:mr-10 sm:ml-6 sm:max-w-[75%] sm:p-6 sm:rotate-2`}
      >
        <p className="font-sora text-[11px] font-semibold uppercase tracking-wider text-brand-accent">
          {post.categoryName ? `${post.categoryName} · ` : ""}
          {post.readingTimeMinutes} min de lectura
        </p>
        <h3
          className="mt-2 font-display text-xl font-semibold text-brand-navy sm:text-2xl"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-brand-navy/80 line-clamp-2">{post.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy transition-colors group-hover:text-brand-accent">
          {readMoreLabel}
        </span>
      </div>
    </a>
  );
};
