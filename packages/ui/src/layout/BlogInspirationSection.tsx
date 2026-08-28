"use client";

import React from "react";
import type { BlogPostDTO, HomeBlogInspirationDTO } from "@vc/api-client";
import { Reveal } from "../primitives/Reveal";

export interface BlogInspirationSectionProps {
  config?: HomeBlogInspirationDTO;
  posts: BlogPostDTO[];
}

function toFeaturedMeta(post: BlogPostDTO) {
  return `${post.categoryName || "Guía"} · ${post.readingTimeMinutes || 5} min`;
}

function toSecondaryMeta(post: BlogPostDTO, index: number) {
  return `${String(index + 1).padStart(2, "0")} · ${post.categoryName || "Guía"} · ${post.readingTimeMinutes || 5} min`;
}

function FeaturedArticleCard({ post }: { post: BlogPostDTO }) {
  return (
    <div className="relative size-full shrink-0 rounded-[14px] border border-neutral-border bg-neutral-white p-6 sm:p-[38px]">
      <div
        aria-hidden="true"
        className="absolute -top-px right-8 h-12 w-3 rounded-b-[7px] bg-brand-accent sm:h-16"
      />
      <span className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
        {toFeaturedMeta(post)}
      </span>
      <h3
        className="font-display mt-3 text-[28px] font-semibold leading-[1] text-brand-navy sm:text-4xl"
        style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
      >
        {post.title}
      </h3>
      <p className="font-inter mt-3.5 text-sm leading-[1.5] text-brand-navy/75 sm:text-base">{post.summary}</p>
      <div className="mt-4 h-0.5 w-[72px] bg-brand-accent" aria-hidden="true" />
      <a
        href={`/blog/${post.slug}`}
        className="mt-3 inline-block font-sora text-sm font-semibold text-brand-navy underline decoration-1 underline-offset-2 transition-colors hover:text-brand-accent"
      >
        Descubrir la guía completa →
      </a>
    </div>
  );
}

function SecondaryArticle({ post, index }: { post: BlogPostDTO; index: number }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="font-sora text-[9px] font-semibold uppercase tracking-wider text-brand-accent">
        {toSecondaryMeta(post, index)}
      </span>
      <h4
        className="font-display text-xl font-semibold leading-[1.1] text-neutral-white sm:text-[22px]"
        style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
      >
        {post.title}
      </h4>
      {post.summary?.trim() && (
        <p className="font-inter text-[13px] leading-[1.45] text-white/70">{post.summary}</p>
      )}
      <a
        href={`/blog/${post.slug}`}
        className="mt-0.5 inline-block w-fit font-sora text-xs font-semibold text-brand-accent underline decoration-1 underline-offset-2 transition-colors hover:text-brand-sunset"
      >
        Leer en {post.readingTimeMinutes || 5} min →
      </a>
    </div>
  );
}

export const BlogInspirationSection: React.FC<BlogInspirationSectionProps> = ({
  config = {
    badgeText: "03 · Historias para guardar",
    titleHighlight: "Historias que te ayudan a viajar mejor",
    titleAccent: "",
    subtitle: "Guías breves, claras y nacidas de dudas reales para disfrutar cada etapa con más confianza.",
    ctaText: "Entrar al diario de viaje",
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
      className="relative w-full overflow-hidden text-neutral-ink py-16 sm:py-20 xl:py-28"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-[1180px] lg:px-8">
        {/* Cabecera revista */}
        <Reveal className="mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <span className="font-sora text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
            <h2
              className="font-display mt-3 text-3xl font-semibold leading-[0.98] text-brand-navy sm:text-4xl lg:text-[50px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {config.titleHighlight}
              {config.titleAccent?.trim() ? ` ${config.titleAccent}` : ""}
            </h2>
            <p className="font-inter mt-3 text-base leading-relaxed text-brand-navy/72 sm:text-lg">
              {config.subtitle}
            </p>
          </div>

          <a
            href={config.ctaUrl || "/blog"}
            className="inline-block w-fit shrink-0 font-sora text-[13px] font-semibold text-brand-navy underline decoration-1 underline-offset-2 transition-colors hover:text-brand-accent"
          >
            {config.ctaText || "Entrar al diario de viaje"} →
          </a>
        </Reveal>

        {/* Mesa de lectura */}
        <div className="flex flex-col gap-7 rounded-[24px] bg-brand-navy p-4 sm:gap-8 sm:p-7 md:flex-row md:rounded-[32px] md:p-7 lg:gap-8 lg:p-[28px]">
          <Reveal delayMs={80} className="md:w-[63%]">
            <FeaturedArticleCard post={featuredPost} />
          </Reveal>

          <div className="flex flex-1 flex-col gap-4 px-2 pb-2 pt-1 sm:gap-[18px] sm:px-3">
            <p className="font-sora text-[10px] font-semibold uppercase tracking-[0.06em] text-white/72">
              También puede interesarte
            </p>
            {secondaryPosts.map((p, i) => (
              <React.Fragment key={p.id}>
                {i > 0 && <div className="h-px w-full bg-white/[0.18]" aria-hidden="true" />}
                <Reveal delayMs={160 + i * 80} className="flex flex-col md:flex-1 md:justify-center">
                  <SecondaryArticle post={p} index={i} />
                </Reveal>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
