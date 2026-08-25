"use client";

import React from "react";

export interface ClaimStepServicioValues {
  claimType: string;
  relatedService: string;
  description: string;
  claimedAmount?: number;
  reservationCode?: string;
  serviceDate?: string;
}

export type ClaimStepServicioErrors = Partial<Record<keyof ClaimStepServicioValues, string>>;

export interface ClaimStepServicioProps {
  values: ClaimStepServicioValues;
  errors: ClaimStepServicioErrors;
  onChange: (field: keyof ClaimStepServicioValues, value: string | number | undefined) => void;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
      {children} {required && <span className="text-brand-accent">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rose-600">{message}</p>;
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-neutral-muted">{children}</p>;
}

const inputClass =
  "w-full px-4 py-2.5 bg-neutral-soft border border-neutral-border rounded-xl text-sm text-brand-navy placeholder:text-neutral-subtle focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent focus:outline-none transition-colors";

const RELATED_SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "PAQUETE", label: "Paquete turístico" },
  { value: "PASAJE", label: "Pasaje" },
  { value: "ALOJAMIENTO", label: "Alojamiento" },
  { value: "ASESORIA", label: "Asesoría" },
  { value: "OTRO", label: "Otro" },
];

/** Paso 2 del asistente: tipo de reclamo/queja y detalle del servicio contratado. */
export function ClaimStepServicio({ values, errors, onChange }: ClaimStepServicioProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl text-brand-navy mb-1">Cuéntanos sobre el servicio.</h2>
        <p className="text-sm text-neutral-muted">
          Primero identifica si se trata de un reclamo o una queja. Te ayudamos a elegir.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange("claimType", "RECLAMO")}
          className={`text-left p-4 rounded-2xl border-2 transition-colors ${
            values.claimType === "RECLAMO"
              ? "border-brand-accent bg-brand-accent/5"
              : "border-neutral-border hover:border-brand-navy/30"
          }`}
        >
          <span className="block font-sora font-extrabold text-sm text-brand-navy mb-1">Reclamo</span>
          <span className="block text-xs text-neutral-muted leading-relaxed">
            No estás conforme con el servicio recibido.
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChange("claimType", "QUEJA")}
          className={`text-left p-4 rounded-2xl border-2 transition-colors ${
            values.claimType === "QUEJA"
              ? "border-brand-accent bg-brand-accent/5"
              : "border-neutral-border hover:border-brand-navy/30"
          }`}
        >
          <span className="block font-sora font-extrabold text-sm text-brand-navy mb-1">Queja</span>
          <span className="block text-xs text-neutral-muted leading-relaxed">
            Tu malestar se relaciona con la atención recibida.
          </span>
        </button>
      </div>

      <div>
        <FieldLabel required>Servicio relacionado</FieldLabel>
        <select
          value={values.relatedService}
          onChange={(e) => onChange("relatedService", e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {RELATED_SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldHint>Selecciona: paquete, pasaje, alojamiento, asesoría u otro</FieldHint>
        <FieldError message={errors.relatedService} />
      </div>

      <div>
        <FieldLabel required>Descripción del servicio</FieldLabel>
        <input
          type="text"
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Ejemplo: paquete turístico a Cusco"
          className={inputClass}
        />
        <FieldError message={errors.description} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Monto pagado o reclamado · opcional</FieldLabel>
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.claimedAmount ?? ""}
            onChange={(e) =>
              onChange("claimedAmount", e.target.value === "" ? undefined : Number(e.target.value))
            }
            placeholder="S/ 0.00"
            className={inputClass}
          />
          <FieldError message={errors.claimedAmount} />
        </div>
        <div>
          <FieldLabel required>Fecha de compra o servicio</FieldLabel>
          <input
            type="date"
            value={values.serviceDate || ""}
            onChange={(e) => onChange("serviceDate", e.target.value)}
            className={inputClass}
          />
          <FieldError message={errors.serviceDate} />
        </div>
      </div>

      <div>
        <FieldLabel>Código de reserva u operación · opcional</FieldLabel>
        <input
          type="text"
          value={values.reservationCode || ""}
          onChange={(e) => onChange("reservationCode", e.target.value)}
          placeholder="Ej. RES-48291"
          className={inputClass}
        />
      </div>
    </div>
  );
}
