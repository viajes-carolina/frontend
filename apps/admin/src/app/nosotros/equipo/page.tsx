"use client";

import React from "react";
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
      <div className="border-b border-slate-800 pb-6">
        <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
          Nosotros — Equipo de Asesoras
        </h1>
        <p className="font-inter text-sm text-slate-400 mt-1">
          Administra los perfiles del equipo, su cita personal y sus canales de WhatsApp directo.
        </p>
      </div>

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
        <div className="p-8 text-center text-slate-400">
          <p className="font-sora text-sm">Cargando equipo de asesoras...</p>
        </div>
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
