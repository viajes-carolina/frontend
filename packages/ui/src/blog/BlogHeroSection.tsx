import React from "react";
import { BlogHeroConfigDTO, BlogPostDTO, DEFAULT_BLOG_HERO } from "@vc/api-client";
import { BlogFeaturedStoryCard } from "./BlogFeaturedStoryCard";
import { Reveal } from "../primitives/Reveal";

export interface BlogHeroSectionProps {
  heroPost?: BlogPostDTO;
  config?: BlogHeroConfigDTO;
}

const DEFAULT_CONFIG: BlogHeroConfigDTO = DEFAULT_BLOG_HERO;

export const BlogHeroSection: React.FC<BlogHeroSectionProps> = ({
  heroPost,
  config = DEFAULT_CONFIG,
}) => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
              {config.eyebrowText}
            </p>
            <h1
              className="font-display mt-4 text-4xl font-semibold leading-[1.05] text-brand-navy sm:text-5xl lg:text-[58px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              {config.title}
            </h1>
            <svg
              aria-hidden="true"
              viewBox="0 0 300 16"
              className="-mt-1 h-3 w-40 text-brand-accent sm:w-52"
              fill="none"
            >
              <path
                d="M3 10.5C40 2 90 2 130 8C175 14.5 230 3 297 6"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-inter mt-5 max-w-xl text-base text-brand-navy/75 sm:text-lg">
              {config.description}
            </p>

            <div className="mt-10">
              <p className="font-sora text-[11px] font-semibold uppercase tracking-wider text-brand-navy/60">
                {config.editionLabel}
              </p>
            </div>
          </Reveal>

          {heroPost && (
            <Reveal delayMs={120} className="lg:col-span-5">
              <BlogFeaturedStoryCard post={heroPost} />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};
