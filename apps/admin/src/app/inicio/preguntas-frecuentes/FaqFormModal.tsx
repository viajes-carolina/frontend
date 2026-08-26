"use client";

import React from "react";
import { Button, FormField, Modal } from "@vc/ui";

export interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
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
    >
      {/* Form Body */}
      <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <FormField
              label="Pregunta Frecuente"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿La asesoría para cotizar mi viaje tiene algún costo?"
              required
            />
          </div>

          <div>
            <FormField
              label="Respuesta Detallada"
              multiline
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="No, nuestra asesoría personalizada por WhatsApp o en oficina es 100% gratuita..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Categoría"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Asesoría y Cotización"
                required
              />
            </div>

            <div>
              <FormField
                label="Orden de Visualización"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                min={0}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeFaqCheckbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="activeFaqCheckbox" className="font-inter text-sm text-brand-navy font-medium cursor-pointer">
              Pregunta activa y visible en el acordeón
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-border">
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Pregunta"}
            </Button>
          </div>
        </form>
    </Modal>
  );
}
