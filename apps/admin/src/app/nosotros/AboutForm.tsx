"use client";

import React from "react";
import { Button } from "@vc/ui";
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
      <div className="p-8 text-center text-slate-400">
        <p className="font-sora text-sm">Cargando información institucional de Nosotros...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
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

      {/* 01. Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
          Cabecera & Foto Principal
        </h3>

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
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Badge / Distintivo Superior
            </label>
            <input
              type="text"
              value={formData.heroBadge}
              onChange={(e) => updateField("heroBadge", e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Nota flotante (tarjeta secundaria)
            </label>
            <input
              type="text"
              value={formData.heroNoteText || ""}
              onChange={(e) => updateField("heroNoteText", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Título Principal (H1)
          </label>
          <input
            type="text"
            value={formData.heroTitle}
            onChange={(e) => updateField("heroTitle", e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Subtítulo Descriptivo
          </label>
          <textarea
            rows={2}
            value={formData.heroSubtitle}
            onChange={(e) => updateField("heroSubtitle", e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Badge de la tarjeta flotante
            </label>
            <input
              type="text"
              value={formData.heroCardBadge || ""}
              onChange={(e) => updateField("heroCardBadge", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Título de la tarjeta flotante
            </label>
            <input
              type="text"
              value={formData.heroCardTitle || ""}
              onChange={(e) => updateField("heroCardTitle", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>
      </div>

      {/* 02. Historia & Valores */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-sunset" />
          Historia & Principios
        </h3>

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
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Título de la Historia
          </label>
          <input
            type="text"
            value={formData.storyTitle}
            onChange={(e) => updateField("storyTitle", e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Cuerpo / Narrativa de la Historia
          </label>
          <textarea
            rows={4}
            value={formData.storyBody}
            onChange={(e) => updateField("storyBody", e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        {/* Valores */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase">
            Principios / Valores Rectores
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newValueText}
              onChange={(e) => setNewValueText(e.target.value)}
              placeholder="Ej: Acompañamiento 24/7 sin letra chica"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
            <Button type="button" variant="secondary" onClick={addValue} className="!py-2 text-xs">
              + Agregar
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.values.map((val, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-white text-xs border border-slate-700"
              >
                {val}
                <button
                  type="button"
                  onClick={() => removeValue(idx)}
                  className="text-slate-400 hover:text-red-400 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 03. Misión */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Misión & Ruta &quot;de idea a recuerdo&quot;
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Título Misión
          </label>
          <input
            type="text"
            value={formData.missionTitle}
            onChange={(e) => updateField("missionTitle", e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Declaración de Misión
          </label>
          <textarea
            rows={4}
            value={formData.missionBody}
            onChange={(e) => updateField("missionBody", e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Cita Editorial
          </label>
          <textarea
            rows={2}
            value={formData.missionQuote || ""}
            onChange={(e) => updateField("missionQuote", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        {/* Journey Steps */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase">
            Pasos de la Ruta (4 pasos horizontales)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newJourneyStepText}
              onChange={(e) => setNewJourneyStepText(e.target.value)}
              placeholder="Ej: Escuchamos tu idea"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
            <Button type="button" variant="secondary" onClick={addJourneyStep} className="!py-2 text-xs">
              + Agregar
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.journeySteps.map((step, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-white text-xs border border-slate-700"
              >
                {step.label}
                <button
                  type="button"
                  onClick={() => removeJourneyStep(idx)}
                  className="text-slate-400 hover:text-red-400 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 04. Cómo te acompañamos */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          Cómo te acompañamos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Badge / Distintivo
            </label>
            <input
              type="text"
              value={formData.accompanyBadge || ""}
              onChange={(e) => updateField("accompanyBadge", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Título de sección
            </label>
            <input
              type="text"
              value={formData.accompanyTitle || ""}
              onChange={(e) => updateField("accompanyTitle", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Subtítulo
          </label>
          <textarea
            rows={2}
            value={formData.accompanySubtitle || ""}
            onChange={(e) => updateField("accompanySubtitle", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        {/* Accompany Steps */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase">
            Pasos verticales (título + descripción)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newAccompanyStepTitle}
              onChange={(e) => setNewAccompanyStepTitle(e.target.value)}
              placeholder="Título del paso"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
            <input
              type="text"
              value={newAccompanyStepBody}
              onChange={(e) => setNewAccompanyStepBody(e.target.value)}
              placeholder="Descripción del paso"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <Button type="button" variant="secondary" onClick={addAccompanyStep} className="!py-2 text-xs">
            + Agregar Paso
          </Button>

          <div className="space-y-2 pt-2">
            {formData.accompanySteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5"
              >
                <div>
                  <p className="text-white text-sm font-semibold">{step.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{step.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAccompanyStep(idx)}
                  className="text-slate-400 hover:text-red-400 font-bold shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Cita (Promesa Humana)
            </label>
            <textarea
              rows={2}
              value={formData.accompanyQuote || ""}
              onChange={(e) => updateField("accompanyQuote", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Atribución de la Cita
            </label>
            <input
              type="text"
              value={formData.accompanyQuoteAttribution || ""}
              onChange={(e) => updateField("accompanyQuoteAttribution", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>
      </div>

      {/* 05. Experiencias que humanizan */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
          Experiencias que humanizan
        </h3>

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
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Badge / Distintivo
            </label>
            <input
              type="text"
              value={formData.momentsBadge || ""}
              onChange={(e) => updateField("momentsBadge", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Título de sección
            </label>
            <input
              type="text"
              value={formData.momentsTitle || ""}
              onChange={(e) => updateField("momentsTitle", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Subtítulo
          </label>
          <textarea
            rows={2}
            value={formData.momentsSubtitle || ""}
            onChange={(e) => updateField("momentsSubtitle", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        {/* Moments */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase">
            Momentos numerados (título + descripción)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newMomentTitle}
              onChange={(e) => setNewMomentTitle(e.target.value)}
              placeholder="Título del momento"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
            <input
              type="text"
              value={newMomentBody}
              onChange={(e) => setNewMomentBody(e.target.value)}
              placeholder="Descripción del momento"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <Button type="button" variant="secondary" onClick={addMoment} className="!py-2 text-xs">
            + Agregar Momento
          </Button>

          <div className="space-y-2 pt-2">
            {formData.moments.map((moment, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5"
              >
                <div>
                  <p className="text-white text-sm font-semibold">{moment.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{moment.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMoment(idx)}
                  className="text-slate-400 hover:text-red-400 font-bold shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 06. Una persona al otro lado */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-sunset" />
          Una persona al otro lado
        </h3>
        <p className="font-inter text-xs text-slate-400 -mt-3">
          Solo la cabecera es editable — las burbujas de conversación de ejemplo quedan fijas en el sitio público.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Badge / Distintivo
            </label>
            <input
              type="text"
              value={formData.humanBadge || ""}
              onChange={(e) => updateField("humanBadge", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Título de sección
            </label>
            <input
              type="text"
              value={formData.humanTitle || ""}
              onChange={(e) => updateField("humanTitle", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Subtítulo
          </label>
          <textarea
            rows={2}
            value={formData.humanSubtitle || ""}
            onChange={(e) => updateField("humanSubtitle", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Tagline (Ej: TE LEE · TE ORIENTA · PERMANECE)
          </label>
          <input
            type="text"
            value={formData.humanTagline || ""}
            onChange={(e) => updateField("humanTagline", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" disabled={saving} className="px-8 !py-3">
          {saving ? "Guardando..." : "Guardar Cambios Institucionales"}
        </Button>
      </div>
    </form>
  );
}
