"use client";

import React from "react";
import { FaqItemDTO } from "@vc/api-client";
import { Button, PlusIcon, EditIcon, TrashIcon, CheckIcon } from "@vc/ui";
import { useAdminFaqItems } from "../../../../hooks/useAdminFaqItems";
import { FaqFormModal } from "../FaqFormModal";

export interface FaqItemsPanelProps {
  initialFaqs: FaqItemDTO[];
}

export function FaqItemsPanel({ initialFaqs }: FaqItemsPanelProps) {
  const {
    faqs,
    statusMessage,
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
    <div className="space-y-6">
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Preguntas Frecuentes</h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            {faqs.length} preguntas en el acordeón de Inicio.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<PlusIcon size={18} />} onClick={openCreateFaq}>
          Nueva FAQ
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-border bg-neutral-surface/50 text-[11px] font-sora font-bold text-neutral-muted uppercase tracking-wider">
                <th className="py-4 px-6">Categoría</th>
                <th className="py-4 px-6">Pregunta Frecuente</th>
                <th className="py-4 px-6">Respuesta</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {faqs.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-surface/30 transition-colors">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-blue/10 text-brand-blue font-sora text-xs font-bold border border-brand-blue/20">
                      {item.category || "General"}
                    </span>
                  </td>
                  <td className="py-4 px-6 max-w-xs font-sora font-bold text-sm text-brand-navy">
                    {item.question}
                  </td>
                  <td className="py-4 px-6 max-w-sm font-inter text-xs text-neutral-muted line-clamp-2">
                    {item.answer}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-neutral-surface text-neutral-muted border border-neutral-border"
                      }`}
                    >
                      {item.active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
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

      <FaqFormModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        onSubmit={handleSaveFaq}
        isEditing={!!editingFaq}
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
