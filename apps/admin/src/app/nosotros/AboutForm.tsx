"use client";

import React from "react";
import { Button, FormField } from "@vc/ui";
import { useAdminAbout } from "../../hooks/useAdminAbout";
import { HeroPhotoSlot } from "../../components/HeroPhotoSlot";

export function AboutForm() {
  const {
    formData,
    heroMediaUrl,
    storyMediaUrl,
    momentsMediaUrl,
    loading,
    saving,
    feedbackMessage,
    updateField,
    handleSelectHeroMedia,
    handleSelectStoryMedia,
    handleSelectMomentsMedia,
    newValueText,
    setNewValueText,
    addValue,
    removeValue,
    newJourneyStepText,
    setNewJourneyStepText,
    addJourneyStep,
    removeJourneyStep,
    newAccompanyStepTitle,
    setNewAccompanyStepTitle,
    newAccompanyStepBody,
    setNewAccompanyStepBody,
    addAccompanyStep,
    removeAccompanyStep,
    newMomentTitle,
    setNewMomentTitle,
    newMomentBody,
    setNewMomentBody,
    addMoment,
    removeMoment,
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
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-24">
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      {/* 1. Cabecera & Foto Principal */}
      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy">1. Cabecera & Foto Principal</h2>

        <HeroPhotoSlot
          variant="main"
          label="Foto del Hero"
          helperText="Foto real de viajeros — reemplaza a las estadísticas del diseño anterior."
          mediaId={formData.heroMediaId}
          mediaUrl={heroMediaUrl}
          focalX={formData.heroFocalX}
          focalY={formData.heroFocalY}
          onSelect={handleSelectHeroMedia}
          modalTitle="Seleccionar Foto del Hero de Nosotros"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Badge / Distintivo Superior"
              type="text"
              value={formData.heroBadge}
              onChange={(e) => updateField("heroBadge", e.target.value)}
              required
            />
          </div>

          <div>
            <FormField
              label="Nota flotante (tarjeta secundaria)"
              type="text"
              value={formData.heroNoteText || ""}
              onChange={(e) => updateField("heroNoteText", e.target.value)}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Título Principal (H1)"
            type="text"
            value={formData.heroTitle}
            onChange={(e) => updateField("heroTitle", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Subtítulo Descriptivo"
            multiline
            rows={2}
            value={formData.heroSubtitle}
            onChange={(e) => updateField("heroSubtitle", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Badge de la tarjeta flotante"
              type="text"
              value={formData.heroCardBadge || ""}
              onChange={(e) => updateField("heroCardBadge", e.target.value)}
            />
          </div>
          <div>
            <FormField
              label="Título de la tarjeta flotante"
              type="text"
              value={formData.heroCardTitle || ""}
              onChange={(e) => updateField("heroCardTitle", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. Historia & Principios */}
      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
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
      </div>

      {/* 3. Misión & Ruta "de idea a recuerdo" */}
      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy">
          3. Misión & Ruta &quot;de idea a recuerdo&quot;
        </h2>

        <div>
          <FormField
            label="Título Misión"
            type="text"
            value={formData.missionTitle}
            onChange={(e) => updateField("missionTitle", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Declaración de Misión"
            multiline
            rows={4}
            value={formData.missionBody}
            onChange={(e) => updateField("missionBody", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Cita Editorial"
            multiline
            rows={2}
            value={formData.missionQuote || ""}
            onChange={(e) => updateField("missionQuote", e.target.value)}
          />
        </div>

        {/* Journey Steps */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-muted uppercase">
            Pasos de la Ruta (4 pasos horizontales)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newJourneyStepText}
              onChange={(e) => setNewJourneyStepText(e.target.value)}
              placeholder="Ej: Escuchamos tu idea"
              className="flex-1 bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <Button type="button" variant="secondary" onClick={addJourneyStep} className="!py-2 text-xs">
              + Agregar
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.journeySteps.map((step, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-soft text-brand-navy text-xs border border-neutral-border"
              >
                {step.label}
                <button
                  type="button"
                  onClick={() => removeJourneyStep(idx)}
                  className="text-neutral-muted hover:text-red-500 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Cómo te acompañamos */}
      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy">4. Cómo te acompañamos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Badge / Distintivo"
              type="text"
              value={formData.accompanyBadge || ""}
              onChange={(e) => updateField("accompanyBadge", e.target.value)}
            />
          </div>
          <div>
            <FormField
              label="Título de sección"
              type="text"
              value={formData.accompanyTitle || ""}
              onChange={(e) => updateField("accompanyTitle", e.target.value)}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Subtítulo"
            multiline
            rows={2}
            value={formData.accompanySubtitle || ""}
            onChange={(e) => updateField("accompanySubtitle", e.target.value)}
          />
        </div>

        {/* Accompany Steps */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-muted uppercase">
            Pasos verticales (título + descripción)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newAccompanyStepTitle}
              onChange={(e) => setNewAccompanyStepTitle(e.target.value)}
              placeholder="Título del paso"
              className="bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <input
              type="text"
              value={newAccompanyStepBody}
              onChange={(e) => setNewAccompanyStepBody(e.target.value)}
              placeholder="Descripción del paso"
              className="bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <Button type="button" variant="secondary" onClick={addAccompanyStep} className="!py-2 text-xs">
            + Agregar Paso
          </Button>

          <div className="space-y-2 pt-2">
            {formData.accompanySteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-neutral-soft border border-neutral-border rounded-xl px-4 py-2.5"
              >
                <div>
                  <p className="text-brand-navy text-sm font-semibold">{step.title}</p>
                  <p className="text-neutral-muted text-xs mt-0.5">{step.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAccompanyStep(idx)}
                  className="text-neutral-muted hover:text-red-500 font-bold shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <FormField
              label="Cita (Promesa Humana)"
              multiline
              rows={2}
              value={formData.accompanyQuote || ""}
              onChange={(e) => updateField("accompanyQuote", e.target.value)}
            />
          </div>
          <div>
            <FormField
              label="Atribución de la Cita"
              type="text"
              value={formData.accompanyQuoteAttribution || ""}
              onChange={(e) => updateField("accompanyQuoteAttribution", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 5. Experiencias que humanizan */}
      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
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
      </div>

      {/* 6. Una persona al otro lado */}
      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">6. Una persona al otro lado</h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            Solo la cabecera es editable — las burbujas de conversación de ejemplo quedan fijas en el sitio público.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Badge / Distintivo"
              type="text"
              value={formData.humanBadge || ""}
              onChange={(e) => updateField("humanBadge", e.target.value)}
            />
          </div>
          <div>
            <FormField
              label="Título de sección"
              type="text"
              value={formData.humanTitle || ""}
              onChange={(e) => updateField("humanTitle", e.target.value)}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Subtítulo"
            multiline
            rows={2}
            value={formData.humanSubtitle || ""}
            onChange={(e) => updateField("humanSubtitle", e.target.value)}
          />
        </div>

        <div>
          <FormField
            label="Tagline (Ej: TE LEE · TE ORIENTA · PERMANECE)"
            type="text"
            value={formData.humanTagline || ""}
            onChange={(e) => updateField("humanTagline", e.target.value)}
          />
        </div>
      </div>

      {/* Save Button — fijo al fondo del viewport, siempre alcanzable sin scrollear hasta el final */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-border bg-neutral-soft/95 backdrop-blur lg:left-64">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex justify-end gap-4 py-4 max-w-4xl">
            <Button variant="primary" size="lg" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios Institucionales"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
