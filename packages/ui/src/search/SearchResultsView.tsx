"use client";

import React from "react";
import type { SearchResultItemDTO, SearchResultType } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface SearchResultsViewProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeType: SearchResultType;
  onTypeChange: (type: SearchResultType) => void;
  results: SearchResultItemDTO[];
  suggestedQueries: string[];
  isLoading?: boolean;
}

const FILTER_TABS: { label: string; value: SearchResultType }[] = [
  { label: "Todos los Resultados", value: "ALL" },
  { label: "Promociones & Paquetes", value: "PROMOTION" },
  { label: "Artículos & Guías", value: "BLOG_POST" },
];

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  onQueryChange,
  activeType,
  onTypeChange,
  results,
  suggestedQueries,
  isLoading = false,
}) => {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <section className="relative border-b border-neutral-border pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-wider uppercase bg-white text-brand-accent border border-neutral-border shadow-sm rounded-full mb-4">
            Explora Nuestro Catálogo
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-brand-navy">
            Buscador Global de Viajes
          </h1>
          <p className="text-base sm:text-lg text-neutral-muted max-w-2xl mx-auto mb-8">
            Encuentra paquetes turísticos, ofertas del Caribe, consejos de viaje y experiencias diseñadas a tu medida.
          </p>

          {/* Barra de Búsqueda Principal */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden p-2 border border-slate-200">
              <svg className="w-6 h-6 text-slate-400 ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Busca por destino (Cartagena, Cusco, Punta Cana...), experiencia o tip..."
                className="w-full px-4 py-3 text-slate-900 text-base placeholder-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => onQueryChange("")}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors mr-2"
                  aria-label="Limpiar"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Sugerencias Rápidas */}
          {suggestedQueries.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span className="text-xs text-neutral-muted">Populares:</span>
              {suggestedQueries.map((suggested) => (
                <button
                  key={suggested}
                  onClick={() => onQueryChange(suggested)}
                  className="text-xs text-neutral-muted bg-white hover:text-brand-navy hover:border-brand-accent/40 border border-neutral-border px-3 py-1 rounded-full transition-all"
                >
                  {suggested}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Barra de Filtros & Contador */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pestañas de Filtro */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTypeChange(tab.value)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all shrink-0 ${
                  activeType === tab.value
                    ? "bg-brand-accent text-white shadow-md shadow-brand-accent/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteo de Resultados */}
          <div className="text-xs sm:text-sm font-medium text-slate-500 shrink-0">
            {isLoading ? (
              <span>Buscando...</span>
            ) : (
              <span>
                Mostrando <strong className="text-slate-900">{results.length}</strong> {results.length === 1 ? "resultado" : "resultados"}
                {query ? ` para "${query}"` : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Grid de Resultados */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <svg className="animate-spin h-10 w-10 text-brand-accent mb-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-base font-medium">Buscando coincidencias...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <a
                key={`${item.entityType}-${item.entityId}`}
                href={item.targetUrl}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-accent/30 transition-all duration-300 overflow-hidden"
              >
                {/* Imagen & Badge */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <ResponsiveImage
                    src={item.imageUrl || "/media/demo-cartagena-caribe.webp"}
                    alt={item.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/95 backdrop-blur-sm text-slate-900 shadow-md">
                      {item.entityType === "PROMOTION"
                        ? "🌴 Promoción"
                        : item.entityType === "BLOG_POST"
                        ? "📖 Blog & Guía"
                        : "✨ Experiencia"}
                    </span>
                  </div>
                  {item.badgeText && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 text-xs font-extrabold rounded-lg bg-emerald-600 text-white shadow-lg">
                        {item.badgeText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {item.metadataInfo && (
                      <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider block mb-1">
                        {item.metadataInfo}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-accent transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-accent group-hover:text-brand-navy">
                    <span>Ver detalles</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* Estado Vacío */
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-md">
            <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              No encontramos resultados para &quot;{query}&quot;
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Intenta con otra palabra clave o pregúntale directamente a una de nuestras asesoras expertas. Creamos paquetes 100% personalizados para cualquier destino del mundo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <WhatsAppButton
                message={`Hola Viajes Carolina, busco cotizar un viaje a "${query}". ¿Me podrían dar opciones?`}
              >
                Cotizar Destino por WhatsApp
              </WhatsAppButton>
              <button
                onClick={() => {
                  onQueryChange("");
                  onTypeChange("ALL");
                }}
                className="px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto"
              >
                Ver Todas las Ofertas
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
