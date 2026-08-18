"use client";

import React from "react";
import { SearchResultsView } from "@vc/ui";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import type { GlobalSearchResponse, SearchResultType } from "@vc/api-client";

export interface SearchClientViewProps {
  initialQuery?: string;
  initialType?: SearchResultType;
  initialData?: GlobalSearchResponse;
}

export const SearchClientView: React.FC<SearchClientViewProps> = ({
  initialQuery = "",
  initialType = "ALL",
  initialData,
}) => {
  const {
    query,
    setQuery,
    activeType,
    setActiveType,
    results,
    suggestedQueries,
    isLoading,
  } = useGlobalSearch({
    initialQuery,
    initialType,
    initialData,
  });

  return (
    <SearchResultsView
      query={query}
      onQueryChange={setQuery}
      activeType={activeType}
      onTypeChange={setActiveType}
      results={results}
      suggestedQueries={suggestedQueries}
      isLoading={isLoading}
    />
  );
};
