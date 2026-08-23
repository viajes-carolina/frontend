"use client";

import React from "react";
import type { BlogPostDTO, HomeBlogInspirationDTO } from "@vc/api-client";
import { Reveal } from "../primitives/Reveal";

export interface BlogInspirationSectionProps {
  config?: HomeBlogInspirationDTO;
  posts: BlogPostDTO[];
}

// Ruta diagonal (Desktop/Wide) — Figma "Ruta continua · Blog · Diagonal"
// (nodes 403:37 / 415:37, idéntica entre ambos tramos). viewBox 1240x620.
const ROUTE_DIAGONAL_PATH = "M0 46C290 190 510 12 770 154C1010 286 1028 464 1240 574";

// Ruta horizontal (Mobile/Tablet) — "Ruta · 03 Prepararte" (nodes 396:869 /
// 396:634), mismo trazo proporcionalmente escalado en ambos.
const ROUTE_HORIZONTAL_PATH = "M0.96 15.36C48.48 3.36 80.16 21.6 127.68 10.56C178.08 -1.44 204.48 12.48 264 3.84";

// Papel continuo hacia Pausa Conversacional — ola en la base con el color
// real de la siguiente sección (arena en los 4 breakpoints, la nueva
// sección "04 · Pausa conversacional" no cambia de color por breakpoint
// como sí hacían Experiencias/FAQ). Mismo criterio que la ola Promociones→Blog.
const WAVE_TO_PAUSA_PATH = "M0 58C170 16 330 88 495 52C665 14 830 84 995 48C1160 12 1305 68 1440 34V120H0V58Z";

// "Atmósfera editorial" — mancha suave sin trazo interior (a diferencia del
// blob de Promociones). 2 variantes reales: compacta (Mobile/Tablet) y
// panorámica (Desktop/Wide, nodes 396:397 / 415:41).
const ATMOSPHERE_COMPACT_PATH =
  "M62.9999 17.5C122 -8.49996 201.5 10 256 56.5C310.5 102.5 323 184 286 247.5C248.5 311.5 169.5 337 98.9999 314.5C32.4999 293.5 -8.50006 225.5 1.49994 159C9.49994 103 10.4999 40.5 62.9999 17.5Z";
const ATMOSPHERE_WIDE_PATH =
  "M115.839 33.3846C224.323 -16.2154 370.5 19.0769 470.71 107.785C570.919 195.538 593.903 351.015 525.871 472.154C456.919 594.246 311.661 642.892 182.032 599.969C59.7581 559.908 -15.629 430.185 2.75806 303.323C17.4677 196.492 19.3065 77.2615 115.839 33.3846Z";

function BlogAtmosphere({ variant, className }: { variant: "compact" | "wide"; className?: string }) {
  const isWide = variant === "wide";
  return (
    <svg
      viewBox={isWide ? "0 0 570 620" : "0 0 310 325"}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path d={isWide ? ATMOSPHERE_WIDE_PATH : ATMOSPHERE_COMPACT_PATH} fill="#DDECF1" />
    </svg>
  );
}

function toMeta(post: BlogPostDTO) {
  return `${post.categoryName || "Guía"} · ${post.readingTimeMinutes || 5} min`;
}

