"use client";

import { useAdminOffice } from "../../../hooks/useAdminOffice";
import { OfficeLocationDTO } from "@vc/api-client";
import { Button, CheckIcon } from "@vc/ui";

export interface OfficeFormProps {
  initialOffice: OfficeLocationDTO;
}

export function OfficeForm({ initialOffice }: OfficeFormProps) {
  const { office, isSaving, saveSuccess, updateField, handleSave } = useAdminOffice(initialOffice);

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">Datos de la oficina física guardados y sincronizados con el footer y página de contacto.</span>
        </div>
      )}

      {/* Dirección Física */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
          Dirección de Oficina Principal
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Dirección Línea 1
            </label>
            <input
              type="text"
              value={office.addressLine}
              onChange={(e) => updateField("addressLine", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Distrito
            </label>
            <input
              type="text"
              value={office.district}
              onChange={(e) => updateField("district", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Ciudad & País
            </label>
            <input
              type="text"
              value={`${office.city}, ${office.country}`}
              onChange={(e) => {
                const parts = e.target.value.split(",");
                updateField("city", parts[0]?.trim() || office.city);
                if (parts[1]) updateField("country", parts[1].trim());
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Referencia de Ubicación
            </label>
            <input
              type="text"
              value={office.referenceLandmark || ""}
              onChange={(e) => updateField("referenceLandmark", e.target.value)}
              placeholder="Ej: A media cuadra del Parque Kennedy"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        </div>
      </div>

      {/* Horarios de Atención */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
          Horarios de Atención
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Lunes a Viernes
            </label>
            <input
              type="text"
              value={office.scheduleWeekdays}
              onChange={(e) => updateField("scheduleWeekdays", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Sábados
            </label>
            <input
              type="text"
              value={office.scheduleSaturdays}
              onChange={(e) => updateField("scheduleSaturdays", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
        </div>
      </div>

      {/* Google Maps Link */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6">
        <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
          Enlace a Google Maps
        </h2>
        <p className="font-inter text-neutral-muted text-xs -mt-3">
          Este es el único lugar del panel donde se edita la ubicación del mapa — el enlace y las coordenadas se usan tanto en el footer como en el mapa real embebido de la página pública de Contacto.
        </p>

        <div>
          <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
            URL de Google Maps
          </label>
          <input
            type="url"
            value={office.googleMapsUrl || ""}
            onChange={(e) => updateField("googleMapsUrl", e.target.value)}
            placeholder="https://maps.google.com/?q=..."
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Latitud
            </label>
            <input
              type="number"
              step="any"
              value={office.latitude ?? ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value))}
              placeholder="-12.058318"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Longitud
            </label>
            <input
              type="number"
              step="any"
              value={office.longitude ?? ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value))}
              placeholder="-77.044225"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        </div>
        <p className="font-inter text-neutral-muted text-[11px]">
          Coordenadas GPS exactas usadas para el mapa real embebido en la página pública de Contacto — más precisas que geocodificar la dirección de texto. Consíguelas en Google Maps: clic derecho sobre el punto exacto → copiar coordenadas.
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="primary" size="md" disabled={isSaving} type="submit">
          {isSaving ? "Guardando..." : "Guardar Oficina"}
        </Button>
      </div>
    </form>
  );
}
