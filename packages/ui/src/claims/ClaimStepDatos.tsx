"use client";

import React from "react";
import { Button } from "../primitives/Button";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface ClaimStepDatosValues {
  fullName: string;
  documentType: string;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  isMinor?: boolean;
  parentName?: string;
  parentDocument?: string;
}

export type ClaimStepDatosErrors = Partial<Record<keyof ClaimStepDatosValues, string>>;

export interface ClaimStepDatosProps {
  values: ClaimStepDatosValues;
  errors: ClaimStepDatosErrors;
  onChange: (field: keyof ClaimStepDatosValues, value: string | boolean) => void;
  firstFieldRef?: React.RefObject<HTMLInputElement | null>;
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

const inputClass =
  "w-full px-4 py-2.5 bg-neutral-soft border border-neutral-border rounded-xl text-sm text-brand-navy placeholder:text-neutral-subtle focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent focus:outline-none transition-colors";

/** Paso 1 del asistente: identificación del consumidor reclamante. */
export function ClaimStepDatos({ values, errors, onChange, firstFieldRef }: ClaimStepDatosProps) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Nombres y apellidos</FieldLabel>
        <input
          ref={firstFieldRef}
          type="text"
          value={values.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          placeholder="Ej. Juan Carlos Pérez Alarcón"
          className={inputClass}
        />
        <FieldError message={errors.fullName} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Tipo de documento</FieldLabel>
          <select
            value={values.documentType}
            onChange={(e) => onChange("documentType", e.target.value)}
            className={inputClass}
          >
            <option value="DNI">DNI</option>
            <option value="CE">Carné de Extranjería</option>
            <option value="PASAPORTE">Pasaporte</option>
            <option value="RUC">RUC</option>
          </select>
          <FieldError message={errors.documentType} />
        </div>
        <div>
          <FieldLabel required>Número de documento</FieldLabel>
          <input
            type="text"
            value={values.documentNumber}
            onChange={(e) => onChange("documentNumber", e.target.value)}
            placeholder="Ej. 45892314"
            className={inputClass}
          />
          <FieldError message={errors.documentNumber} />
        </div>
      </div>

      <div>
        <FieldLabel required>Domicilio</FieldLabel>
        <input
          type="text"
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Ej. Calle Las Flores 230, Miraflores, Lima"
          className={inputClass}
        />
        <FieldError message={errors.address} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Teléfono</FieldLabel>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+51 987 654 321"
            className={inputClass}
          />
          <FieldError message={errors.phone} />
        </div>
        <div>
          <FieldLabel required>Correo electrónico</FieldLabel>
          <input
            type="email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="correo@ejemplo.com"
            className={inputClass}
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      <div>
        <FieldLabel>¿La persona consumidora es menor de edad?</FieldLabel>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange("isMinor", false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-colors ${
              !values.isMinor
                ? "border-brand-accent bg-brand-accent/10 text-brand-navy"
                : "border-neutral-border text-neutral-muted hover:border-brand-navy/30"
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => onChange("isMinor", true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-colors ${
              values.isMinor
                ? "border-brand-accent bg-brand-accent/10 text-brand-navy"
                : "border-neutral-border text-neutral-muted hover:border-brand-navy/30"
            }`}
          >
            Sí
          </button>
        </div>
      </div>

      {values.isMinor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-atmosphere-honey/30 border border-atmosphere-honey rounded-2xl p-4">
          <div>
            <FieldLabel required>Nombre del representante</FieldLabel>
            <input
              type="text"
              value={values.parentName || ""}
              onChange={(e) => onChange("parentName", e.target.value)}
              placeholder="Padre, madre o apoderado"
              className={inputClass}
            />
            <FieldError message={errors.parentName} />
          </div>
          <div>
            <FieldLabel required>Documento del representante</FieldLabel>
            <input
              type="text"
              value={values.parentDocument || ""}
              onChange={(e) => onChange("parentDocument", e.target.value)}
              placeholder="DNI del representante"
              className={inputClass}
            />
            <FieldError message={errors.parentDocument} />
          </div>
        </div>
      )}

      <p className="text-[11px] text-neutral-subtle leading-relaxed">
        Tus datos se usan únicamente para tramitar y responder esta Hoja de Reclamación conforme a la Ley N.° 29571.
      </p>
    </div>
  );
}

export interface ClaimStepDatosHelpPanelProps {
  whatsappPhone?: string;
  whatsappMessage?: string;
  onContinueWithClaim: () => void;
}

/** Panel "Ayuda opcional" del paso 1 — vive en la columna izquierda del shell. */
export function ClaimStepDatosHelpPanel({
  whatsappPhone,
  whatsappMessage,
  onContinueWithClaim,
}: ClaimStepDatosHelpPanelProps) {
  return (
    <div className="bg-white border border-neutral-border rounded-2xl p-5 space-y-3">
      <h2 className="font-sora font-bold text-sm text-brand-navy">¿Podemos ayudarte antes?</h2>
      <p className="text-xs text-neutral-muted leading-relaxed">
        Si se trata de una reserva, pago o cambio de fecha, podemos intentar resolverlo directamente. Tú
        decides cómo continuar.
      </p>
      <div className="flex flex-col gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onContinueWithClaim}>
          Continuar con mi reclamo
        </Button>
        <WhatsAppButton
          size="sm"
          variant="link"
          phone={whatsappPhone}
          message={
            whatsappMessage ||
            "Hola Viajes Carolina, tengo una consulta antes de registrar mi Hoja de Reclamación."
          }
        >
          Intentar una solución rápida ↗
        </WhatsAppButton>
      </div>
      <p className="text-[11px] text-neutral-subtle pt-1">
        Pedir ayuda no limita tu derecho a registrar después.
      </p>
    </div>
  );
}