function SecondaryArticle({ post, className = "" }: { post: BlogPostDTO; className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-2.5 ${className}`}>
      <div>
        <span className="font-sora text-[9px] font-semibold uppercase tracking-wider text-brand-accent">
          {toMeta(post)}
        </span>
        <h4 className="font-display mt-1.5 text-lg font-semibold leading-snug text-brand-navy xl:text-[19px]">
          {post.title}
        </h4>
      </div>
      <a
        href={`/blog/${post.slug}`}
        className="inline-flex w-fit items-center justify-center rounded-full bg-brand-navy px-6 py-3 font-inter text-sm font-semibold text-neutral-white transition-colors hover:bg-brand-navy/90"
      >
        Leer artículo
      </a>
    </div>
  );
}

function FeaturedArticleCard({ post, paper = false }: { post: BlogPostDTO; paper?: boolean }) {
  const content = (
    <div
      className={`flex flex-col items-start gap-3.5 rounded-lg bg-neutral-white/95 p-6 xl:gap-3.5 xl:p-[34px] ${
        paper ? "" : "shadow-[0_12px_28px_-6px_rgba(20,41,59,0.14)]"
      }`}
    >
      <span className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
        {toMeta(post)}
      </span>
      <h3 className="font-display text-[28px] font-semibold leading-[1.05] text-brand-navy xl:text-4xl">
        {post.title}
      </h3>
      <p className="font-inter text-sm leading-relaxed text-brand-navy xl:text-base">{post.summary}</p>
      <a
        href={`/blog/${post.slug}`}
        className="inline-flex w-fit items-center justify-center rounded-full bg-brand-accent px-6 py-3 font-inter text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-sunset"
      >
        Leer la guía completa
      </a>
    </div>
  );

  if (!paper) {
    return content;
  }

  // Desktop/Wide — "hoja editorial": una hoja de papel (sombra propia) y el
  // contenido encima, cada uno con su propia rotación sutil, tal como en
  // Figma (no es la misma capa rotada dos veces).
  return (
    <div className="relative">
      <div className="absolute inset-0 rotate-[1.2deg] rounded-lg bg-neutral-white/95 shadow-[0_18px_38px_-4px_rgba(20,41,59,0.12)]" aria-hidden="true" />
      <div className="absolute -top-2 left-1/2 h-4 w-[92px] -translate-x-1/2 -rotate-[1.5deg] bg-[#F2E2C3]/55" aria-hidden="true" />
      <div className="relative rotate-[1.5deg]">{content}</div>
    </div>
  );
}

export const BlogInspirationSection: React.FC<BlogInspirationSectionProps> = ({
  config = {
    badgeText: "03 · Leer también es viajar",
    titleHighlight: "Ideas para preparar el viaje",
    titleAccent: "con más calma",
    subtitle: "Guías nacidas de dudas reales que suelen aparecer antes de viajar.",
    ctaText: "Ver todos los artículos",
    ctaUrl: "/blog",
    postsLimit: 3,
    active: true,
  },
  posts = [],
}) => {
  if (config.active === false || posts.length === 0) {
    return null;
  }

  const [featuredPost, ...rest] = posts;
  const secondaryPosts = rest.slice(0, 2);

  return (
    <section
      id="inspiracion"
      className="relative w-full overflow-hidden bg-white xl:bg-atmosphere-sky text-neutral-ink py-16 sm:py-20 xl:py-28"
    >
      {/* Papel continuo hacia Pausa Conversacional — ola full-bleed en la base. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 xl:h-24">
        <svg viewBox="0 0 1440 120" className="h-full w-full" preserveAspectRatio="none">
          <path d={WAVE_TO_PAUSA_PATH} className="fill-atmosphere-sand" />
        </svg>
      </div>

      {/* Ruta diagonal — solo xl */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] top-[18%] hidden h-[65%] xl:block"
      >
        <svg viewBox="0 0 1240 620" className="h-full w-full" fill="none" preserveAspectRatio="none">
          <path d={ROUTE_DIAGONAL_PATH} opacity="0.34" className="stroke-brand-navy" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Puntos como <span> aparte — dentro del SVG con preserveAspectRatio="none"
            se ven ovalados, no circulares (mismo criterio que la ruta de FAQ). */}
        <span
          className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent opacity-[0.34]"
          style={{ left: "0%", top: `${(46 / 620) * 100}%` }}
        />
        <span
          className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent opacity-[0.34]"
          style={{ left: "100%", top: `${(574 / 620) * 100}%` }}
        />
      </div>

      {/* Atmósfera editorial — panorámica a la derecha en xl, mancha localizada abajo en base/md */}
      <BlogAtmosphere
        variant="wide"
        className="pointer-events-none absolute right-[4%] top-[10%] hidden w-[34%] opacity-[0.28] xl:block"
      />
      <BlogAtmosphere
        variant="compact"
        className="pointer-events-none absolute bottom-0 right-[6%] w-[79%] max-w-[310px] opacity-[0.18] md:bottom-auto md:right-0 md:top-[25%] md:w-[44%] md:max-w-none md:opacity-[0.24] xl:hidden"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] xl:px-16">
        {/* Encabezado */}
        <Reveal className="relative mb-10 flex flex-col gap-6 xl:mb-16 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-xl">
            <svg
              aria-hidden="true"
              viewBox="0 0 268.8 23.04"
              className="mb-4 h-4 w-[180px] xl:hidden"
              fill="none"
            >
              <path d={ROUTE_HORIZONTAL_PATH} className="stroke-brand-navy" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <circle cx="264.5" cy="3.84" r="4" className="fill-brand-accent" />
            </svg>
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl xl:text-[52px] xl:leading-[0.98]">
              {config.titleHighlight}
              <br />
              {config.titleAccent}
            </h2>
            <p className="font-inter mt-3 text-base leading-relaxed text-brand-navy sm:text-lg">{config.subtitle}</p>
          </div>

          <a
            href={config.ctaUrl || "/blog"}
            className="inline-flex w-fit shrink-0 items-center justify-center self-start rounded-full bg-brand-navy px-6 py-3 font-inter text-sm font-semibold text-neutral-white transition-colors hover:bg-brand-navy/90"
          >
            {config.ctaText || "Ver todos los artículos"}
          </a>
        </Reveal>

        {/* Mobile — destacado a ancho completo, secundarios en flujo vertical */}
        <div className="md:hidden">
          <Reveal delayMs={80}>
            <FeaturedArticleCard post={featuredPost} />
          </Reveal>
          <div className="mt-10 flex flex-col gap-14">
            {secondaryPosts.map((p, i) => (
              <Reveal key={p.id} delayMs={160 + i * 80}>
                <SecondaryArticle post={p} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Tablet — destacado a la izquierda, secundarios apilados a la derecha */}
        <div className="hidden md:flex md:flex-row md:items-start md:gap-10 xl:hidden">
          <Reveal delayMs={80} className="md:w-[62%]">
            <FeaturedArticleCard post={featuredPost} />
          </Reveal>
          <div className="flex md:w-[32%] flex-col gap-16">
            {secondaryPosts.map((p, i) => (
              <Reveal key={p.id} delayMs={160 + i * 80}>
                <SecondaryArticle post={p} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Desktop/Wide — hoja editorial a la izquierda, secundarios en columna a la derecha */}
        <div className="relative hidden xl:block xl:min-h-[500px]">
          <Reveal delayMs={80} className="xl:w-[48%]">
            <FeaturedArticleCard post={featuredPost} paper />
          </Reveal>
          <div className="absolute right-0 top-0 flex w-[36%] flex-col gap-[105px]">
            {secondaryPosts.map((p, i) => (
              <Reveal key={p.id} delayMs={160 + i * 80}>
                <SecondaryArticle post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
