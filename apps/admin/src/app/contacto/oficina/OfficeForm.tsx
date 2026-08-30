"use client";

import React from "react";
import type { OfficeLocationDTO } from "@vc/api-client";
import { FormCard, FormField } from "@vc/ui";
import { useAdminOffice } from "../../../hooks/useAdminOffice";

export interface OfficeFormProps {
  initialOffice: OfficeLocationDTO;
}

const SECTION_TITLE_CLASSES =
  "font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label";

export function OfficeForm({ initialOffice }: OfficeFormProps) {
  const { office, isSaving, feedback, updateField, updateCityCountry, handleSave } = useAdminOffice(initialOffice);

  return (
    <FormCard
      title="Oficina física y horarios"
      description="Dirección, horarios y ubicación en el mapa. Es el único lugar del panel donde se editan: el pie del sitio y la página pública de Contacto los leen de aquí."
      feedback={feedback}
      onSubmit={handleSave}
      saving={isSaving}
      submitLabel="Guardar Oficina"
    >
      {/* Dirección física */}
      <div className="space-y-4">
        <h3 className={SECTION_TITLE_CLASSES}>Dirección de oficina principal</h3>

        <FormField
          label="Dirección Línea 1"
          type="text"
          value={office.addressLine}
          onChange={(e) => updateField("addressLine", e.target.value)}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Distrito"
            type="text"
            value={office.district}
            onChange={(e) => updateField("district", e.target.value)}
            required
          />
          <FormField
            label="Ciudad & País"
            type="text"
            value={`${office.city}, ${office.country}`}
            onChange={(e) => updateCityCountry(e.target.value)}
            required
          />
        </div>

        <FormField
          label="Referencia de Ubicación"
          type="text"
          value={office.referenceLandmark || ""}
          onChange={(e) => updateField("referenceLandmark", e.target.value)}
          placeholder="Ej: A media cuadra del Parque Kennedy"
        />
      </div>

      {/* Horarios de atención */}
      <div className="space-y-4 border-t border-admin-divider pt-6">
        <h3 className={SECTION_TITLE_CLASSES}>Horarios de atención</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Lunes a Viernes"
            type="text"
            value={office.scheduleWeekdays}
            onChange={(e) => updateField("scheduleWeekdays", e.target.value)}
            required
          />
          <FormField
            label="Sábados"
            type="text"
            value={office.scheduleSaturdays}
            onChange={(e) => updateField("scheduleSaturdays", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Google Maps */}
      <div className="space-y-4 border-t border-admin-divider pt-6">
        <h3 className={SECTION_TITLE_CLASSES}>Enlace a Google Maps</h3>

        <FormField
          label="URL de Google Maps"
          type="url"
          value={office.googleMapsUrl || ""}
          onChange={(e) => updateField("googleMapsUrl", e.target.value)}
          placeholder="https://maps.google.com/?q=..."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Latitud"
            type="number"
            step="any"
            value={office.latitude ?? ""}
            onChange={(e) => updateField("latitude", parseFloat(e.target.value))}
            placeholder="-12.058318"
          />
          <FormField
            label="Longitud"
            type="number"
            step="any"
            value={office.longitude ?? ""}
            onChange={(e) => updateField("longitude", parseFloat(e.target.value))}
            placeholder="-77.044225"
            hint="Consíguelas en Google Maps: clic derecho sobre el punto exacto → copiar coordenadas."
          />
        </div>
      </div>
    </FormCard>
  );
}
