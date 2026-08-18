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
    <section id="inspiracion" className="py-20 bg-slate-50/70 border-t border-slate-200/60 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-50/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold tracking-wider uppercase bg-primary-100 text-primary-800 rounded-full mb-4">
            ✨ {config.badgeText}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {config.titleHighlight}{" "}
            <span className="text-primary-600 font-serif italic">
              {config.titleAccent}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300"
            >
              {/* Cover Image */}
              <a
                href={`/blog/${post.slug}`}
                className="relative aspect-[16/10] overflow-hidden bg-slate-100 block"
              >
                <ResponsiveImage
                  src={post.coverMediaUrl || "/media/demo-cartagena-caribe.webp"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/95 backdrop-blur-sm text-slate-900 shadow-md">
                    {post.categoryName || "Guía"}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-black/60 backdrop-blur-sm text-white">
                    ⏱️ {post.readingTimeMinutes || 5} min
                  </span>
                </div>
              </a>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2.5">
                    <span>Por {post.authorName}</span>
                    <span>•</span>
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-PE", { month: "short", day: "numeric", year: "numeric" }) : "Publicación reciente"}</span>
                  </div>

                  <a href={`/blog/${post.slug}`} className="block group-hover:text-primary-600 transition-colors">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2.5 leading-snug">
                      {post.title}
                    </h3>
                  </a>

                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
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
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200/80 rounded-2xl transition-all shadow-sm hover:shadow active:scale-95"
          >
            <span>{config.ctaText || "Ver todos los artículos del blog"}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
