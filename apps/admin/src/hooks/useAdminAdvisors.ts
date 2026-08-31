"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TravelAdvisorDTO,
  CreateOrUpdateAdvisorRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";
import { useConfirmDialog, type FormFeedbackState } from "@vc/ui";

/**
 * `PUT /admin/v1/advisors/{id}` reemplaza el registro completo (no es un
 * PATCH): si un campo no viaja, se guarda vacío. Por eso cualquier cambio
 * puntual desde la lista —visibilidad u orden— tiene que reenviar el perfil
 * entero tal y como se cargó, con el único campo modificado encima.
 */
function toAdvisorPayload(
  advisor: TravelAdvisorDTO,
  overrides: Partial<CreateOrUpdateAdvisorRequest>
): CreateOrUpdateAdvisorRequest {
  return {
    fullName: advisor.fullName,
    roleTitle: advisor.roleTitle,
    specialty: advisor.specialty,
    bio: advisor.bio,
    quote: advisor.quote,
    photoMediaId: advisor.photoMediaId,
    whatsappPhone: advisor.whatsappPhone,
    whatsappMessageTemplate: advisor.whatsappMessageTemplate,
    displayOrder: advisor.displayOrder,
    active: advisor.active,
    ...overrides,
  };
}

/**
 * Nueva numeración 1..N tras mover una asesora una posición. Devuelve solo las
 * que cambian de valor, que en una lista ya normalizada son exactamente dos;
 * en una lista con huecos o empates (10, 20, 20) son más, y esa renumeración
 * es justamente lo que hace que el siguiente movimiento sea inequívoco —
 * `displayOrder` repetido deja el orden en manos del `id`, y un intercambio de
 * valores iguales no movería nada.
 */
function planReorder(
  advisors: TravelAdvisorDTO[],
  index: number,
  direction: -1 | 1
): { advisor: TravelAdvisorDTO; displayOrder: number }[] | null {
  const target = index + direction;
  if (index < 0 || target < 0 || target >= advisors.length) return null;

  const next = [...advisors];
  [next[index], next[target]] = [next[target], next[index]];

  return next
    .map((advisor, position) => ({ advisor, displayOrder: position + 1 }))
    .filter(({ advisor, displayOrder }) => advisor.displayOrder !== displayOrder);
}

