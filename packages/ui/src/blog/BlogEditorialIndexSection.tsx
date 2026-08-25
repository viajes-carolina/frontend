"use client";

import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { BlogFeaturedStoryCard } from "./BlogFeaturedStoryCard";
import { BlogEditorialIndexItem } from "./BlogEditorialIndexItem";
import { Reveal } from "../primitives/Reveal";

export interface BlogEditorialIndexSectionProps {
  mainStory: BlogPostDTO;
  secondaryStories: BlogPostDTO[];
}

export const BlogEditorialIndexSection: React.FC<BlogEditorialIndexSectionProps> = ({
  mainStory,
  secondaryStories,
}) => {
  return (
    <section className="bg-atmosphere-fog py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
            01 · Una ruta de lectura
          </p>
          <h2
            className="font-display mt-3 text-3xl font-semibold text-brand-navy sm:text-4xl lg:text-[48px]"
            style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
          >
            Historias para el momento en que estás
          </h2>
          <p className="font-inter mt-3 text-base text-brand-navy/75 sm:text-lg">
            No todos llegan al blog con la misma pregunta. Estas guías acompañan distintos momentos del viaje.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          <Reveal className="hidden md:block">
            <BlogFeaturedStoryCard post={mainStory} size="index" readMoreLabel="Leer la guía completa →" />
          </Reveal>
          <Reveal delayMs={120}>
            <div className="flex flex-col">
              {secondaryStories.map((post, i) => (
                <BlogEditorialIndexItem key={post.id} post={post} index={i + 2} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
