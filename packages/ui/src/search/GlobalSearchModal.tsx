"use client";

import React, { useEffect, useRef } from "react";
import type { SearchResultItemDTO, SearchResultType } from "@vc/api-client";
import { ResponsiveImage } from "../primitives/ResponsiveImage";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  activeType: SearchResultType;
  onTypeChange: (type: SearchResultType) => void;
  results: SearchResultItemDTO[];
  suggestedQueries: string[];
  isLoading?: boolean;
  onSelectResult?: (item: SearchResultItemDTO) => void;
}

const FILTER_TABS: { label: string; value: SearchResultType }[] = [
  { label: "Todos", value: "ALL" },
  { label: "Promociones", value: "PROMOTION" },
  { label: "Blog & Guías", value: "BLOG_POST" },
  { label: "Intenciones", value: "INTENTION" },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  activeType,
  onTypeChange,
  results,
  suggestedQueries,
  isLoading = false,
  onSelectResult,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con Buscador */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            id="search-modal-input"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Busca promociones, destinos, guías de viaje o paquetes..."
            className="w-full bg-transparent text-base sm:text-lg text-slate-900 placeholder-slate-400 focus:outline-none"
          />

          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-200/70 border border-slate-300 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Filtros por Categoría */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-white border-b border-slate-100 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTypeChange(tab.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all shrink-0 ${
                activeType === tab.value
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de Resultados */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <svg className="animate-spin h-7 w-7 text-primary-600 mb-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm font-medium">Buscando destinos y experiencias...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item) => (
                <a
                  key={`${item.entityType}-${item.entityId}`}
                  href={item.targetUrl}
                  onClick={() => {
                    if (onSelectResult) onSelectResult(item);
                    onClose();
                  }}
                  className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <ResponsiveImage
                      src={item.imageUrl || "/media/demo-cartagena-caribe.webp"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">
                        {item.entityType === "PROMOTION"
                          ? "Promoción"
                          : item.entityType === "BLOG_POST"
                          ? "Blog"
                          : "Experiencia"}
                      </span>
                      {item.metadataInfo && (
                        <span className="text-xs text-slate-400 truncate">
                          • {item.metadataInfo}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 truncate transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {item.badgeText && (
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        {item.badgeText}
                      </span>
                    </div>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No encontramos resultados para &quot;{query}&quot;
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                ¿Buscas un destino a medida? Nuestras asesoras pueden diseñar cualquier itinerario personalizado para ti.
              </p>
              <WhatsAppButton
                size="sm"
                message={`Hola Viajes Carolina, busco información sobre "${query}". ¿Me podrían asesorar?`}
              >
                Consultar por WhatsApp
              </WhatsAppButton>
            </div>
          )}
        </div>

        {/* Footer con Búsquedas Sugeridas */}
        {suggestedQueries.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 shrink-0">
              Sugerencias:
            </span>
            {suggestedQueries.map((suggested) => (
              <button
                key={suggested}
                onClick={() => onQueryChange(suggested)}
                className="text-xs text-slate-600 bg-white hover:bg-slate-200/80 border border-slate-200/80 px-2.5 py-1 rounded-md transition-colors"
              >
                {suggested}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
