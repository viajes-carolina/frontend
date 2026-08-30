"use client";

import React from "react";
import { CardsGridSkeleton, FormFeedback } from "@vc/ui";
import { useAdminAdvisors } from "../../../hooks/useAdminAdvisors";
import { AdvisorList } from "./AdvisorList";
import { AdvisorFormModal } from "./AdvisorFormModal";
import { AdvisorsHighlightsCard } from "./AdvisorsHighlightsCard";

export default function AdminAdvisorsPage() {
  const {
    advisors,
    loading,
    saving,
    feedback,
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
  } = useAdminAdvisors();

  return (
    <div className="space-y-8">
      <AdvisorsHighlightsCard />

      {/* El banner va agrupado con la lista y no como hijo directo del
          `space-y-8`: su región live sigue en el DOM aunque esté vacía, así
          que ahí dentro correría un margen muerto de 32px. */}
      <div>
        <FormFeedback feedback={feedback} className="max-w-5xl" />

        {loading ? (
          <CardsGridSkeleton cards={6} className="max-w-5xl" />
        ) : (
          <AdvisorList
            advisors={advisors}
            onEdit={openEditAdvisor}
            onDelete={handleDeleteAdvisor}
            onCreate={openCreateAdvisor}
          />
        )}
      </div>

      <AdvisorFormModal
        isOpen={isModalOpen}
        advisor={editingAdvisor}
        saving={saving}
        photoMediaId={photoMediaId}
        photoMediaUrl={photoMediaUrl}
        onSelectPhoto={handleSelectPhoto}
        onClose={closeAdvisorModal}
        onSave={handleSaveAdvisor}
      />
    </div>
  );
}
