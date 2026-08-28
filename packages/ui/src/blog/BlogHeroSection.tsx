import React from "react";
import { BlogCategoryDTO, BlogPostDTO } from "@vc/api-client";
import { BlogFeaturedStoryCard } from "./BlogFeaturedStoryCard";
import { Reveal } from "../primitives/Reveal";

export interface BlogHeroSectionProps {
  categories: BlogCategoryDTO[];
  selectedCategorySlug?: string;
  heroPost?: BlogPostDTO;
}

export const BlogHeroSection: React.FC<BlogHeroSectionProps> = ({
  categories,
  selectedCategorySlug = "all",
  heroPost,
}) => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Diario de viaje · Preguntas reales
            </p>
            <h1
              className="font-display mt-4 text-4xl font-semibold leading-[1.05] text-brand-navy sm:text-5xl lg:text-[58px]"
              style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
            >
              ¿Qué te gustaría saber
              <br />
              antes de viajar?
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
              Aquí reunimos respuestas, ideas y experiencias que nacieron de conversaciones con viajeros como tú.
            </p>

            <div className="mt-10">
              <p className="font-sora text-[11px] font-semibold uppercase tracking-wider text-brand-navy/60">
                Elige por dónde empezar
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="/blog"
                  className={`font-inter text-sm font-semibold pb-1 border-b-2 transition-colors ${
                    selectedCategorySlug === "all"
                      ? "border-brand-accent text-brand-navy"
                      : "border-transparent text-brand-navy/60 hover:text-brand-navy"
                  }`}
                >
                  Todo
                </a>
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/blog?categoria=${cat.slug}`}
                    className={`font-inter text-sm font-semibold pb-1 border-b-2 transition-colors ${
                      selectedCategorySlug === cat.slug
                        ? "border-brand-accent text-brand-navy"
                        : "border-transparent text-brand-navy/60 hover:text-brand-navy"
                    }`}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {heroPost && (
            <Reveal delayMs={120} className="lg:col-span-5">
              <BlogFeaturedStoryCard post={heroPost} size="hero" />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};
