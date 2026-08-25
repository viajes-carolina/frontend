"use client";

import React from "react";
import { ClaimAttachmentUploader } from "./ClaimAttachmentUploader";

export interface ClaimStepDetalleValues {
  consumerDetail: string;
  consumerRequest: string;
  responseChannel: string;
  attachments: File[];
}

export type ClaimStepDetalleField = "consumerDetail" | "consumerRequest" | "responseChannel";
export type ClaimStepDetalleErrors = Partial<Record<ClaimStepDetalleField, string>>;

export interface ClaimStepDetalleProps {
  values: ClaimStepDetalleValues;
  errors: ClaimStepDetalleErrors;
  onChange: (field: ClaimStepDetalleField, value: string) => void;
  onAttachmentsChange: (files: File[]) => void;
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

const textareaClass =
  "w-full px-4 py-3 bg-neutral-soft border border-neutral-border rounded-xl text-sm text-brand-navy placeholder:text-neutral-subtle focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent focus:outline-none transition-colors resize-none";

const RESPONSE_CHANNEL_OPTIONS: { value: string; label: string }[] = [
  { value: "EMAIL", label: "Correo electrónico" },
  { value: "CARTA", label: "Carta al domicilio" },
];

/** Paso 3 del asistente: qué ocurrió, qué pides y por dónde quieres la respuesta. */
export function ClaimStepDetalle({ values, errors, onChange, onAttachmentsChange }: ClaimStepDetalleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl text-brand-navy mb-1">Ahora cuéntanos qué ocurrió.</h2>
        <p className="text-sm text-neutral-muted">
          Escribe con tus propias palabras. No necesitas usar términos legales.
        </p>
      </div>

      <div>
        <FieldLabel required>Detalle del reclamo o queja</FieldLabel>
        <textarea
          rows={5}
          value={values.consumerDetail}
          onChange={(e) => onChange("consumerDetail", e.target.value)}
          placeholder="Describe qué ocurrió, cuándo sucedió y cualquier información que ayude a comprenderlo."
          className={textareaClass}
        />
        <FieldError message={errors.consumerDetail} />
      </div>

      <div>
        <FieldLabel required>Pedido concreto</FieldLabel>
        <textarea
          rows={3}
          value={values.consumerRequest}
          onChange={(e) => onChange("consumerRequest", e.target.value)}
          placeholder="Indica qué solución esperas de Viajes Carolina."
          className={textareaClass}
        />
        <FieldError message={errors.consumerRequest} />
      </div>

      <div>
        <FieldLabel required>¿Cómo prefieres recibir la respuesta?</FieldLabel>
        <div className="flex flex-wrap gap-3">
          {RESPONSE_CHANNEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange("responseChannel", opt.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-colors ${
                values.responseChannel === opt.value
                  ? "border-brand-accent bg-brand-accent/10 text-brand-navy"
                  : "border-neutral-border text-neutral-muted hover:border-brand-navy/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <FieldError message={errors.responseChannel} />
      </div>

      <ClaimAttachmentUploader files={values.attachments} onFilesChange={onAttachmentsChange} />
    </div>
  );
}
