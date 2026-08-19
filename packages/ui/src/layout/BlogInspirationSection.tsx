"use client";

import React from "react";
import type { BlogPostDTO, HomeBlogInspirationDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface BlogInspirationSectionProps {
  config?: HomeBlogInspirationDTO;
  posts: BlogPostDTO[];
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

  return (
    <section id="inspiracion" className="py-20 bg-neutral-soft border-b border-neutral-border text-neutral-ink relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-sunset/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-border shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              {config.badgeText}
            </span>
          </div>
          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight mb-4">
            {config.titleHighlight}{" "}
            <span className="text-brand-accent">
              {config.titleAccent}
            </span>
          </h2>
          <p className="font-inter text-neutral-muted text-base sm:text-lg leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-neutral-border shadow-card hover:shadow-hover hover:border-brand-accent/40 transition-all duration-300"
            >
              {/* Cover Image */}
              <a
                href={`/blog/${post.slug}`}
                className="relative aspect-[16/10] overflow-hidden bg-neutral-soft block border-b border-neutral-border"
              >
                <ResponsiveImage
                  src={post.coverMediaUrl || "/media/demo-cartagena-caribe.webp"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/95 backdrop-blur-sm text-brand-navy shadow-md font-sora">
                    {post.categoryName || "Guía"}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-brand-navy/80 backdrop-blur-sm text-white font-inter">
                    ⏱️ {post.readingTimeMinutes || 5} min
                  </span>
                </div>
              </a>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between text-left space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-muted font-medium mb-2.5 font-inter">
                    <span>Por {post.authorName}</span>
                    <span>•</span>
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-PE", { month: "short", day: "numeric", year: "numeric" }) : "Publicación reciente"}</span>
                  </div>

                  <a href={`/blog/${post.slug}`} className="block group-hover:text-brand-accent transition-colors">
                    <h3 className="font-sora font-bold text-lg text-brand-navy line-clamp-2 mb-2 leading-snug">
                      {post.title}
                    </h3>
                  </a>

                  <p className="font-inter text-xs sm:text-sm text-neutral-muted line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-border flex items-center justify-between">
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent hover:text-brand-sunset transition-colors font-sora"
                  >
                    <span>Leer guía completa</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

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
