"use client";

import React from "react";

export interface ClaimStepRevisarData {
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  isMinor?: boolean;
  parentName?: string;
  parentDocument?: string;
  claimType: string;
  relatedService: string;
  description: string;
  claimedAmount?: number;
  currency?: string;
  reservationCode?: string;
  serviceDate?: string;
  consumerDetail: string;
  consumerRequest: string;
  responseChannel: string;
  attachments: File[];
}

export interface ClaimStepRevisarProps {
  data: ClaimStepRevisarData;
  declaredTruth: boolean;
  onDeclaredTruthChange: (value: boolean) => void;
  onEditStep: (step: number) => void;
  error?: string | null;
}

const CLAIM_TYPE_LABELS: Record<string, string> = {
  RECLAMO: "Reclamo",
  QUEJA: "Queja",
};

const RELATED_SERVICE_LABELS: Record<string, string> = {
  PAQUETE: "Paquete turístico",
  PASAJE: "Pasaje",
  ALOJAMIENTO: "Alojamiento",
  ASESORIA: "Asesoría",
  OTRO: "Otro",
};

const RESPONSE_CHANNEL_LABELS: Record<string, string> = {
  EMAIL: "Correo electrónico",
  CARTA: "Carta al domicilio",
};

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] font-bold text-brand-accent hover:text-brand-navy transition-colors shrink-0"
    >
      Editar
    </button>
  );
}

function SummarySection({
  eyebrow,
  onEdit,
  children,
}: {
  eyebrow: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-soft border border-neutral-border rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-muted">{eyebrow}</span>
        <EditLink onClick={onEdit} />
      </div>
      <div className="text-xs text-brand-navy leading-relaxed space-y-1">{children}</div>
    </div>
  );
}

/** Paso 4 del asistente: resumen editable + declaración jurada antes de registrar. */
export function ClaimStepRevisar({
  data,
  declaredTruth,
  onDeclaredTruthChange,
  onEditStep,
  error,
}: ClaimStepRevisarProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl text-brand-navy mb-1">Revisa antes de registrar.</h2>
        <p className="text-sm text-neutral-muted">
          Puedes volver a cualquier paso y corregir la información antes del envío.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{error}</div>
      )}

      <div className="space-y-3">
        <SummarySection eyebrow="Consumidor" onEdit={() => onEditStep(1)}>
          <p>
            <strong>{data.fullName}</strong> · {data.documentType} {data.documentNumber}
          </p>
          <p>
            {data.email} · {data.phone}
          </p>
          <p>{data.address}</p>
          {data.isMinor && (
            <p className="text-amber-700">
              Menor de edad · Representante: {data.parentName} ({data.parentDocument})
            </p>
          )}
        </SummarySection>

        <SummarySection eyebrow="Tipo y servicio" onEdit={() => onEditStep(2)}>
          <p>
            <strong>{CLAIM_TYPE_LABELS[data.claimType.toUpperCase()] || data.claimType}</strong> ·{" "}
            {RELATED_SERVICE_LABELS[data.relatedService.toUpperCase()] || data.relatedService}
          </p>
          <p>{data.description}</p>
          <p>
            {data.claimedAmount != null
              ? `${data.currency || "PEN"} ${data.claimedAmount.toFixed(2)}`
              : "Sin monto especificado"}
            {data.serviceDate ? ` · ${data.serviceDate}` : ""}
          </p>
          {data.reservationCode && <p>Código de reserva: {data.reservationCode}</p>}
        </SummarySection>

        <SummarySection eyebrow="Detalle" onEdit={() => onEditStep(3)}>
          <p>{data.consumerDetail}</p>
        </SummarySection>

        <SummarySection eyebrow="Pedido" onEdit={() => onEditStep(3)}>
          <p>{data.consumerRequest}</p>
        </SummarySection>

        <SummarySection eyebrow="Respuesta" onEdit={() => onEditStep(3)}>
          <p>{RESPONSE_CHANNEL_LABELS[data.responseChannel.toUpperCase()] || data.responseChannel}</p>
          <p className="text-neutral-muted">
            {data.attachments.length > 0
              ? `${data.attachments.length} archivo(s) adjunto(s)`
              : "Sin archivos adjuntos"}
          </p>
        </SummarySection>
      </div>

      <div className="bg-atmosphere-pale-sky rounded-2xl p-4">
        <p className="text-xs text-brand-navy leading-relaxed">
          Registrar una Hoja de Reclamación no constituye una denuncia ante Indecopi ni inicia por sí sola
          un procedimiento sancionador.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={declaredTruth}
          onChange={(e) => onDeclaredTruthChange(e.target.checked)}
          className="w-5 h-5 mt-0.5 rounded text-brand-accent focus:ring-brand-accent"
        />
        <span className="text-xs text-neutral-muted leading-relaxed">
          Declaro bajo juramento que los datos e información consignados en la presente Hoja de
          Reclamación son verdaderos y fidedignos, de conformidad con la Ley N.° 29571.
        </span>
      </label>

      <p className="text-[11px] text-neutral-subtle flex items-center gap-1.5">
        🔒 Formulario protegido con verificación anti-bot
      </p>
    </div>
  );
}
