"use client";

import React, { useState, useEffect } from "react";
import { AboutPageDTO, UpdateAboutPageRequest } from "@vc/api-client";
import { Button } from "@vc/ui";

export interface AboutFormProps {
  initialData: AboutPageDTO;
  saving: boolean;
  onSave: (payload: UpdateAboutPageRequest) => void;
  onOpenMediaPicker: (target: "hero" | "story") => void;
}

export function AboutForm({ initialData, saving, onSave, onOpenMediaPicker }: AboutFormProps) {
  const [formData, setFormData] = useState<UpdateAboutPageRequest>({
    heroBadge: initialData.heroBadge,
    heroTitle: initialData.heroTitle,
    heroSubtitle: initialData.heroSubtitle,
    heroMediaId: initialData.heroMediaId,
    storyTitle: initialData.storyTitle,
    storyBody: initialData.storyBody,
    storyMediaId: initialData.storyMediaId,
    missionTitle: initialData.missionTitle,
    missionBody: initialData.missionBody,
    visionTitle: initialData.visionTitle,
    visionBody: initialData.visionBody,
    values: initialData.values || [],
    experienceYears: initialData.experienceYears,
    happyTravelers: initialData.happyTravelers,
    destinationsCount: initialData.destinationsCount,
    satisfactionRatePercent: initialData.satisfactionRatePercent,
  });

  const [newValueText, setNewValueText] = useState("");

  useEffect(() => {
    setFormData({
      heroBadge: initialData.heroBadge,
      heroTitle: initialData.heroTitle,
      heroSubtitle: initialData.heroSubtitle,
      heroMediaId: initialData.heroMediaId,
      storyTitle: initialData.storyTitle,
      storyBody: initialData.storyBody,
      storyMediaId: initialData.storyMediaId,
      missionTitle: initialData.missionTitle,
      missionBody: initialData.missionBody,
      visionTitle: initialData.visionTitle,
      visionBody: initialData.visionBody,
      values: initialData.values || [],
      experienceYears: initialData.experienceYears,
      happyTravelers: initialData.happyTravelers,
      destinationsCount: initialData.destinationsCount,
      satisfactionRatePercent: initialData.satisfactionRatePercent,
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAddValue = () => {
    if (!newValueText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      values: [...prev.values, newValueText.trim()],
    }));
    setNewValueText("");
  };

  const handleRemoveValue = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      
      {/* 01. Hero & Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
          Cabecera & Título Principal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Badge / Distintivo Superior
            </label>
            <input
              type="text"
              name="heroBadge"
              value={formData.heroBadge}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Imagen de Cabecera (ID Media: {formData.heroMediaId || "Predeterminada"})
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenMediaPicker("hero")}
              className="w-full justify-center !py-2.5 text-xs text-brand-accent border-brand-accent/40 hover:bg-brand-accent/10"
            >
              Seleccionar Imagen desde Galería
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Título Principal (H1)
          </label>
          <input
            type="text"
            name="heroTitle"
            value={formData.heroTitle}
            onChange={handleChange}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Subtítulo Descriptivo
          </label>
          <textarea
            name="heroSubtitle"
            rows={2}
            value={formData.heroSubtitle}
            onChange={handleChange}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {/* 02. Estadísticas & Métricas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          Métricas de Impacto
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Años de Experiencia
            </label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              min={1}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Viajeros Atendidos
            </label>
            <input
              type="number"
              name="happyTravelers"
              value={formData.happyTravelers}
              onChange={handleChange}
              min={1}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Destinos Globales
            </label>
            <input
              type="number"
              name="destinationsCount"
              value={formData.destinationsCount}
              onChange={handleChange}
              min={1}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Satisfacción (%)
            </label>
            <input
              type="number"
              name="satisfactionRatePercent"
              value={formData.satisfactionRatePercent}
              onChange={handleChange}
              min={1}
              max={100}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>
      </div>

      {/* 03. Historia & Valores */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-sunset" />
          Historia & Principios
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Título de la Historia
            </label>
            <input
              type="text"
              name="storyTitle"
              value={formData.storyTitle}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Foto de la Historia (ID Media: {formData.storyMediaId || "Predeterminada"})
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenMediaPicker("story")}
              className="w-full justify-center !py-2.5 text-xs text-brand-sunset border-brand-sunset/40 hover:bg-brand-sunset/10"
            >
              Seleccionar Foto de Historia
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
            Cuerpo / Narrativa de la Historia
          </label>
          <textarea
            name="storyBody"
            rows={4}
            value={formData.storyBody}
            onChange={handleChange}
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
            <Button type="button" variant="secondary" onClick={handleAddValue} className="!py-2 text-xs">
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
                  onClick={() => handleRemoveValue(idx)}
                  className="text-slate-400 hover:text-red-400 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 04. Misión & Visión */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-sora font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Misión & Visión
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase">
              Título Misión
            </label>
            <input
              type="text"
              name="missionTitle"
              value={formData.missionTitle}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
            <label className="block text-xs font-semibold text-slate-400 uppercase">
              Declaración de Misión
            </label>
            <textarea
              name="missionBody"
              rows={4}
              value={formData.missionBody}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase">
              Título Visión
            </label>
            <input
              type="text"
              name="visionTitle"
              value={formData.visionTitle}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
            <label className="block text-xs font-semibold text-slate-400 uppercase">
              Declaración de Visión
            </label>
            <textarea
              name="visionBody"
              rows={4}
              value={formData.visionBody}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
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
