"use client";

import React from "react";
import { UpdateContactPageRequest, StarterPhraseDTO } from "@vc/api-client";
import { Button, CheckIcon } from "@vc/ui";

export interface ContactSettingsFormProps {
  formData: UpdateContactPageRequest;
  updateField: <K extends keyof UpdateContactPageRequest>(field: K, value: UpdateContactPageRequest[K]) => void;
  addStarterPhrase: () => void;
  removeStarterPhrase: (index: number) => void;
  updateStarterPhrase: (index: number, field: keyof StarterPhraseDTO, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  saving: boolean;
  saveSuccess: boolean;
}

export function ContactSettingsForm({
  formData,
  updateField,
  addStarterPhrase,
  removeStarterPhrase,
  updateStarterPhrase,
  onSubmit,
  saving,
  saveSuccess,
}: ContactSettingsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-border p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-border pb-4">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">
            Configuración Editorial de Contacto
          </h2>
          <p className="font-inter text-neutral-muted text-xs mt-1">
            Personaliza los textos del Hero, la sección &quot;Cómo empezar&quot; y la sección de Oficina.
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

      {/* Seccion 1: Hero */}
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
            onChange={(e) => updateField("heroBadge", e.target.value)}
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
            onChange={(e) => updateField("heroTitle", e.target.value)}
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
            onChange={(e) => updateField("heroSubtitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Texto del botón CTA de WhatsApp
          </label>
          <input
            type="text"
            required
            value={formData.heroCtaText}
            onChange={(e) => updateField("heroCtaText", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Nota debajo del CTA
          </label>
          <input
            type="text"
            required
            value={formData.heroNoteText}
            onChange={(e) => updateField("heroNoteText", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Mensaje predefinido de WhatsApp (CTA principal)
          </label>
          <textarea
            required
            rows={2}
            value={formData.heroCtaMessage}
            onChange={(e) => updateField("heroCtaMessage", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
          />
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter uppercase tracking-wide">
            Mockup de chat (ilustrativo)
          </label>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-dark font-inter">
              Etiqueta de la respuesta humana
            </label>
            <input
              type="text"
              required
              value={formData.heroChatLabel}
              onChange={(e) => updateField("heroChatLabel", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-dark font-inter">
              Burbuja 1 (viajero)
            </label>
            <textarea
              required
              rows={2}
              value={formData.heroChatBubble1}
              onChange={(e) => updateField("heroChatBubble1", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-dark font-inter">
              Burbuja 2 (respuesta humana)
            </label>
            <textarea
              required
              rows={2}
              value={formData.heroChatBubble2}
              onChange={(e) => updateField("heroChatBubble2", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-dark font-inter">
              Burbuja 3 (cierre)
            </label>
            <textarea
              required
              rows={2}
              value={formData.heroChatBubble3}
              onChange={(e) => updateField("heroChatBubble3", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Seccion 2: Cómo empezar */}
      <div className="space-y-4 pt-4 border-t border-neutral-border">
        <h3 className="font-sora font-semibold text-sm text-brand-navy uppercase tracking-wider text-xs">
          2. Cómo Empezar
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Insignia / Eyebrow Badge
          </label>
          <input
            type="text"
            required
            value={formData.startersBadge}
            onChange={(e) => updateField("startersBadge", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Título de sección
          </label>
          <input
            type="text"
            required
            value={formData.startersTitle}
            onChange={(e) => updateField("startersTitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Subtítulo
          </label>
          <textarea
            required
            rows={2}
            value={formData.startersSubtitle}
            onChange={(e) => updateField("startersSubtitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Frase de cierre
          </label>
          <input
            type="text"
            required
            value={formData.startersClosing}
            onChange={(e) => updateField("startersClosing", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        {/* Frases editables */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter uppercase tracking-wide">
            Frases de ejemplo
          </label>

          <div className="space-y-3">
            {formData.starterPhrases.map((phrase, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-2 sm:items-start bg-neutral-light/50 border border-neutral-border/80 rounded-xl p-3.5"
              >
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Frase (Ej: Solo tengo unos días libres.)"
                    value={phrase.quote}
                    onChange={(e) => updateStarterPhrase(idx, "quote", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Respuesta de apoyo (Ej: Empezamos por el tiempo disponible.)"
                    value={phrase.support}
                    onChange={(e) => updateStarterPhrase(idx, "support", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-sm font-inter text-neutral-muted focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStarterPhrase(idx)}
                  aria-label="Quitar frase"
                  className="text-neutral-muted hover:text-red-500 font-bold shrink-0 px-2 py-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <Button type="button" variant="secondary" size="sm" onClick={addStarterPhrase}>
            + Agregar frase
          </Button>
        </div>
      </div>

      {/* Seccion 3: Oficina */}
      <div className="space-y-4 pt-4 border-t border-neutral-border">
        <h3 className="font-sora font-semibold text-sm text-brand-navy uppercase tracking-wider text-xs">
          3. Oficina & Mapa
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Insignia / Eyebrow Badge
          </label>
          <input
            type="text"
            required
            value={formData.officeSectionBadge}
            onChange={(e) => updateField("officeSectionBadge", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Título de sección
          </label>
          <input
            type="text"
            required
            value={formData.officeSectionTitle}
            onChange={(e) => updateField("officeSectionTitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Subtítulo de sección
          </label>
          <textarea
            required
            rows={2}
            value={formData.officeSectionSubtitle}
            onChange={(e) => updateField("officeSectionSubtitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Título de la tarjeta del mapa
          </label>
          <input
            type="text"
            required
            value={formData.officeMapTitle}
            onChange={(e) => updateField("officeMapTitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Subtítulo de la tarjeta del mapa
          </label>
          <input
            type="text"
            required
            value={formData.officeMapSubtitle}
            onChange={(e) => updateField("officeMapSubtitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter">
            Nota de coordinación de visita
          </label>
          <input
            type="text"
            required
            value={formData.officeVisitNote}
            onChange={(e) => updateField("officeVisitNote", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter uppercase tracking-wide">
            Mapa ilustrado y etiquetas
          </label>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-dark font-inter">
              Insignia sobre el título lateral (Ej: Mapa real integrado)
            </label>
            <input
              type="text"
              required
              value={formData.officeMapEyebrow}
              onChange={(e) => updateField("officeMapEyebrow", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-dark font-inter">
                Título de la etiqueta flotante del pin
              </label>
              <input
                type="text"
                required
                value={formData.officeMapPinTitle}
                onChange={(e) => updateField("officeMapPinTitle", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-dark font-inter">
                Subtítulo de la etiqueta flotante del pin
              </label>
              <input
                type="text"
                required
                value={formData.officeMapPinSubtitle}
                onChange={(e) => updateField("officeMapPinSubtitle", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-dark font-inter">
              Texto del link a Google Maps
            </label>
            <input
              type="text"
              required
              value={formData.officeMapsLinkText}
              onChange={(e) => updateField("officeMapsLinkText", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-dark font-inter">
                Etiqueta &quot;Ubicación oficial&quot;
              </label>
              <input
                type="text"
                required
                value={formData.officeLocationLabel}
                onChange={(e) => updateField("officeLocationLabel", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-dark font-inter">
                Etiqueta &quot;Antes de venir&quot;
              </label>
              <input
                type="text"
                required
                value={formData.officeVisitLabel}
                onChange={(e) => updateField("officeVisitLabel", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-dark font-inter">
              Texto del botón &quot;Coordinar visita por WhatsApp&quot;
            </label>
            <input
              type="text"
              required
              value={formData.officeVisitCtaText}
              onChange={(e) => updateField("officeVisitCtaText", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-dark font-inter">
              Mensaje predefinido de WhatsApp (visita a oficina)
            </label>
            <textarea
              required
              rows={2}
              value={formData.officeVisitCtaMessage}
              onChange={(e) => updateField("officeVisitCtaMessage", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
