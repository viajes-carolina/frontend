"use client";

import React from "react";
import type { FaqItemDTO } from "@vc/api-client";
import { ConfirmDialog, FormFeedback } from "@vc/ui";
import { AdminDataTable, useDataTable } from "../../../components/table";
import { useAdminFaqItems } from "../../../hooks/useAdminFaqItems";
import { FaqFormModal } from "./FaqFormModal";
import { buildFaqColumns, buildFaqFilters, searchInFaq } from "./faqItemsTable";

export interface FaqItemsPanelProps {
  initialFaqs: FaqItemDTO[];
}

export function FaqItemsPanel({ initialFaqs }: FaqItemsPanelProps) {
  const {
    faqs,
    loading,
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
    deactivateConfirmation,
  } = useAdminFaqItems(initialFaqs);

  const filters = React.useMemo(() => buildFaqFilters(faqs), [faqs]);

  const table = useDataTable<FaqItemDTO>({
    rows: faqs,
    getRowId: (faq) => String(faq.id),
    searchIn: searchInFaq,
    filters,
  });

  const columns = React.useMemo(
    () => buildFaqColumns({ onEdit: openEditFaq, onDeactivate: handleDeleteFaq }),
    [openEditFaq, handleDeleteFaq]
  );

  return (
    <div className="font-inter">
      <FormFeedback feedback={feedback} />

      <div className="space-y-4">
        <div>
          <h2 className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">
            Preguntas Frecuentes
          </h2>
          <p className="mt-1.5 font-inter text-[13px] text-neutral-muted">
            Las preguntas activas se muestran en el acordeón de Inicio, en el orden que indiques.
          </p>
        </div>

        <AdminDataTable
          controller={table}
          columns={columns}
          caption="Preguntas frecuentes de la portada"
          loading={loading}
          searchPlaceholder="Buscar por pregunta, respuesta o categoría…"
          searchLabel="Buscar entre las preguntas frecuentes"
          createAction={{ label: "Nueva FAQ", onSelect: openCreateFaq }}
          itemNoun="preguntas"
          minWidthClassName="min-w-[860px]"
          getRowLabel={(faq) => `«${faq.question}»`}
          emptyState={{
            title: "Aún no hay preguntas frecuentes",
            description:
              "Crea la primera pregunta para que el acordeón de Inicio resuelva las dudas antes de que alguien escriba.",
            action: { label: "Nueva FAQ", onSelect: openCreateFaq },
          }}
          noResultsState={{
            title: "Ninguna pregunta coincide",
            description:
              "No hay preguntas para esta búsqueda o categoría. Las demás siguen guardadas: quita el filtro para volver a verlas.",
          }}
        />
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

      <ConfirmDialog {...deactivateConfirmation} />
    </div>
  );
}
