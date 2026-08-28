import React from "react";
import { BlogPostDTO } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";

export interface BlogArticleCoverProps {
  post: BlogPostDTO;
}

export const BlogArticleCover: React.FC<BlogArticleCoverProps> = ({ post }) => {
  const updatedLabel = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString("es-PE", { month: "long", year: "numeric" })
    : null;

  return (
    <section className="pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav className="font-sora text-[11px] font-semibold uppercase tracking-wider">
          <a href="/blog" className="text-brand-accent hover:underline">
            Blog
          </a>
          {post.categoryName && <span className="text-brand-accent"> / {post.categoryName}</span>}
        </nav>

        <p className="font-sora mt-4 text-[11px] font-semibold uppercase tracking-wider text-brand-navy">
          {post.readingTimeMinutes} min de lectura
          {updatedLabel ? ` · Actualizado en ${updatedLabel}` : ""}
        </p>

        <h1
          className="font-display mt-5 text-4xl font-semibold leading-[1.08] text-brand-navy sm:text-5xl lg:text-[58px]"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          {post.title}
        </h1>

        <p className="font-inter mt-5 max-w-2xl text-base text-brand-navy/80 sm:text-lg">{post.summary}</p>

        <div className="mt-6 flex items-center gap-3">
          <div className="relative h-[38px] w-[38px] shrink-0 overflow-hidden rounded-full bg-brand-navy/10">
            {post.authorAvatarUrl ? (
              <ResponsiveImage
                src={post.authorAvatarUrl}
                alt={post.authorName}
                fill
                className="rounded-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-sm font-semibold text-brand-navy">
                {post.authorName.charAt(0)}
              </div>
            )}
          </div>
          <p className="font-inter text-[13px] font-semibold text-brand-navy">
            {post.authorName} · Una respuesta preparada para acompañarte
          </p>
        </div>

        <div className="relative mt-10 h-72 overflow-hidden rounded-tl-[64px] rounded-tr-[12px] rounded-br-[64px] rounded-bl-[12px] sm:h-96 sm:rounded-tl-[80px] sm:rounded-br-[80px] lg:h-[420px]">
          <ResponsiveImage
            src={post.coverMediaUrl || "/media/demo-hero-travel.webp"}
            alt={post.title}
            fill
            priority
            focalPoint={{ x: post.coverFocalX ?? 50, y: post.coverFocalY ?? 50 }}
          />
        </div>
        <p className="font-sora mt-3 text-[10px] font-semibold uppercase tracking-wider text-brand-navy/70">
          Fotografía del destino · Administrable desde la Biblioteca
        </p>
      </div>
    </section>
  );
};
