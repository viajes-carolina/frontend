"use client";

import React from "react";
import { useAdminContact } from "../../hooks/useAdminContact";
import { ContactSettingsForm } from "./ContactSettingsForm";
import { Button, ArrowUpRightIcon } from "@vc/ui";

export default function AdminContactPage() {
  const {
    pageSettings,
    formData,
    updateField,
    loading,
    saving,
    saveSuccess,
    error,
    handleSaveSettings,
  } = useAdminContact();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!pageSettings) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter">
        ⚠️ {error || "No se pudo cargar la configuración de contacto."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <a href={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/contacto`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" icon={<ArrowUpRightIcon size={16} />}>
            Ver Página Pública
          </Button>
        </a>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter">
          ⚠️ {error}
        </div>
      )}

      <ContactSettingsForm
        formData={formData}
        updateField={updateField}
        onSubmit={handleSaveSettings}
        saving={saving}
        saveSuccess={saveSuccess}
      />
    </div>
  );
}
