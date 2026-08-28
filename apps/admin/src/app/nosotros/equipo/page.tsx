"use client";

import React from "react";
import { CardsGridSkeleton } from "@vc/ui";
import { useAdminAdvisors } from "../../../hooks/useAdminAdvisors";
import { AdvisorList } from "./AdvisorList";
import { AdvisorFormModal } from "./AdvisorFormModal";

export default function AdminAdvisorsPage() {
  const {
    advisors,
    loading,
    saving,
    feedbackMessage,
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
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedbackMessage.type === "success"
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
              : "bg-red-950/60 border-red-800 text-red-300"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

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
