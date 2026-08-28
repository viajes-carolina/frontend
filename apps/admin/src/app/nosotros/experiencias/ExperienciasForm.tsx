"use client";

import React from "react";
import { Button, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";
import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";

export function ExperienciasForm() {
  const {
    formData,
    momentsMediaUrl,
    loading,
    saving,
    feedbackMessage,
    updateField,
    handleSelectMomentsMedia,
    newMomentTitle,
    setNewMomentTitle,
    newMomentBody,
    setNewMomentBody,
    addMoment,
    removeMoment,
    handleSave,
  } = useAdminAbout();

  if (loading) {
    return <FormSkeleton className="max-w-4xl" />;
  }

  return (
    <>
      {feedbackMessage && (
        <div
          className={`mb-8 p-4 rounded-xl text-sm font-medium border ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
        <h2 className="font-sora font-bold text-lg text-brand-navy">5. Experiencias que humanizan</h2>

        <HeroPhotoSlot
          variant="main"
          label="Foto de Experiencias"
          mediaId={formData.momentsMediaId}
          mediaUrl={momentsMediaUrl}
          focalX={formData.momentsFocalX}
          focalY={formData.momentsFocalY}
          onSelect={handleSelectMomentsMedia}
          modalTitle="Seleccionar Foto de Experiencias que Humanizan"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Badge / Distintivo"
              type="text"
              value={formData.momentsBadge || ""}
              onChange={(e) => updateField("momentsBadge", e.target.value)}
            />
          </div>
          <div>
            <FormField
              label="Título de sección"
              type="text"
              value={formData.momentsTitle || ""}
              onChange={(e) => updateField("momentsTitle", e.target.value)}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Subtítulo"
            multiline
            rows={2}
            value={formData.momentsSubtitle || ""}
            onChange={(e) => updateField("momentsSubtitle", e.target.value)}
          />
        </div>

        {/* Moments */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-muted uppercase">
            Momentos numerados (título + descripción)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newMomentTitle}
              onChange={(e) => setNewMomentTitle(e.target.value)}
              placeholder="Título del momento"
              className="bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <input
              type="text"
              value={newMomentBody}
              onChange={(e) => setNewMomentBody(e.target.value)}
              placeholder="Descripción del momento"
              className="bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <Button type="button" variant="secondary" onClick={addMoment} className="!py-2 text-xs">
            + Agregar Momento
          </Button>

          <div className="space-y-2 pt-2">
            {formData.moments.map((moment, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-neutral-soft border border-neutral-border rounded-xl px-4 py-2.5"
              >
                <div>
                  <p className="text-brand-navy text-sm font-semibold">{moment.title}</p>
                  <p className="text-neutral-muted text-xs mt-0.5">{moment.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMoment(idx)}
                  className="text-neutral-muted hover:text-red-500 font-bold shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={saving}>
            Guardar Experiencias
          </Button>
        </div>
      </div>
    </>
  );
}
