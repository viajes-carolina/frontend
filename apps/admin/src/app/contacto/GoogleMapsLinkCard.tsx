"use client";

import React from "react";
import { Button, CheckIcon } from "@vc/ui";

export interface GoogleMapsLinkCardProps {
  googleMapsUrl: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
  saveSuccess: boolean;
  error?: string | null;
}

export function GoogleMapsLinkCard({ googleMapsUrl, onChange, onSave, saving, saveSuccess, error }: GoogleMapsLinkCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-border p-6 space-y-4 shadow-sm">
      <div>
        <h2 className="font-sora font-bold text-lg text-brand-navy">Ubicación en Google Maps</h2>
        <p className="font-inter text-neutral-muted text-xs mt-1">
          Enlace real usado en el pin del mapa y el botón &quot;Abrir ubicación en Google Maps&quot; de la página pública de Contacto.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-inter flex items-center gap-2">
          <CheckIcon size={16} className="text-emerald-600" />
          <span>Ubicación de Google Maps actualizada.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={googleMapsUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://maps.app.goo.gl/..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-border text-sm font-inter text-neutral-dark focus:outline-none focus:border-brand-accent transition-colors"
        />
        <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={onSave}>
          {saving ? "Guardando..." : "Guardar ubicación"}
        </Button>
      </div>

      <p className="font-inter text-neutral-muted text-[11px]">
        La dirección, el distrito y los horarios de atención se editan en <strong>Oficina &amp; Horarios</strong>.
      </p>
    </div>
  );
}
