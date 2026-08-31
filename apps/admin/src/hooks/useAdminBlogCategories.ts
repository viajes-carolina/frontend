"use client";

import { useState, useEffect } from "react";
import { useConfirmDialog, type FormFeedbackState } from "@vc/ui";
import {
  BlogCategoryDTO,
  CreateOrUpdateBlogCategoryRequest,
  apiClient,
} from "@vc/api-client";

export function useAdminBlogCategories(initialCategories: BlogCategoryDTO[]) {
  const [categories, setCategories] = useState<BlogCategoryDTO[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Antes era un `statusMessage: string` único, así que los mensajes de error
  // se pintaban en el banner verde de éxito. El tono los distingue.
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);
  const showSuccess = (message: string) => setFeedback({ tone: "success", message });
  const showError = (message: string) => setFeedback({ tone: "error", message });
  const deactivateConfirmation = useConfirmDialog();

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
    setFeedback(null);

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
        showSuccess("Categoría actualizada con éxito.");
      } else {
        await apiClient.createBlogCategory(payload);
        showSuccess("Categoría creada con éxito.");
      }
      resetForm();
      await refreshData();
    } catch (err) {
      console.error(err);
      showError("Error al guardar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  const deactivateCategory = async (category: BlogCategoryDTO) => {
    try {
      setSaving(true);
      await apiClient.deleteBlogCategory(category.id);
      showSuccess(`La categoría "${category.name}" quedó desactivada.`);
      await refreshData();
    } catch (err) {
      console.error(err);
      showError(`No se pudo desactivar "${category.name}". Sigue activa.`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Antes preguntaba con `confirm("¿Estás seguro de desactivar esta
   * categoría?")`, sin decir cuál ni qué implicaba. La guía exige nombrar el
   * objeto y su consecuencia: desactivar no borra la categoría ni los
   * artículos que cuelgan de ella, solo la retira del sitio público, y eso es
   * lo que el cuerpo cuenta.
   */
  const handleDeleteCategory = (category: BlogCategoryDTO) => {
    deactivateConfirmation.ask({
      title: `¿Desactivar la categoría "${category.name}"?`,
      description:
        "Dejará de ofrecerse como filtro en el blog público. Los artículos que ya la usan no se borran, pero quedarán sin categoría visible hasta que la reactives.",
      confirmLabel: "Sí, desactivar",
      busyLabel: "Desactivando…",
      onConfirm: () => deactivateCategory(category),
    });
  };

  return {
    categories,
    /** Props para `<ConfirmDialog {...deactivateConfirmation} />`. */
    deactivateConfirmation: deactivateConfirmation.dialogProps,
    isLoading,
    saving,
    feedback,
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
