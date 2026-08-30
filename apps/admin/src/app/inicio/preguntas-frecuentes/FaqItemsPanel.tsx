"use client";

import React from "react";
import type { FaqItemDTO } from "@vc/api-client";
import { Button, EditIcon, FormFeedback, PlusIcon, TrashIcon } from "@vc/ui";
import { useAdminFaqItems } from "../../../hooks/useAdminFaqItems";
import { FaqFormModal } from "./FaqFormModal";

export interface FaqItemsPanelProps {
  initialFaqs: FaqItemDTO[];
}

export function FaqItemsPanel({ initialFaqs }: FaqItemsPanelProps) {
  const {
    faqs,
    saving,
    feedback,
    isFaqModalOpen, setIsFaqModalOpen,
    editingFaq,
    question, setQuestion,
    answer, setAnswer,
    category, setCategory,
    faqDisplayOrder, setFaqDisplayOrder,
    faqActive, setFaqActive,
    openCreateFaq, openEditFaq,
    handleSaveFaq, handleDeleteFaq,
  } = useAdminFaqItems(initialFaqs);

  return (
    <div className="font-inter">
      <FormFeedback feedback={feedback} />

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">
              Preguntas Frecuentes
            </h2>
            <p className="mt-1.5 font-inter text-[13px] text-neutral-muted">
              {faqs.length} preguntas en el acordeón de Inicio.
            </p>
          </div>
          <Button variant="primary" size="sm" icon={<PlusIcon size={16} />} iconPosition="left" onClick={openCreateFaq}>
            Nueva FAQ
          </Button>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-neutral-border bg-white shadow-[0_8px_24px_rgba(17,34,48,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-admin-divider bg-neutral-soft text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Pregunta Frecuente</th>
                  <th className="px-6 py-4">Respuesta</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-divider">
                {faqs.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-neutral-soft">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-[6px] border border-brand-blue/25 bg-brand-blue/10 px-2.5 py-1 text-xs font-bold text-brand-blue">
                        {item.category || "General"}
                      </span>
                    </td>
                    <td className="max-w-xs px-6 py-4 text-sm font-bold text-admin-value">{item.question}</td>
                    <td className="line-clamp-2 max-w-sm px-6 py-4 text-xs text-neutral-muted">{item.answer}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          item.active
                            ? "border-brand-navy/20 bg-brand-navy/10 text-brand-navy"
                            : "border-neutral-border bg-neutral-soft text-neutral-muted"
                        }`}
                      >
                        {item.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" icon={<EditIcon size={14} />} onClick={() => openEditFaq(item)}>
                          Editar
                        </Button>
                        <Button variant="danger" size="sm" icon={<TrashIcon size={14} />} onClick={() => handleDeleteFaq(item.id)}>
                          Desactivar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FaqFormModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        onSubmit={handleSaveFaq}
        isEditing={!!editingFaq}
        saving={saving}
        question={question}
        setQuestion={setQuestion}
        answer={answer}
        setAnswer={setAnswer}
        category={category}
        setCategory={setCategory}
        displayOrder={faqDisplayOrder}
        setDisplayOrder={setFaqDisplayOrder}
        active={faqActive}
        setActive={setFaqActive}
      />
    </div>
  );
}
