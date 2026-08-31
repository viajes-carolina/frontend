"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { PublishRequestDTO, PublishResponseDTO } from "@vc/api-client";
import type { FormFeedbackState } from "../forms/FormFeedback";

export interface PublishTarget {
  value: string;
  label: string;
  description: string;
}

export const PUBLISH_TARGETS: PublishTarget[] = [
  {
    value: "ALL",
    label: "Todo el Sitio",
    description:
      "Revalida todas las páginas públicas (Home, Promociones, Blog, Nosotros, Contacto, Reclamaciones)",
  },
  {
    value: "HOME",
    label: "Portada & Hero",
    description: "Revalida Hero, Promociones destacadas, Blog y Testimonios",
  },
  {
    value: "PROMOTIONS",
    label: "Catálogo de Promociones",
    description:
      "Revalida las promociones destacadas mostradas en Inicio (el catálogo completo vive en Facebook)",
  },
  {
    value: "BLOG",
    label: "Blog & Contenidos",
    description: "Revalida artículos, categorías e inspiración del blog",
  },
  {
    value: "ABOUT",
    label: "Nosotros & Asesoras",
    description: "Revalida historia institucional y perfiles de asesoras",
  },
  {
    value: "CONTACT",
    label: "Contacto & Soporte",
    description: "Revalida canales directos y enlaces de oficina",
  },
];

export interface UsePublishingManagerOptions {
  lastPublishStatus: PublishResponseDTO | null;
  onPublish: (req: PublishRequestDTO) => Promise<PublishResponseDTO>;
}

/**
 * Estado del panel de publicación ISR (ámbito elegido, motivo, envío y
 * resultado). Vive fuera de `PublishingManagerCard.tsx` para que ese archivo
 * quede como plantilla JSX pura.
 */
export function usePublishingManager({ lastPublishStatus, onPublish }: UsePublishingManagerOptions) {
  const [selectedTarget, setSelectedTarget] = useState<string>("ALL");
  const [reason, setReason] = useState<string>("");
  /**
   * Resultado de la publicación disparada EN ESTA SESIÓN. Antes el estado se
   * inicializaba con `lastPublishStatus` y ahí se quedaba: la pantalla monta
   * con `null` (la petición del estado va en vuelo) y `useState` solo lee su
   * valor inicial una vez, así que el bloque "Estado de la última publicación"
   * no aparecía jamás hasta publicar a mano. Guardando solo lo propio y
   * cayendo en la prop, el estado servido se ve en cuanto llega y el resultado
   * recién disparado lo sustituye.
   */
  const [ownResult, setOwnResult] = useState<PublishResponseDTO | null>(null);
  const publishResult = ownResult ?? lastPublishStatus;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const res = await onPublish({
        target: selectedTarget,
        reason: reason.trim() || "Actualización de contenidos desde panel de gobernanza",
      });
      setOwnResult(res);
      setReason("");
      setFeedback({ tone: "success", message: res.message || "Publicación disparada correctamente." });
    } catch (err) {
      setFeedback({
        tone: "error",
        message: err instanceof Error ? err.message : "Error al disparar la publicación ISR.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    targets: PUBLISH_TARGETS,
    selectedTarget,
    setSelectedTarget,
    reason,
    setReason,
    publishResult,
    submitting,
    feedback,
    handleSubmit,
  };
}
