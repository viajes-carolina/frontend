"use client";

import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface BlogFeaturedHeroProps {
  post: BlogPostDTO;
}

export const BlogFeaturedHero: React.FC<BlogFeaturedHeroProps> = ({ post }) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Image side */}
        <a
          href={`/blog/${post.slug}`}
          className="relative lg:col-span-7 h-64 sm:h-80 lg:h-full min-h-[280px] overflow-hidden block"
        >
          <ResponsiveImage
            src={post.coverMediaUrl || "/media/demo-cartagena-caribe.webp"}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 bg-brand-sunset text-brand-navy text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
            ⭐ Destacado de la Semana
          </div>
        </a>

        {/* Content side */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Category & Meta */}
            <div className="flex items-center gap-2 mb-3">
              {post.categoryName && (
                <span className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-md">
                  {post.categoryName}
                </span>
              )}
              <span className="text-xs text-neutral-400 font-medium">• {post.readingTimeMinutes} min</span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 hover:text-brand-accent transition-colors leading-tight mb-4">
              <a href={`/blog/${post.slug}`}>
                {post.title}
              </a>
            </h2>

            {/* Excerpt */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6">
              {post.summary}
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-navy/10 text-brand-navy font-bold text-sm flex items-center justify-center">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">{post.authorName}</p>
                {formattedDate && <p className="text-[11px] text-neutral-400">{formattedDate}</p>}
              </div>
            </div>

            <a
              href={`/blog/${post.slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-white text-xs sm:text-sm font-bold shadow-md hover:bg-brand-sunset hover:shadow-lg transition"
            >
              <span>Leer artículo</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
