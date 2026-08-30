"use client";

import React from "react";
import { Button, FormField, Modal, Toggle } from "@vc/ui";

export interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  saving?: boolean;
  question: string;
  setQuestion: (val: string) => void;
  answer: string;
  setAnswer: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  displayOrder: number;
  setDisplayOrder: (val: number) => void;
  active: boolean;
  setActive: (val: boolean) => void;
}

export function FaqFormModal({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  saving = false,
  question,
  setQuestion,
  answer,
  setAnswer,
  category,
  setCategory,
  displayOrder,
  setDisplayOrder,
  active,
  setActive,
}: FaqFormModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      title={isEditing ? "Editar Pregunta Frecuente" : "Nueva Pregunta Frecuente (FAQ)"}
      description="Añade respuestas claras para resolver dudas recurrentes de los viajeros."
      onClose={onClose}
      closeLabel="Cerrar formulario de pregunta frecuente"
    >
      <form onSubmit={onSubmit}>
        <div className="space-y-5">
          <FormField
            label="Pregunta Frecuente"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="¿La asesoría para cotizar mi viaje tiene algún costo?"
            required
          />

          <FormField
            label="Respuesta Detallada"
            multiline
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="No, nuestra asesoría personalizada por WhatsApp o en oficina es 100% gratuita..."
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Categoría"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Asesoría y Cotización"
              required
            />
            <FormField
              label="Orden de Visualización"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              min={0}
              required
            />
          </div>

          <Toggle
            checked={active}
            onChange={setActive}
            label="Pregunta activa y visible en el acordeón"
          />
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-admin-divider pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Pregunta"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
