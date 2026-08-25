"use client";

import React from "react";
import { useAdminContact } from "../../hooks/useAdminContact";
import { useAdminGoogleMapsLink } from "../../hooks/useAdminGoogleMapsLink";
import { ContactSettingsForm } from "./ContactSettingsForm";
import { GoogleMapsLinkCard } from "./GoogleMapsLinkCard";
import { Button, ArrowUpRightIcon } from "@vc/ui";

export default function AdminContactPage() {
  const {
    pageSettings,
    formData,
    updateField,
    addStarterPhrase,
    removeStarterPhrase,
    updateStarterPhrase,
    loading,
    saving,
    saveSuccess,
    error,
    handleSaveSettings,
  } = useAdminContact();

  const {
    googleMapsUrl,
    setGoogleMapsUrl,
    saving: savingMapsUrl,
    saveSuccess: mapsUrlSaveSuccess,
    error: mapsUrlError,
    handleSave: handleSaveMapsUrl,
  } = useAdminGoogleMapsLink();

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!pageSettings) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter">
          ⚠️ {error || "No se pudo cargar la configuración de contacto."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
            Contacto
          </span>
          <h1 className="font-sora font-bold text-2xl text-brand-navy">
            Configuración de Contacto
          </h1>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Personaliza los textos de la página pública de Contacto.
          </p>
        </div>
        <div className="flex gap-3">
          <a href={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/contacto`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" icon={<ArrowUpRightIcon size={16} />}>
              Ver Página Pública
            </Button>
          </a>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter">
          ⚠️ {error}
        </div>
      )}

      <GoogleMapsLinkCard
        googleMapsUrl={googleMapsUrl}
        onChange={setGoogleMapsUrl}
        onSave={handleSaveMapsUrl}
        saving={savingMapsUrl}
        saveSuccess={mapsUrlSaveSuccess}
        error={mapsUrlError}
      />

      <ContactSettingsForm
        formData={formData}
        updateField={updateField}
        addStarterPhrase={addStarterPhrase}
        removeStarterPhrase={removeStarterPhrase}
        updateStarterPhrase={updateStarterPhrase}
        onSubmit={handleSaveSettings}
        saving={saving}
        saveSuccess={saveSuccess}
      />
    </div>
  );
}
