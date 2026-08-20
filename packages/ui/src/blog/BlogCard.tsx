"use client";

import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface BlogCardProps {
  post: BlogPostDTO;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Cover Image */}
      <a href={`/blog/${post.slug}`} className="relative h-48 sm:h-52 w-full overflow-hidden block">
        <ResponsiveImage
          src={post.coverMediaUrl || "/media/demo-cartagena-caribe.webp"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {post.categoryName && (
          <span className="absolute top-3 left-3 bg-brand-navy/80 text-white backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {post.categoryName}
          </span>
        )}
      </a>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium mb-2.5">
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && <span>•</span>}
            <span>⏱️ {post.readingTimeMinutes} min de lectura</span>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-brand-accent transition-colors line-clamp-2 mb-2 leading-snug">
            <a href={`/blog/${post.slug}`}>
              {post.title}
            </a>
          </h2>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed mb-4">
            {post.summary}
          </p>
        </div>

        {/* Footer: Author & Read More */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-700">
            ✍️ {post.authorName}
          </span>
          <a
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-accent hover:text-brand-sunset transition"
          >
            <span>Leer artículo</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </article>
  );
};
