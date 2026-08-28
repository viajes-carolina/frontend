import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { BlogRelatedStoryCard } from "./BlogRelatedStoryCard";

export interface BlogRelatedStoriesSectionProps {
  posts: BlogPostDTO[];
}

export const BlogRelatedStoriesSection: React.FC<BlogRelatedStoriesSectionProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="font-sora text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
          Sigue explorando
        </p>
        <h2
          className="font-display mt-3 max-w-lg text-3xl font-semibold leading-tight text-brand-navy sm:text-[42px]"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          Más historias que pueden acompañarte
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <BlogRelatedStoryCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};
