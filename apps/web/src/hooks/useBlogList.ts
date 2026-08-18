"use client";

import { useState, useMemo, useTransition } from "react";
import { BlogPostDTO, BlogCategoryDTO, PublicBlogResponse } from "@vc/api-client";

export interface UseBlogListProps {
  initialData: PublicBlogResponse;
}

export function useBlogList({ initialData }: UseBlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, startTransition] = useTransition();

  const handleSelectCategory = (slug: string) => {
    startTransition(() => {
      setSelectedCategory(slug);
    });
  };

  const handleSearchChange = (query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  };

  // Filtered posts in real-time
  const filteredPosts = useMemo(() => {
    let list = initialData.items || [];
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [initialData.items, selectedCategory, searchQuery]);

  // Featured post logic
  const isDefaultView = selectedCategory === "all" && !searchQuery.trim();
  const featuredPost = isDefaultView ? initialData.featuredPost : null;

  // Grid posts (excluding featured post when featured hero is visible)
  const gridPosts = useMemo(() => {
    if (isDefaultView && featuredPost) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, isDefaultView, featuredPost]);

  return {
    categories: initialData.categories || [],
    selectedCategory,
    handleSelectCategory,
    searchQuery,
    handleSearchChange,
    featuredPost,
    gridPosts,
    totalCount: filteredPosts.length,
  };
}
