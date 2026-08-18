"use client";

import React from "react";
import { Button, CloseIcon } from "@vc/ui";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-border p-6 sm:p-8 space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
          <div>
            <h2 className="font-sora font-bold text-xl text-brand-navy">
              {isEditing ? "Editar Pregunta Frecuente" : "Nueva Pregunta Frecuente (FAQ)"}
            </h2>
            <p className="font-inter text-xs text-neutral-muted mt-0.5">
              Añade respuestas claras para resolver dudas recurrentes de los viajeros.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-muted hover:text-brand-navy hover:bg-neutral-surface transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Pregunta Frecuente
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿La asesoría para cotizar mi viaje tiene algún costo?"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Respuesta Detallada
            </label>
            <textarea
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="No, nuestra asesoría personalizada por WhatsApp o en oficina es 100% gratuita..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Categoría
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Asesoría y Cotización"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Orden de Visualización
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
      </div>
    </div>
  );
}
