"use client";

import React from "react";
import { BlogCategoryDTO, BlogLibraryDTO, BlogPostDTO, DEFAULT_BLOG_LIBRARY } from "@vc/api-client";
import { Reveal } from "../primitives/Reveal";

export interface BlogLibrarySectionProps {
  posts: BlogPostDTO[];
  categories: BlogCategoryDTO[];
  selectedCategorySlug: string;
  searchQuery: string;
  total: number;
  /** 0-indexado, tal como lo devuelve `PublicBlogResponse.page`. */
  page: number;
  totalPages: number;
  config?: BlogLibraryDTO;
}

const DEFAULT_CONFIG: BlogLibraryDTO = DEFAULT_BLOG_LIBRARY;

// Icono de lupa local — un único uso en todo el proyecto (mismo criterio que
// `AtmosphereCircle`/`DecorativeLine` en BlogFeaturedStoryCard.tsx), no
// amerita convertirse en primitiva compartida de `icons/icons.tsx`.
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Construye el href de un filtro de categoría preservando la búsqueda activa
// y reseteando siempre a la página 1 (se omite `pagina` a propósito).
function buildCategoryHref(slug: string, searchQuery: string): string {
  const params = new URLSearchParams();
  if (slug !== "all") params.set("categoria", slug);
  if (searchQuery) params.set("q", searchQuery);
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

// Construye el href de un control de paginación preservando categoría y búsqueda.
function buildPageHref(pageNumber: number, categorySlug: string, searchQuery: string): string {
  const params = new URLSearchParams();
  if (categorySlug !== "all") params.set("categoria", categorySlug);
  if (searchQuery) params.set("q", searchQuery);
  params.set("pagina", String(pageNumber));
  return `/blog?${params.toString()}`;
}

// Paginación "con ventana": primera página, última página, la actual ± 1, y
// "…" para los huecos — no pretende ser pixel-perfect al mock de Figma
// (que solo ilustra "1 2 3 … 6"), solo razonable para cualquier `totalPages`.
function buildPaginationItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 1) return [];
  const keep = new Set<number>(
    [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter((p) => p >= 1 && p <= totalPages)
  );
  const sorted = Array.from(keep).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  let previous = 0;
  for (const p of sorted) {
    if (previous && p - previous > 1) items.push("ellipsis");
    items.push(p);
    previous = p;
  }
  return items;
}

function LibraryPostRow({ post, isLast }: { post: BlogPostDTO; isLast: boolean }) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className={`group block py-6 first:pt-0 ${isLast ? "" : "border-b border-[rgba(184,209,219,0.55)]"}`}
    >
      <p className="font-sora text-[11px] font-semibold uppercase tracking-wider text-brand-accent">
        {post.categoryName ? `${post.categoryName} · ` : ""}
        {post.readingTimeMinutes} MIN
      </p>
      <h3
        className="font-display mt-2 text-xl font-semibold text-brand-navy sm:text-2xl"
        style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
      >
        {post.title}
      </h3>
      <p className="font-inter mt-2 text-sm text-brand-navy/75 line-clamp-2">{post.summary}</p>
      <span className="font-inter mt-3 inline-flex text-sm font-semibold text-brand-navy transition-colors group-hover:text-brand-accent">
        Leer artículo →
      </span>
    </a>
  );
}

