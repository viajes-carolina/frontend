"use client";

import { useState, useEffect } from "react";
import {
  BlogCategoryDTO,
  CreateOrUpdateBlogCategoryRequest,
  apiClient,
} from "@vc/api-client";

export function useAdminBlogCategories(initialCategories: BlogCategoryDTO[]) {
  const [categories, setCategories] = useState<BlogCategoryDTO[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [name, setNameRaw] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [active, setActive] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const list = await apiClient.getBlogCategories(true);
      setCategories(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const resetForm = () => {
    setEditingCategoryId(null);
    setNameRaw("");
    setSlug("");
    setDescription("");
    setDisplayOrder(categories.length + 1);
    setActive(true);
  };

  // Al escribir el nombre de una categoría nueva, sugiere el slug automáticamente
  // (mismo comportamiento que tenía el CategoryManagerModal original). Al editar
  // una categoría existente, el slug ya guardado no se vuelve a generar solo.
  const setName = (val: string) => {
    setNameRaw(val);
    if (!editingCategoryId) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const startEditCategory = (cat: BlogCategoryDTO) => {
    setEditingCategoryId(cat.id);
    setNameRaw(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDisplayOrder(cat.displayOrder);
    setActive(cat.active);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const payload: CreateOrUpdateBlogCategoryRequest = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      displayOrder: Number(displayOrder),
      active,
    };

    try {
      setSaving(true);
      if (editingCategoryId) {
        await apiClient.updateBlogCategory(editingCategoryId, payload);
        setStatusMessage("Categoría actualizada con éxito.");
      } else {
        await apiClient.createBlogCategory(payload);
        setStatusMessage("Categoría creada con éxito.");
      }
      resetForm();
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al guardar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Estás seguro de desactivar esta categoría?")) return;
    try {
      setSaving(true);
      await apiClient.deleteBlogCategory(id);
      setStatusMessage("Categoría desactivada.");
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al desactivar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  return {
    categories,
    isLoading,
    saving,
    statusMessage,
    editingCategoryId,
    name, setName,
    slug, setSlug,
    description, setDescription,
    displayOrder, setDisplayOrder,
    active, setActive,
    startEditCategory,
    resetForm,
    handleSaveCategory,
    handleDeleteCategory,
  };
}
