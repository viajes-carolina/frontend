"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  apiClient,
  SearchResultItemDTO,
  SearchResultType,
  GlobalSearchResponse,
} from "@vc/api-client";

export interface UseGlobalSearchOptions {
  initialQuery?: string;
  initialType?: SearchResultType;
  initialData?: GlobalSearchResponse;
}

export function useGlobalSearch(options?: UseGlobalSearchOptions) {
  const [query, setQuery] = useState(options?.initialQuery || "");
  const [activeType, setActiveType] = useState<SearchResultType>(options?.initialType || "ALL");
  const [results, setResults] = useState<SearchResultItemDTO[]>(options?.initialData?.results || []);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>(
    options?.initialData?.suggestedQueries || ["Cartagena", "Machu Picchu", "Punta Cana", "Playa & Relax", "Consejos de Viaje", "Cusco"]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(
    async (q: string, type: SearchResultType) => {
      setIsLoading(true);
      try {
        const data = await apiClient.searchGlobal(q, type, 24);
        setResults(data.results);
        if (data.suggestedQueries && data.suggestedQueries.length > 0) {
          setSuggestedQueries(data.suggestedQueries);
        }
      } catch (err) {
        console.error("Error performing global search:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounced search on query/type change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(query, activeType);
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, activeType, performSearch]);

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return {
    query,
    setQuery,
    activeType,
    setActiveType,
    results,
    suggestedQueries,
    isLoading,
    isModalOpen,
    openModal,
    closeModal,
  };
}
