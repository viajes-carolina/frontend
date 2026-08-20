"use client";

import React, { useState } from "react";
import { useAdminAbout } from "../../hooks/useAdminAbout";
import { useMediaPicker } from "../../hooks/useMediaPicker";
import { AboutForm } from "./AboutForm";
import { AdvisorList } from "./AdvisorList";
import { AdvisorFormModal } from "./AdvisorFormModal";
import { MediaPickerModal } from "@vc/ui";
import { MediaAssetDTO } from "@vc/api-client";

export default function AdminAboutPage() {
  const {
    aboutPage,
    advisors,
    loading,
    saving,
    activeTab,
    setActiveTab,
    isAdvisorModalOpen,
    editingAdvisor,
    mediaPickerTarget,
    setMediaPickerTarget,
    feedbackMessage,
    handleSavePage,
    handleSaveAdvisor,
    handleDeleteAdvisor,
    openCreateAdvisor,
    openEditAdvisor,
    closeAdvisorModal,
  } = useAdminAbout();

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const mediaPicker = useMediaPicker(isMediaPickerOpen);

  const handleOpenMediaPicker = (target: "hero" | "story" | "advisor") => {
    setMediaPickerTarget(target);
    setIsMediaPickerOpen(true);
  };

  const handleSelectMedia = (asset: MediaAssetDTO) => {
    if (!aboutPage && mediaPickerTarget !== "advisor") return;

    if (mediaPickerTarget === "hero" && aboutPage) {
      handleSavePage({
        heroBadge: aboutPage.heroBadge,
        heroTitle: aboutPage.heroTitle,
        heroSubtitle: aboutPage.heroSubtitle,
        heroMediaId: asset.id,
        storyTitle: aboutPage.storyTitle,
        storyBody: aboutPage.storyBody,
        storyMediaId: aboutPage.storyMediaId,
        missionTitle: aboutPage.missionTitle,
        missionBody: aboutPage.missionBody,
        visionTitle: aboutPage.visionTitle,
        visionBody: aboutPage.visionBody,
        values: aboutPage.values || [],
        experienceYears: aboutPage.experienceYears,
        happyTravelers: aboutPage.happyTravelers,
        destinationsCount: aboutPage.destinationsCount,
        satisfactionRatePercent: aboutPage.satisfactionRatePercent,
      });
    } else if (mediaPickerTarget === "story" && aboutPage) {
      handleSavePage({
        heroBadge: aboutPage.heroBadge,
        heroTitle: aboutPage.heroTitle,
        heroSubtitle: aboutPage.heroSubtitle,
        heroMediaId: aboutPage.heroMediaId,
        storyTitle: aboutPage.storyTitle,
        storyBody: aboutPage.storyBody,
        storyMediaId: asset.id,
        missionTitle: aboutPage.missionTitle,
        missionBody: aboutPage.missionBody,
        visionTitle: aboutPage.visionTitle,
        visionBody: aboutPage.visionBody,
        values: aboutPage.values || [],
        experienceYears: aboutPage.experienceYears,
        happyTravelers: aboutPage.happyTravelers,
        destinationsCount: aboutPage.destinationsCount,
        satisfactionRatePercent: aboutPage.satisfactionRatePercent,
      });
    } else if (mediaPickerTarget === "advisor" && editingAdvisor) {
      handleSaveAdvisor({
        fullName: editingAdvisor.fullName,
        roleTitle: editingAdvisor.roleTitle,
        specialty: editingAdvisor.specialty,
        bio: editingAdvisor.bio,
        photoMediaId: asset.id,
        whatsappPhone: editingAdvisor.whatsappPhone,
        whatsappMessageTemplate: editingAdvisor.whatsappMessageTemplate,
        displayOrder: editingAdvisor.displayOrder,
        active: editingAdvisor.active,
      });
    }

    setIsMediaPickerOpen(false);
    setMediaPickerTarget(null);
  };

  if (loading || !aboutPage) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="font-sora text-sm">Cargando información institucional de Nosotros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
            Nosotros & Asesoras
          </h1>
          <p className="font-inter text-sm text-slate-400 mt-1">
            Administra la historia, misión, visión, métricas institucionales y perfiles del equipo.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("page")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "page"
                ? "bg-brand-accent text-brand-navy shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Información Institucional
          </button>
          <button
            onClick={() => setActiveTab("advisors")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "advisors"
                ? "bg-brand-accent text-brand-navy shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Equipo de Asesoras ({advisors.length})
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
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

      {/* Tab Contents */}
      {activeTab === "page" ? (
        <AboutForm
          initialData={aboutPage}
          saving={saving}
          onSave={handleSavePage}
          onOpenMediaPicker={(t) => handleOpenMediaPicker(t)}
        />
      ) : (
        <AdvisorList
          advisors={advisors}
          onEdit={openEditAdvisor}
          onDelete={handleDeleteAdvisor}
          onCreate={openCreateAdvisor}
        />
      )}

      {/* Advisor Form Modal */}
      <AdvisorFormModal
        isOpen={isAdvisorModalOpen}
        advisor={editingAdvisor}
        saving={saving}
        onClose={closeAdvisorModal}
        onSave={handleSaveAdvisor}
        onOpenMediaPicker={() => handleOpenMediaPicker("advisor")}
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false);
          setMediaPickerTarget(null);
        }}
        onSelect={handleSelectMedia}
        title="Seleccionar Medio para Nosotros"
        items={mediaPicker.items}
        loading={mediaPicker.loading}
        onUploadFile={mediaPicker.uploadFile}
        onFocalPointSave={mediaPicker.saveFocalPoint}
      />
    </div>
  );
}
