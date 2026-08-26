"use client";

import React from "react";
import { Button, FormField } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";
import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";

export function HistoriaForm() {
  const {
    formData,
    storyMediaUrl,
    loading,
    saving,
    feedbackMessage,
    updateField,
    handleSelectStoryMedia,
    newValueText,
    setNewValueText,
    addValue,
    removeValue,
    handleSave,
  } = useAdminAbout();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-neutral-border shadow-sm animate-pulse space-y-4 max-w-4xl">
        <div className="h-6 bg-neutral-border rounded w-1/4"></div>
        <div className="h-10 bg-neutral-border rounded"></div>
        <div className="h-20 bg-neutral-border rounded"></div>
      </div>
    );
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
        <h2 className="font-sora font-bold text-lg text-brand-navy">2. Historia & Principios</h2>

        <HeroPhotoSlot
          variant="main"
          label="Foto de la Historia"
          mediaId={formData.storyMediaId}
          mediaUrl={storyMediaUrl}
          focalX={formData.storyFocalX}
          focalY={formData.storyFocalY}
          onSelect={handleSelectStoryMedia}
          modalTitle="Seleccionar Foto de la Historia"
        />

        <div>
          <FormField
            label="Título de la Historia"
            type="text"
            value={formData.storyTitle}
            onChange={(e) => updateField("storyTitle", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Cuerpo / Narrativa de la Historia"
            multiline
            rows={4}
            value={formData.storyBody}
            onChange={(e) => updateField("storyBody", e.target.value)}
            required
          />
        </div>

        {/* Valores */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-muted uppercase">
            Principios / Valores Rectores
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newValueText}
              onChange={(e) => setNewValueText(e.target.value)}
              placeholder="Ej: Acompañamiento 24/7 sin letra chica"
              className="flex-1 bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <Button type="button" variant="secondary" onClick={addValue} className="!py-2 text-xs">
              + Agregar
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.values.map((val, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-soft text-brand-navy text-xs border border-neutral-border"
              >
                {val}
                <button
                  type="button"
                  onClick={() => removeValue(idx)}
                  className="text-neutral-muted hover:text-red-500 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={saving}>
            Guardar Historia
          </Button>
        </div>
      </div>
    </>
  );
}
