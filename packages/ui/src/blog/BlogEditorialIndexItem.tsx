"use client";

import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface BlogEditorialIndexItemProps {
  post: BlogPostDTO;
  index: number;
}

export const BlogEditorialIndexItem: React.FC<BlogEditorialIndexItemProps> = ({ post, index }) => {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group flex items-start gap-4 py-6 border-t border-brand-navy/[0.18] first:border-t-0"
    >
      <span className="font-sora shrink-0 text-xs font-semibold text-brand-navy/50 pt-1">
        {String(index).padStart(2, "0")}
      </span>
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
        <ResponsiveImage
          src={post.coverMediaUrl || "/media/demo-hero-travel.webp"}
          alt={post.title}
          fill
          focalPoint={{ x: post.coverFocalX ?? 50, y: post.coverFocalY ?? 50 }}
          className="rounded-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
          {post.categoryName ? `${post.categoryName} · ` : ""}
          {post.readingTimeMinutes} min
        </p>
        <h4 className="font-display mt-1.5 text-lg font-semibold text-brand-navy sm:text-xl">
          {post.title}
        </h4>
        <p className="mt-1.5 text-sm text-brand-navy/75 line-clamp-2">{post.summary}</p>
        <span className="mt-2 inline-flex text-sm font-semibold text-brand-navy group-hover:text-brand-accent transition-colors">
          Leer artículo →
        </span>
      </div>
    </a>
  );
};
