"use client";

import React from "react";
import { BlogCategoryDTO } from "@vc/api-client";

export interface BlogHeroSectionProps {
  categories: BlogCategoryDTO[];
  selectedCategorySlug?: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const BlogHeroSection: React.FC<BlogHeroSectionProps> = ({
  categories,
  selectedCategorySlug = "all",
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="relative overflow-hidden bg-brand-primary text-white py-16 lg:py-20">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary to-brand-primary/95 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-secondary text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
          <span>✈️</span>
          <span>Historias & Inspiración</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Guías, Consejos y Destinos para Soñar
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
          Descubre itinerarios recomendados por nuestras asesoras, tips prácticos para tus vuelos y los secretos de cada rincón del mundo.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-neutral-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar destinos, consejos, playas, visas..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-neutral-800 placeholder-neutral-400 text-sm sm:text-base font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-neutral-600 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
              selectedCategorySlug === "all"
                ? "bg-white text-brand-primary shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Todos los artículos
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                selectedCategorySlug === cat.slug
                  ? "bg-white text-brand-primary shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
