"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BlogPostDTO,
  BlogCategoryDTO,
  CreateOrUpdateBlogPostRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";
import { useConfirmDialog, type FormFeedbackState } from "@vc/ui";
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
  // El fallo de CARGA no va al banner de feedback (que es efímero y sin salida):
  // es el estado de la región y se resuelve con `RetryableError`, igual que en
  // useAdminAdvisors. El feedback queda para el resultado de las acciones.
  const [loadError, setLoadError] = useState(false);
  // Mismo contrato que el resto de paneles migrados (useAdminFaqItems,
  // useAdminBlogCategories): un solo valor que consume `FormFeedback`.
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);
  const archiveConfirmation = useConfirmDialog();

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

  /**
   * Carga el listado ENTERO una sola vez.
   *
   * Antes buscaba y filtraba en el servidor, con `statusFilter` y `searchQuery`
   * dentro de las dependencias: cada tecla del buscador disparaba una petición
   * y un `loading` que vaciaba la tabla. Ahora buscar, filtrar y paginar los
   * resuelve el kit de tabla en el cliente sobre estas filas.
   *
   * `size: 200` es el techo de ese trato. La pantalla anterior pedía 50 sin
   * paginar —así que solo se veían los 50 más recientes y no había forma de
   * llegar al resto—, de modo que subirlo es una mejora estricta; si algún día
   * el blog pasa de 200 artículos habrá que volver a paginar contra el servidor.
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const [fetchedPosts, fetchedCategories] = await Promise.all([
        apiClient.getAdminBlogPosts(undefined, undefined, 0, 200),
        apiClient.getBlogCategories(true),
      ]);
      setPosts(fetchedPosts);
      setCategories(fetchedCategories);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

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
        setFeedback({ tone: "success", message: "Artículo actualizado con éxito." });
      } else {
        await apiClient.createBlogPost(req);
        setFeedback({ tone: "success", message: "Artículo creado con éxito." });
      }
      handleClosePostModal();
      await loadData();
    } catch {
      setFeedback({ tone: "error", message: "Error al guardar el artículo." });
    } finally {
      setSaving(false);
    }
  };

  const archivePost = async (post: BlogPostDTO) => {
    try {
      setSaving(true);
      await apiClient.deleteBlogPost(post.id);
      setFeedback({ tone: "success", message: `"${post.title}" quedó archivado.` });
      await loadData();
    } catch {
      setFeedback({
        tone: "error",
        message: `No se pudo archivar "${post.title}". El artículo sigue como estaba.`,
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Antes preguntaba con `confirm("¿Estás seguro de archivar este artículo del
   * blog?")`: no decía CUÁL artículo. La regla de la guía —"la consecuencia y
   * el objeto afectado deben aparecer explícitamente"— pide lo contrario, así
   * que el título nombra el artículo y el cuerpo dice qué pasa.
   *
   * Archivar no es un borrado duro: el artículo sigue en el panel y puede
   * volver a publicarse desde su propio formulario. El cuerpo lo dice en vez
   * del "no se puede deshacer" de la plantilla, que aquí sería falso.
   */
  const handleDeletePost = (post: BlogPostDTO) => {
    archiveConfirmation.ask({
      title: `¿Archivar "${post.title}"?`,
      description:
        "El artículo dejará de verse en el blog público de inmediato. Seguirá en el panel y podrás volver a publicarlo desde su formulario de edición.",
      confirmLabel: "Sí, archivar",
      busyLabel: "Archivando…",
      onConfirm: () => archivePost(post),
    });
  };

  /**
   * Archivado en bloque de la selección de la tabla.
   *
   * No hay endpoint masivo, así que se archiva de uno en uno y se recarga UNA
   * sola vez al final: `archivePost` recargaría el listado entero tras cada
   * artículo. Los fallos se cuentan en vez de abortar — si el tercero de cinco
   * falla, los otros cuatro sí se archivaron y el banner tiene que decirlo.
   */
  const archivePosts = async (targets: readonly BlogPostDTO[]) => {
    let archived = 0;
    try {
      setSaving(true);
      for (const post of targets) {
        try {
          await apiClient.deleteBlogPost(post.id);
          archived += 1;
        } catch {
          /* Contabilizado abajo por diferencia. */
        }
      }
      const failed = targets.length - archived;
      setFeedback(
        failed === 0
          ? { tone: "success", message: `${archived} artículos quedaron archivados.` }
          : {
              tone: "error",
              message: `Se archivaron ${archived} de ${targets.length} artículos. Los ${failed} restantes siguen como estaban.`,
            }
      );
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  /**
   * Igual que la confirmación de una sola fila, pero el objeto afectado es el
   * conjunto: el título dice CUÁNTOS artículos se archivan, que es lo que la
   * persona necesita comprobar antes de decir que sí.
   */
  const handleArchiveSelection = (targets: readonly BlogPostDTO[]) => {
    if (targets.length === 0) return;
    if (targets.length === 1) {
      handleDeletePost(targets[0]);
      return;
    }

    archiveConfirmation.ask({
      title: `¿Archivar ${targets.length} artículos?`,
      description:
        "Todos dejarán de verse en el blog público de inmediato. Seguirán en el panel y podrás volver a publicarlos uno a uno desde su formulario de edición.",
      confirmLabel: `Sí, archivar ${targets.length}`,
      busyLabel: "Archivando…",
      onConfirm: () => archivePosts(targets),
    });
  };

  return {
    posts,
    categories,
    advisors,
    loading,
    loadError,
    saving,
    feedback,
    setFeedback,
    /** Props para `<ConfirmDialog {...archiveConfirmation} />`. */
    archiveConfirmation: archiveConfirmation.dialogProps,
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
    handleArchiveSelection,
    loadData,
  };
}
