"use client";

import React, { useState, useEffect } from "react";
import { ContactPageDTO, UpdateContactPageRequest } from "@vc/api-client";
import { Button, CheckIcon } from "@vc/ui";

export interface ContactSettingsFormProps {
  initialData: ContactPageDTO;
  onSave: (payload: UpdateContactPageRequest) => Promise<boolean>;
  saving: boolean;
  saveSuccess: boolean;
}

export function ContactSettingsForm({
  initialData,
  onSave,
  saving,
  saveSuccess,
}: ContactSettingsFormProps) {
  const [formData, setFormData] = useState<UpdateContactPageRequest>({
    heroBadge: initialData.heroBadge,
    heroTitle: initialData.heroTitle,
    heroSubtitle: initialData.heroSubtitle,
    whatsappBoxTitle: initialData.whatsappBoxTitle,
    whatsappBoxSubtitle: initialData.whatsappBoxSubtitle,
    formTitle: initialData.formTitle,
    formSubtitle: initialData.formSubtitle,
  });

  useEffect(() => {
    setFormData({
      heroBadge: initialData.heroBadge,
      heroTitle: initialData.heroTitle,
      heroSubtitle: initialData.heroSubtitle,
      whatsappBoxTitle: initialData.whatsappBoxTitle,
      whatsappBoxSubtitle: initialData.whatsappBoxSubtitle,
      formTitle: initialData.formTitle,
      formSubtitle: initialData.formSubtitle,
    });
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-border p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-border pb-4">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">
            Configuración Editorial de Contacto
          </h2>
          <p className="font-inter text-neutral-muted text-xs mt-1">
            Personaliza los textos del banner principal, caja de WhatsApp y encabezados del formulario.
          </p>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={saving}
          icon={saveSuccess ? <CheckIcon size={16} /> : undefined}
        >
          {saving ? "Guardando..." : saveSuccess ? "¡Guardado!" : "Guardar Cambios"}
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-inter flex items-center gap-2">
          <CheckIcon size={16} className="text-emerald-600" />
          <span>Configuración de Contacto actualizada con éxito.</span>
        </div>
      )}

      {/* Seccion 1: Hero Principal */}
      <div className="space-y-4">
        <h3 className="font-sora font-semibold text-sm text-brand-navy uppercase tracking-wider text-xs">
          1. Hero & Encabezado Principal
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Insignia / Eyebrow Badge
          </label>
          <input
            type="text"
            required
            value={formData.heroBadge}
            onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Título Principal (H1)
          </label>
          <input
            type="text"
            required
            value={formData.heroTitle}
            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Subtítulo Descriptivo
          </label>
          <textarea
            required
            rows={2}
            value={formData.heroSubtitle}
            onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
          />
        </div>
      </div>

      {/* Seccion 2: Tarjeta WhatsApp */}
      <div className="space-y-4 pt-4 border-t border-neutral-border">
        <h3 className="font-sora font-semibold text-sm text-brand-navy uppercase tracking-wider text-xs">
          2. Tarjeta de WhatsApp Directo
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Título de la Caja
          </label>
          <input
            type="text"
            required
            value={formData.whatsappBoxTitle}
            onChange={(e) => setFormData({ ...formData, whatsappBoxTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Subtítulo / Mensaje de Atención
          </label>
          <textarea
            required
            rows={2}
            value={formData.whatsappBoxSubtitle}
            onChange={(e) => setFormData({ ...formData, whatsappBoxSubtitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
          />
        </div>
      </div>

      {/* Seccion 3: Formulario */}
      <div className="space-y-4 pt-4 border-t border-neutral-border">
        <h3 className="font-sora font-semibold text-sm text-brand-navy uppercase tracking-wider text-xs">
          3. Encabezados del Formulario
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Título del Formulario
          </label>
          <input
            type="text"
            required
            value={formData.formTitle}
            onChange={(e) => setFormData({ ...formData, formTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Subtítulo del Formulario
          </label>
          <textarea
            required
            rows={2}
            value={formData.formSubtitle}
            onChange={(e) => setFormData({ ...formData, formSubtitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
          />
        </div>
      </div>
    </form>
  );
}
