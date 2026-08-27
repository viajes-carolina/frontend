"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BlogPostDTO,
  BlogCategoryDTO,
  CreateOrUpdateBlogPostRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";
import { useAdminAdvisors } from "./useAdminAdvisors";

export function useAdminBlog() {
  const [posts, setPosts] = useState<BlogPostDTO[]>([]);
  const [categories, setCategories] = useState<BlogCategoryDTO[]>([]);
  // El autor del artículo es siempre una asesora real del equipo — mismo
  // hook que usa la página /nosotros/equipo, ahora centralizado aquí igual
  // que el resto de datos del formulario (categorías, medios, etc.).
  const { advisors } = useAdminAdvisors();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Post modal state
  const [editingPost, setEditingPost] = useState<BlogPostDTO | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Foto de portada — mismo patrón (media: MediaAssetDTO) => {...}
  // usado hoy en useAdminPromotionsCatalog.ts / useAdminTestimonialsSection.ts.
  const [coverMediaId, setCoverMediaId] = useState<number | undefined>(undefined);
  const [coverMediaUrl, setCoverMediaUrl] = useState<string>("/media/demo-cartagena-caribe.webp");
  const [coverFocalX, setCoverFocalX] = useState<number | undefined>(undefined);
  const [coverFocalY, setCoverFocalY] = useState<number | undefined>(undefined);
  // El autor ya no es texto/foto libre: es una asesora real seleccionada en
  // el modal a partir de la lista `advisors` de arriba (ver BlogFormModal.tsx).
  const [authorAdvisorId, setAuthorAdvisorId] = useState<number | undefined>(undefined);

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
    setCoverMediaId(undefined);
    setCoverMediaUrl("/media/demo-cartagena-caribe.webp");
    setCoverFocalX(undefined);
    setCoverFocalY(undefined);
    setAuthorAdvisorId(undefined);
    setIsPostModalOpen(true);
  };

  const handleOpenEditPost = (post: BlogPostDTO) => {
    setEditingPost(post);
    setCoverMediaId(post.coverMediaId);
    setCoverMediaUrl(post.coverMediaUrl || "");
    setCoverFocalX(post.coverFocalX);
    setCoverFocalY(post.coverFocalY);
    setAuthorAdvisorId(post.authorAdvisorId);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setEditingPost(null);
  };

  const handleCoverSelect = (media: MediaAssetDTO) => {
    setCoverMediaId(media.id);
    setCoverMediaUrl(media.storagePath);
    setCoverFocalX(media.focalX || 50);
    setCoverFocalY(media.focalY || 50);
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

  return {
    posts,
    categories,
    advisors,
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
    coverMediaId,
    coverMediaUrl,
    coverFocalX,
    coverFocalY,
    authorAdvisorId,
    setAuthorAdvisorId,
    handleCoverSelect,
    handleOpenCreatePost,
    handleOpenEditPost,
    handleClosePostModal,
    handleSavePost,
    handleDeletePost,
    loadData,
  };
}
