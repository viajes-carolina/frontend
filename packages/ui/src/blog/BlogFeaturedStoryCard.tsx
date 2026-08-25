"use client";

import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface BlogFeaturedStoryCardProps {
  post: BlogPostDTO;
  /** "hero" = card del listado principal (rotación 2°), "index" = historia
   * principal de "Historias para el momento en que estás" (rotación -1.5°). */
  size?: "hero" | "index";
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

export const BlogFeaturedStoryCard: React.FC<BlogFeaturedStoryCardProps> = ({
  post,
  size = "hero",
  readMoreLabel = "Leer esta historia →",
}) => {
  const isHero = size === "hero";
  const rotationClass = isHero ? "sm:rotate-2" : "sm:rotate-[-1.5deg]";
  const aspectRatio = isHero ? "28 / 25" : "5 / 4";
  // Esquinas asimétricas (arriba-izq. y abajo-der. muy redondeadas, las otras
  // dos casi rectas) — la forma real del nodo "Media hero · Reemplazable
  // desde Biblioteca" en Figma, no un rectángulo redondeado uniforme.
  const photoRadius = isHero
    ? "rounded-tl-[32px] rounded-tr-[8px] rounded-br-[32px] rounded-bl-[8px] lg:rounded-tl-[64px] lg:rounded-br-[64px] xl:rounded-tl-[96px] xl:rounded-br-[96px]"
    : "rounded-tl-[28px] rounded-tr-[8px] rounded-br-[28px] rounded-bl-[8px] lg:rounded-tl-[48px] lg:rounded-br-[48px] xl:rounded-tl-[72px] xl:rounded-br-[72px]";

  return (
    <a href={`/blog/${post.slug}`} className="group block">
      <div className="relative">
        <AtmosphereCircle className="-top-6 -right-6 h-2/3 w-2/3 sm:-top-8 sm:-right-8" />
        <div className="absolute top-6 right-12 h-8 w-8 rounded-full bg-brand-accent sm:top-10 sm:right-16 sm:h-10 sm:w-10" />
        <div className={`relative overflow-hidden ${photoRadius}`} style={{ aspectRatio }}>
          <ResponsiveImage
            src={post.coverMediaUrl || "/media/demo-hero-travel.webp"}
            alt={post.title}
            fill
            priority={isHero}
            focalPoint={{ x: post.coverFocalX ?? 50, y: post.coverFocalY ?? 50 }}
            className={photoRadius}
          />
        </div>
      </div>

      <div
        className={`relative z-10 -mt-16 mr-6 ml-4 max-w-[86%] rounded-[20px] bg-white p-5 shadow-[0px_18px_32px_0px_rgba(20,41,59,0.18)] transition-transform group-hover:-translate-y-1 sm:-mt-20 sm:mr-10 sm:ml-6 sm:max-w-[75%] sm:p-6 ${rotationClass}`}
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