export function useAdminAdvisors() {
  const [advisors, setAdvisors] = useState<TravelAdvisorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // El fallo de carga NO va al banner de feedback: ese se limpia solo a los 4
  // segundos y dejaba la pantalla en blanco sin explicación ni salida. Es un
  // estado de la región, y persiste hasta que un reintento lo resuelva.
  const [loadError, setLoadError] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  // Escrituras lanzadas DESDE la lista (visibilidad y orden). Bloquean los
  // controles de todas las tarjetas, no solo los de la afectada: mover una
  // asesora renumera a las demás, y encadenar dos movimientos sobre un listado
  // que todavía no se ha recargado enviaría posiciones calculadas sobre datos
  // viejos.
  const [listBusy, setListBusy] = useState(false);
  const deleteConfirmation = useConfirmDialog();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<TravelAdvisorDTO | null>(null);

  // Estado de la foto de perfil — mismo patrón (media: MediaAssetDTO) => {...}
  // ya usado en useAdminBlog.ts para portada/avatar.
  const [photoMediaId, setPhotoMediaId] = useState<number | undefined>(undefined);
  const [photoMediaUrl, setPhotoMediaUrl] = useState<string | undefined>(undefined);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const data = await apiClient.getAdminAdvisors();
      setAdvisors(data);
    } catch (err) {
      console.error("Error loading advisors:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateAdvisor = () => {
    setEditingAdvisor(null);
    setPhotoMediaId(undefined);
    setPhotoMediaUrl(undefined);
    setIsModalOpen(true);
  };

  const openEditAdvisor = (advisor: TravelAdvisorDTO) => {
    setEditingAdvisor(advisor);
    setPhotoMediaId(advisor.photoMediaId);
    setPhotoMediaUrl(advisor.photoMediaUrl);
    setIsModalOpen(true);
  };

  const closeAdvisorModal = () => {
    setIsModalOpen(false);
    setEditingAdvisor(null);
  };

  const handleSelectPhoto = (media: MediaAssetDTO) => {
    setPhotoMediaId(media.id);
    setPhotoMediaUrl(media.storagePath);
  };

  const handleSaveAdvisor = async (payload: CreateOrUpdateAdvisorRequest) => {
    try {
      setSaving(true);
      if (editingAdvisor) {
        await apiClient.updateAdvisor(editingAdvisor.id, payload);
        showFeedback("Asesora actualizada correctamente.");
      } else {
        await apiClient.createAdvisor(payload);
        showFeedback("Nueva asesora agregada al equipo.");
      }
      closeAdvisorModal();
      await loadData();
    } catch (err) {
      console.error("Error saving advisor:", err);
      showFeedback("Error al guardar la asesora.", "error");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Visibilidad desde la propia tarjeta. Escribe de verdad: es el mismo campo
   * `active` que edita el modal, por el mismo endpoint. Antes solo se podía
   * cambiar abriendo el formulario completo.
   */
  const setAdvisorActive = async (advisor: TravelAdvisorDTO, active: boolean) => {
    try {
      setListBusy(true);
      await apiClient.updateAdvisor(advisor.id, toAdvisorPayload(advisor, { active }));
      showFeedback(
        active
          ? `"${advisor.fullName}" vuelve a mostrarse en la página pública.`
          : `"${advisor.fullName}" ya no se muestra en la página pública.`
      );
      await loadData();
    } catch (err) {
      console.error("Error updating advisor visibility:", err);
      showFeedback(
        `No se pudo cambiar la visibilidad de "${advisor.fullName}". Su perfil sigue como estaba.`,
        "error"
      );
      await loadData();
    } finally {
      setListBusy(false);
    }
  };

  /**
   * Sube o baja una asesora una posición. No hay endpoint de reordenamiento en
   * lote: se envía un PUT por cada perfil cuya posición cambia, uno detrás de
   * otro. Si uno falla a media tanda el orden queda a medias, así que el
   * mensaje dice cuántos se aplicaron y la lista se recarga para mostrar el
   * estado real del servidor en vez de la posición que se pidió.
   */
  const moveAdvisor = async (advisor: TravelAdvisorDTO, direction: -1 | 1) => {
    const index = advisors.findIndex((item) => item.id === advisor.id);
    const plan = planReorder(advisors, index, direction);
    if (!plan || plan.length === 0) return;

    let applied = 0;
    try {
      setListBusy(true);
      for (const step of plan) {
        await apiClient.updateAdvisor(step.advisor.id, toAdvisorPayload(step.advisor, { displayOrder: step.displayOrder }));
        applied += 1;
      }
      showFeedback(`"${advisor.fullName}" ahora ocupa la posición ${index + 1 + direction}.`);
    } catch (err) {
      console.error("Error reordering advisors:", err);
      showFeedback(
        `El nuevo orden se aplicó solo en parte (${applied} de ${plan.length} perfiles). Revisa las posiciones y vuelve a intentarlo.`,
        "error"
      );
    } finally {
      await loadData();
      setListBusy(false);
    }
  };

  const deleteAdvisor = async (advisor: TravelAdvisorDTO) => {
    try {
      setSaving(true);
      await apiClient.deleteAdvisor(advisor.id);
      showFeedback(`"${advisor.fullName}" ya no forma parte del equipo.`);
      await loadData();
    } catch (err) {
      console.error("Error deleting advisor:", err);
      showFeedback(`No se pudo eliminar a "${advisor.fullName}". Su perfil sigue en el equipo.`, "error");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Antes preguntaba con `window.confirm("¿Estás seguro…esta asesora?")`: sin
   * marca, sin foco controlado y sin nombrar a quién se iba a borrar. La regla
   * de la guía pide lo contrario — "la consecuencia y el objeto afectado deben
   * aparecer explícitamente" — así que el título nombra a la asesora y el
   * cuerpo dice qué pasa y que no hay vuelta atrás.
   */
  const handleDeleteAdvisor = (advisor: TravelAdvisorDTO) => {
    deleteConfirmation.ask({
      title: `¿Eliminar a "${advisor.fullName}"?`,
      description:
        "Esta acción quitará su perfil del equipo y dejará de mostrarse en el sitio público. No se puede deshacer.",
      confirmLabel: "Sí, eliminar",
      busyLabel: "Eliminando…",
      onConfirm: () => deleteAdvisor(advisor),
    });
  };

  // Forma única que consume `FormFeedback` (aporta el `role="status"` que el
  // banner anterior no tenía; además usaba tonos oscuros sobre fondo claro).
  const feedback = useMemo<FormFeedbackState | null>(
    () => (feedbackMessage ? { tone: feedbackMessage.type, message: feedbackMessage.text } : null),
    [feedbackMessage]
  );

  return {
    advisors,
    loading,
    loadError,
    saving,
    /** Hay una escritura en curso lanzada desde la lista (visibilidad u orden). */
    listBusy,
    feedback,
    /** Props para `<ConfirmDialog {...deleteConfirmation} />`. */
    deleteConfirmation: deleteConfirmation.dialogProps,
    isModalOpen,
    editingAdvisor,
    photoMediaId,
    photoMediaUrl,
    handleSelectPhoto,
    openCreateAdvisor,
    openEditAdvisor,
    closeAdvisorModal,
    handleSaveAdvisor,
    handleDeleteAdvisor,
    setAdvisorActive,
    moveAdvisor,
    reload: loadData,
  };
}
