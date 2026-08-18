"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BlogPostDTO,
  BlogCategoryDTO,
  CreateOrUpdateBlogPostRequest,
  CreateOrUpdateBlogCategoryRequest,
  apiClient,
} from "@vc/api-client";

export function useAdminBlog() {
  const [posts, setPosts] = useState<BlogPostDTO[]>([]);
  const [categories, setCategories] = useState<BlogCategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals state
  const [editingPost, setEditingPost] = useState<BlogPostDTO | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedPosts, fetchedCategories] = await Promise.all([
        apiClient.getAdminBlogPosts(statusFilter, searchQuery),
        apiClient.getBlogCategories(true),
      ]);
      setPosts(fetchedPosts);
      setCategories(fetchedCategories);
    } catch {
      setMessage({ type: "error", text: "Error al cargar los datos del blog." });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreatePost = () => {
    setEditingPost(null);
    setIsPostModalOpen(true);
  };

  const handleOpenEditPost = (post: BlogPostDTO) => {
    setEditingPost(post);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setEditingPost(null);
  };

  const handleSavePost = async (req: CreateOrUpdateBlogPostRequest) => {
    try {
      setSaving(true);
      if (editingPost) {
        await apiClient.updateBlogPost(editingPost.id, req);
        setMessage({ type: "success", text: "Artículo actualizado con éxito." });
      } else {
        await apiClient.createBlogPost(req);
        setMessage({ type: "success", text: "Artículo creado con éxito." });
      }
      handleClosePostModal();
      await loadData();
    } catch {
      setMessage({ type: "error", text: "Error al guardar el artículo." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("¿Estás seguro de archivar este artículo del blog?")) return;
    try {
      setSaving(true);
      await apiClient.deleteBlogPost(id);
      setMessage({ type: "success", text: "Artículo archivado con éxito." });
      await loadData();
    } catch {
      setMessage({ type: "error", text: "Error al archivar el artículo." });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (id: number | null, req: CreateOrUpdateBlogCategoryRequest) => {
    try {
      setSaving(true);
      if (id) {
        await apiClient.updateBlogCategory(id, req);
        setMessage({ type: "success", text: "Categoría actualizada con éxito." });
      } else {
        await apiClient.createBlogCategory(req);
        setMessage({ type: "success", text: "Categoría creada con éxito." });
      }
      await loadData();
    } catch {
      setMessage({ type: "error", text: "Error al guardar la categoría." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Estás seguro de desactivar esta categoría?")) return;
    try {
      setSaving(true);
      await apiClient.deleteBlogCategory(id);
      setMessage({ type: "success", text: "Categoría desactivada." });
      await loadData();
    } catch {
      setMessage({ type: "error", text: "Error al desactivar la categoría." });
    } finally {
      setSaving(false);
    }
  };

  return {
    posts,
    categories,
    loading,
    saving,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    message,
    setMessage,
    editingPost,
    isPostModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    handleOpenCreatePost,
    handleOpenEditPost,
    handleClosePostModal,
    handleSavePost,
    handleDeletePost,
    handleSaveCategory,
    handleDeleteCategory,
    loadData,
  };
}
