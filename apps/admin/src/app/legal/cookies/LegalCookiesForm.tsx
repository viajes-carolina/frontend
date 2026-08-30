"use client";

import React from "react";
import type { LegalCookiesDTO } from "@vc/api-client";
import {
  Button,
  FormCard,
  FormField,
  FormFeedback,
  FormSkeleton,
  LegalSectionsEditor,
  PlusIcon,
  Toggle,
  TrashIcon,
} from "@vc/ui";
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
    feedback,
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
    return <FormSkeleton fields={8} className="max-w-4xl" />;
  }

  if (!config) {
    return <FormFeedback feedback={{ tone: "error", message: error || "No se pudo cargar la política de cookies." }} />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveConfig();
  };

  return (
    <FormCard
      title="Política de cookies"
      description="Ruta pública: /cookies"
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Política de cookies"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Eyebrow"
          type="text"
          value={config.eyebrow}
          onChange={(e) => updateField("eyebrow", e.target.value)}
          required
        />
        <FormField
          label="Título"
          type="text"
          value={config.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />
        <FormField
          label="Etiqueta de control de documento"
          type="text"
          value={config.documentControlLabel}
          onChange={(e) => updateField("documentControlLabel", e.target.value)}
          placeholder="Última actualización"
        />
        <FormField
          label="Valor de control de documento"
          type="text"
          value={config.documentControlText}
          onChange={(e) => updateField("documentControlText", e.target.value)}
          placeholder="agosto de 2026"
        />
      </div>

      <FormField
        label="Introducción"
        multiline
        rows={3}
        value={config.introduction}
        onChange={(e) => updateField("introduction", e.target.value)}
      />

      <LegalSectionsEditor
        sections={config.sections}
        onUpdate={updateSection}
        onAdd={addSection}
        onRemove={removeSection}
      />

      <div className="space-y-4 border-t border-admin-divider pt-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
            Categorías de cookies del panel de preferencias ({config.cookieCategories.length})
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<PlusIcon size={16} />}
            iconPosition="left"
            onClick={addCookieCategory}
          >
            Agregar categoría
          </Button>
        </div>

        {config.cookieCategories.map((category, idx) => (
          <div key={idx} className="space-y-3 rounded-[10px] border border-admin-divider bg-admin-field p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-inter text-xs font-semibold text-brand-accent">Categoría {idx + 1}</span>
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

      <div className="grid grid-cols-1 gap-4 border-t border-admin-divider pt-6 md:grid-cols-2">
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

      <div className="space-y-4 border-t border-admin-divider pt-6">
        <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Cierre de la página
        </h3>
        <FormField
          label="Título de cierre"
          type="text"
          value={config.closingTitle}
          onChange={(e) => updateField("closingTitle", e.target.value)}
        />
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
    </FormCard>
  );
}
