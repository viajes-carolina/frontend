"use client";

import React from "react";
import type { LegalCookiesDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField, FormSkeleton, LegalSectionsEditor, Toggle, PlusIcon, TrashIcon } from "@vc/ui";
import { useAdminLegalCookies } from "../../../hooks/useAdminLegalCookies";

interface LegalCookiesFormProps {
  initialConfig?: LegalCookiesDTO;
}

export function LegalCookiesForm({ initialConfig }: LegalCookiesFormProps) {
  const {
    config,
    loading,
    saving,
    error,
    success,
    updateField,
    updateSection,
    addSection,
    removeSection,
    updateCookieCategory,
    addCookieCategory,
    removeCookieCategory,
    saveConfig,
  } = useAdminLegalCookies(initialConfig);

  if (loading) {
    return <FormSkeleton fields={8} />;
  }

  if (!config) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
        No se pudo cargar la política de cookies.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-neutral-border shadow-sm space-y-6 max-w-4xl">
      <div className="border-b border-neutral-border pb-4">
        <h2 className="text-xl font-bold text-brand-navy">Política de cookies</h2>
        <p className="text-xs text-neutral-muted mt-1">Ruta pública: /cookies</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckIcon size={18} className="text-emerald-600 shrink-0" />
          Cambios guardados correctamente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField label="Eyebrow" type="text" value={config.eyebrow} onChange={(e) => updateField("eyebrow", e.target.value)} required />
        </div>
        <div>
          <FormField label="Título" type="text" value={config.title} onChange={(e) => updateField("title", e.target.value)} required />
        </div>
        <div>
          <FormField
            label="Etiqueta de control de documento"
            type="text"
            value={config.documentControlLabel}
            onChange={(e) => updateField("documentControlLabel", e.target.value)}
            placeholder="Última actualización"
          />
        </div>
        <div>
          <FormField
            label="Valor de control de documento"
            type="text"
            value={config.documentControlText}
            onChange={(e) => updateField("documentControlText", e.target.value)}
            placeholder="agosto de 2026"
          />
        </div>
      </div>

      <div>
        <FormField
          label="Introducción"
          multiline
          rows={3}
          value={config.introduction}
          onChange={(e) => updateField("introduction", e.target.value)}
        />
      </div>

      <LegalSectionsEditor
        sections={config.sections}
        onUpdate={updateSection}
        onAdd={addSection}
        onRemove={removeSection}
      />

      <div className="space-y-4 border-t border-neutral-border pt-6">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">
            Categorías de cookies del panel de preferencias ({config.cookieCategories.length})
          </label>
          <Button type="button" variant="outline" size="sm" icon={<PlusIcon size={16} />} iconPosition="left" onClick={addCookieCategory}>
            Agregar categoría
          </Button>
        </div>

        {config.cookieCategories.map((category, idx) => (
          <div key={idx} className="space-y-3 rounded-xl border border-neutral-border bg-neutral-soft p-4">
            <div className="flex items-center justify-between">
              <span className="font-sora text-xs font-semibold text-brand-accent">Categoría {idx + 1}</span>
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={<TrashIcon size={14} />}
                iconPosition="left"
                onClick={() => removeCookieCategory(idx)}
              >
                Quitar esta categoría
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Clave (key)"
                type="text"
                value={category.key}
                onChange={(e) => updateCookieCategory(idx, "key", e.target.value)}
                placeholder="analytics"
              />
              <FormField
                label="Nombre visible"
                type="text"
                value={category.name}
                onChange={(e) => updateCookieCategory(idx, "name", e.target.value)}
                placeholder="Cookies analíticas"
              />
            </div>
            <FormField
              label="Descripción"
              multiline
              rows={2}
              value={category.description}
              onChange={(e) => updateCookieCategory(idx, "description", e.target.value)}
            />
            <Toggle
              checked={category.required}
              onChange={(checked) => updateCookieCategory(idx, "required", checked)}
              label={category.required ? "Obligatoria (siempre activa)" : "Opcional (el visitante decide)"}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-border pt-6">
        <FormField
          label="Texto del botón 'Aceptar todas'"
          type="text"
          value={config.acceptAllLabel}
          onChange={(e) => updateField("acceptAllLabel", e.target.value)}
        />
        <FormField
          label="Texto del botón 'Guardar preferencias'"
          type="text"
          value={config.savePreferencesLabel}
          onChange={(e) => updateField("savePreferencesLabel", e.target.value)}
        />
      </div>

      <div className="space-y-4 border-t border-neutral-border pt-6">
        <label className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Cierre de la página</label>
        <FormField label="Título de cierre" type="text" value={config.closingTitle} onChange={(e) => updateField("closingTitle", e.target.value)} />
        <FormField
          label="Texto de cierre"
          multiline
          rows={2}
          value={config.closingBody}
          onChange={(e) => updateField("closingBody", e.target.value)}
        />
        <FormField
          label="Texto del botón de WhatsApp"
          type="text"
          value={config.closingLinkLabel}
          onChange={(e) => updateField("closingLinkLabel", e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-border">
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Política de cookies"}
        </Button>
      </div>
    </form>
  );
}
