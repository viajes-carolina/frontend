"use client";

import React from "react";
import { PublicBlogResponse } from "@vc/api-client";
import { useBlogList } from "../../hooks/useBlogList";
import { BlogHeroSection } from "@vc/ui";
import { BlogFeaturedHero } from "@vc/ui";
import { BlogCard } from "@vc/ui";

export interface BlogClientViewProps {
  initialData: PublicBlogResponse;
}

export const BlogClientView: React.FC<BlogClientViewProps> = ({ initialData }) => {
  const {
    categories,
    selectedCategory,
    handleSelectCategory,
    searchQuery,
    handleSearchChange,
    featuredPost,
    gridPosts,
    totalCount,
  } = useBlogList({ initialData });

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Hero with Search and Categories */}
      <BlogHeroSection
        categories={categories}
        selectedCategorySlug={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Results Header when filtering */}
        {(selectedCategory !== "all" || searchQuery.trim()) && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                {searchQuery ? `Resultados para "${searchQuery}"` : "Artículos filtrados"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Se encontraron {totalCount} {totalCount === 1 ? "artículo" : "artículos"}
              </p>
            </div>
            {(selectedCategory !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  handleSelectCategory("all");
                  handleSearchChange("");
                }}
                className="text-xs sm:text-sm font-semibold text-brand-accent hover:text-brand-sunset transition underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Featured Hero Article Spotlight (when on home/all and no search) */}
        {featuredPost && <BlogFeaturedHero post={featuredPost} />}

        {/* Articles Grid */}
        {gridPosts.length > 0 ? (
          <div>
            {featuredPost && (
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
                Más historias y recomendaciones
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm">
            <span className="text-4xl mb-4 block">🔍</span>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">
              No encontramos artículos que coincidan con tu búsqueda
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
              Intenta buscar con otros términos como &quot;Cartagena&quot;, &quot;Machu Picchu&quot;, &quot;Playas&quot; o &quot;Consejos&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                handleSelectCategory("all");
                handleSearchChange("");
              }}
              className="px-6 py-2.5 rounded-xl bg-brand-accent text-white font-bold text-sm hover:bg-brand-sunset transition shadow-sm"
            >
              Ver todos los artículos
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
