import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface BlogRelatedStoryCardProps {
  post: BlogPostDTO;
}

export const BlogRelatedStoryCard: React.FC<BlogRelatedStoryCardProps> = ({ post }) => {
  return (
    <a href={`/blog/${post.slug}`} className="group flex items-start gap-4">
      <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-2xl">
        <ResponsiveImage
          src={post.coverMediaUrl || "/media/demo-hero-travel.webp"}
          alt={post.title}
          fill
          focalPoint={{ x: post.coverFocalX ?? 50, y: post.coverFocalY ?? 50 }}
          className="rounded-2xl"
        />
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <p className="font-sora text-[9px] font-semibold uppercase tracking-wider text-brand-accent">
          {post.categoryName ? `${post.categoryName} · ` : ""}
          {post.readingTimeMinutes} min
        </p>
        <h4 className="font-display mt-1.5 text-xl font-semibold text-brand-navy sm:text-2xl">
          {post.title}
        </h4>
        <p className="mt-1.5 text-[13px] text-brand-navy/75 line-clamp-2">{post.summary}</p>
        <span className="mt-2 inline-flex text-[13px] font-semibold text-brand-navy group-hover:text-brand-accent transition-colors">
          Leer artículo →
        </span>
      </div>
    </a>
  );
};