function PaginationControls({
  page,
  totalPages,
  categorySlug,
  searchQuery,
}: {
  page: number;
  totalPages: number;
  categorySlug: string;
  searchQuery: string;
}) {
  const currentPage = page + 1;
  const items = buildPaginationItems(currentPage, totalPages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav aria-label="Paginación de artículos" className="mt-14 flex items-center justify-center gap-1.5 lg:mt-20">
      {isFirstPage ? (
        <span aria-hidden="true" className="font-inter px-2 text-sm font-semibold text-brand-navy/30">
          ←
        </span>
      ) : (
        <a
          href={buildPageHref(currentPage - 1, categorySlug, searchQuery)}
          aria-label="Página anterior"
          className="font-inter px-2 text-sm font-semibold text-brand-navy transition-colors hover:text-brand-accent"
        >
          ←
        </a>
      )}

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${i}`} aria-hidden="true" className="px-1 text-sm text-brand-navy/40">
            …
          </span>
        ) : (
          <a
            key={item}
            href={buildPageHref(item, categorySlug, searchQuery)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`font-inter flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              item === currentPage ? "bg-brand-navy text-white" : "text-brand-navy hover:text-brand-accent"
            }`}
          >
            {item}
          </a>
        )
      )}

      {isLastPage ? (
        <span aria-hidden="true" className="font-inter px-2 text-sm font-semibold text-brand-navy/30">
          →
        </span>
      ) : (
        <a
          href={buildPageHref(currentPage + 1, categorySlug, searchQuery)}
          aria-label="Página siguiente"
          className="font-inter px-2 text-sm font-semibold text-brand-navy transition-colors hover:text-brand-accent"
        >
          →
        </a>
      )}
    </nav>
  );
}

export const BlogLibrarySection: React.FC<BlogLibrarySectionProps> = ({
  posts,
  categories,
  selectedCategorySlug = "all",
  searchQuery = "",
  total,
  page,
  totalPages,
  config = DEFAULT_CONFIG,
}) => {
  const half = Math.ceil(posts.length / 2);
  const leftColumn = posts.slice(0, half);
  const rightColumn = posts.slice(half);

  /* Aquí había un numeral gigante de fondo con el total de artículos: un «4» en
     gris azulado, de hasta 170px, detrás del encabezado. Era el único número de
     fondo del sitio y se retiró — el total ya se lee en el antetítulo
     («… · 4 ARTÍCULOS»), así que solo repetía el dato compitiendo con el título.

     Con él se fue el `relative` de la sección, que existía solo para anclarlo.
     `overflow-hidden` se conserva: las animaciones de entrada de `Reveal`
     desplazan sus bloques antes de asentarlos. */
  return (
    <section className="overflow-hidden bg-[#fbfaf6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 xl:px-16">
        <Reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="font-sora text-xs font-semibold uppercase tracking-wider text-brand-accent">
                {config.eyebrowText} · {total} ARTÍCULOS
              </p>
              <h2
                className="font-display mt-3 text-3xl font-semibold text-brand-navy sm:text-4xl lg:text-[46px]"
                style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
              >
                {config.title}
              </h2>
            </div>
            <p className="font-inter max-w-sm text-sm text-brand-navy/70 lg:pt-3 lg:text-right lg:text-base">
              {config.description}
            </p>
          </div>
        </Reveal>

        {/* Buscador */}
        <Reveal delayMs={80} className="mt-8 lg:mt-10">
          <form method="GET" action="/blog" className="flex h-[50px] items-center gap-3 rounded-full border border-[rgba(14,31,43,0.12)] bg-[#edf6f7] px-5">
            <SearchIcon className="h-4 w-4 shrink-0 text-brand-navy/50" />
            <label htmlFor="blog-library-search" className="sr-only">
              Buscar en el blog
            </label>
            <input
              id="blog-library-search"
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Buscar destino, tema o consejo…"
              className="font-inter w-full bg-transparent text-sm text-brand-navy placeholder:text-brand-navy/45 focus:outline-none"
            />
            {selectedCategorySlug !== "all" && <input type="hidden" name="categoria" value={selectedCategorySlug} />}
            <button
              type="submit"
              className="font-sora shrink-0 text-xs font-semibold uppercase tracking-wider text-brand-accent"
            >
              Buscar
            </button>
          </form>
        </Reveal>

        {/* Filtro de categorías */}
        <Reveal delayMs={120} className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 lg:mt-8">
          <a
            href={buildCategoryHref("all", searchQuery)}
            className={`font-sora text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              selectedCategorySlug === "all" ? "text-brand-accent" : "text-brand-navy hover:text-brand-accent"
            }`}
          >
            TODOS
          </a>
          {categories.map((cat) => (
            <React.Fragment key={cat.id}>
              <span aria-hidden="true" className="font-sora text-[11px] text-brand-navy/40">
                ·
              </span>
              <a
                href={buildCategoryHref(cat.slug, searchQuery)}
                className={`font-sora text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  selectedCategorySlug === cat.slug ? "text-brand-accent" : "text-brand-navy hover:text-brand-accent"
                }`}
              >
                {cat.name}
              </a>
            </React.Fragment>
          ))}
        </Reveal>

        {/* Grilla de 2 columnas con TODOS los posts (biblioteca completa: no
            excluye al artículo destacado, a diferencia de la sección anterior). */}
        <Reveal delayMs={160} className="mt-10 grid grid-cols-1 gap-x-16 lg:mt-14 lg:grid-cols-2">
          <div className="flex flex-col">
            {leftColumn.map((post, i) => (
              <LibraryPostRow key={post.id} post={post} isLast={i === leftColumn.length - 1} />
            ))}
          </div>
          <div className="flex flex-col">
            {rightColumn.map((post, i) => (
              <LibraryPostRow key={post.id} post={post} isLast={i === rightColumn.length - 1} />
            ))}
          </div>
        </Reveal>

        {totalPages > 1 && (
          <PaginationControls page={page} totalPages={totalPages} categorySlug={selectedCategorySlug} searchQuery={searchQuery} />
        )}
      </div>
    </section>
  );
};
