"use client";

import React from "react";
import type { BlogPostDTO, HomeBlogInspirationDTO } from "@vc/api-client";
import { EditorialFeature, EditorialFeatureItem } from "../compositions/EditorialFeature";

export interface BlogInspirationSectionProps {
  config?: HomeBlogInspirationDTO;
  posts: BlogPostDTO[];
}

function toEditorialItem(post: BlogPostDTO): EditorialFeatureItem {
  return {
    key: post.id,
    imageUrl: post.coverMediaUrl,
    imageAlt: post.title,
    eyebrow: post.categoryName || "Guía",
    title: post.title,
    summary: post.summary,
    meta: `${post.readingTimeMinutes || 5} min de lectura`,
  };
}

export const BlogInspirationSection: React.FC<BlogInspirationSectionProps> = ({
  config = {
    badgeText: "Inspiración para tu viaje",
    titleHighlight: "Consejos y guías",
    titleAccent: "para explorar el mundo",
    subtitle: "Descubre recomendaciones de viaje, mejores temporadas, qué empacar y secretos locales de la mano de nuestras asesoras expertas.",
    ctaText: "Ver todos los artículos del blog",
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
  const postByKey = new Map(posts.map((p) => [p.id, p]));

  const renderCta = (item: EditorialFeatureItem) => {
    const post = postByKey.get(item.key as number);
    return (
      <a
        href={`/blog/${post?.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-accent transition-colors font-sora"
      >
        <span>Leer guía completa</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    );
  };

  return (
    <section id="inspiracion" className="py-20 bg-neutral-soft border-b border-neutral-border text-neutral-ink relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent border-b-2 border-brand-accent pb-1">
            {config.badgeText}
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-brand-navy tracking-tight mt-3 mb-4">
            {config.titleHighlight}{" "}
            <span className="text-brand-accent">
              {config.titleAccent}
            </span>
          </h2>
          <p className="font-sora text-neutral-muted text-base sm:text-lg leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        <EditorialFeature
          featured={{ ...toEditorialItem(featuredPost), panelColor: "cloud" }}
          secondary={secondaryPosts.map((p) => ({ ...toEditorialItem(p), panelColor: "sand" }))}
          featuredBadge="Destacado"
          renderCta={renderCta}
          className="mb-12"
        />

        {/* Section Bottom Action */}
        <div className="text-center">
          <a
            href={config.ctaUrl || "/blog"}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-brand-navy bg-white hover:bg-neutral-soft border border-neutral-border rounded-2xl transition-all shadow-sm hover:shadow active:scale-95 font-sora"
          >
            <span>{config.ctaText || "Ver todos los artículos del blog"}</span>
            <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
