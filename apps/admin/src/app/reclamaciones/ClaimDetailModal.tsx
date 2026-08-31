"use client";

import React from "react";
import { apiClient, type ClaimRecordDTO } from "@vc/api-client";
import { Button, FormField, Modal, WhatsAppIcon } from "@vc/ui";
import { useClaimResponseDraft } from "../../hooks/useClaimResponseDraft";
import { buildWhatsAppUrl } from "../../lib/whatsapp";

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

const label = (dictionary: Record<string, string>, value?: string | null) =>
  dictionary[(value || "").toUpperCase()] || value || "No registrado";

const SECTION_CLASSES =
  "space-y-2 rounded-[10px] border border-neutral-border bg-neutral-soft p-4 text-xs text-admin-value";

const SECTION_TITLE_CLASSES = "font-inter text-[13px] font-bold text-neutral-ink";

export interface ClaimDetailModalProps {
  claim: ClaimRecordDTO;
  updating: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string, responseNotes?: string) => void;
}

/**
 * Detalle y respuesta formal de una hoja de reclamación.
 *
 * Se extrajo de `ClaimsInbox` cuando esa pantalla pasó al kit de tabla: el
 * overlay estaba escrito a mano —sin trampa de foco, sin `Escape` y sin
 * devolver el foco al abrir— y ahora lo aporta `Modal`, el mismo chrome que
 * usan el resto de formularios del panel.
 */
export function ClaimDetailModal({
  claim,
  updating,
  onClose,
  onUpdateStatus,
}: ClaimDetailModalProps) {
  const { responseNotes, setResponseNotes } = useClaimResponseDraft(claim);

  return (
    <Modal
      title={`Hoja de reclamación ${claim.claimCode}`}
      description="Registro oficial según Ley N.° 29571. La respuesta que escribas aquí queda asociada al reclamo."
      onClose={onClose}
      maxWidth="3xl"
      closeLabel="Cerrar el detalle de la reclamación"
    >
      <div className="space-y-5">
        <section className={SECTION_CLASSES}>
          <h3 className={SECTION_TITLE_CLASSES}>1. Datos del reclamante</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div><strong>Nombre:</strong> {claim.fullName}</div>
            <div><strong>Documento:</strong> {claim.documentType} {claim.documentNumber}</div>
            <div><strong>Correo:</strong> {claim.email}</div>
            <div><strong>Teléfono:</strong> {claim.phone}</div>
            <div className="sm:col-span-2"><strong>Dirección:</strong> {claim.address}</div>
            {claim.isMinor && (
              <div className="rounded-[8px] border border-danger-border bg-danger-surface p-2 text-danger-ink sm:col-span-2">
                <strong>Menor de edad. Apoderado:</strong> {claim.parentName} ({claim.parentDocument})
              </div>
            )}
          </div>
        </section>

        <section className={SECTION_CLASSES}>
          <h3 className={SECTION_TITLE_CLASSES}>2. Hechos y pedido concreto</h3>
          <div>
            <strong>Bien / servicio:</strong> {claim.contractedType} — {claim.description}
            {claim.claimedAmount && (
              <span className="ml-2 font-mono font-bold text-brand-navy">
                ({claim.currency} {claim.claimedAmount})
              </span>
            )}
          </div>
          <div>
            <strong>Detalle de los hechos:</strong>
            <p className="mt-1 rounded-[8px] border border-neutral-border bg-white p-3">
              {claim.consumerDetail}
            </p>
          </div>
          <div>
            <strong>Pedido concreto:</strong>
            <p className="mt-1 rounded-[8px] border border-neutral-border bg-white p-3">
              {claim.consumerRequest}
            </p>
          </div>
        </section>

        <section className={SECTION_CLASSES}>
          <h3 className={SECTION_TITLE_CLASSES}>3. Servicio y canal de respuesta</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <strong>Servicio relacionado:</strong>{" "}
              {label(RELATED_SERVICE_LABELS, claim.relatedService)}
            </div>
            <div><strong>Código de reserva:</strong> {claim.reservationCode || "No registrado"}</div>
            <div><strong>Fecha del servicio:</strong> {claim.serviceDate || "No registrada"}</div>
            <div>
              <strong>Canal de respuesta:</strong>{" "}
              {label(RESPONSE_CHANNEL_LABELS, claim.responseChannel)}
            </div>
          </div>

          {claim.attachments && claim.attachments.length > 0 && (
            <div className="pt-1">
              <strong>Adjuntos:</strong>
              <ul className="mt-1 space-y-1">
                {claim.attachments.map((attachment) => (
                  <li key={attachment.id}>
                    <a
                      href={apiClient.getAdminClaimAttachmentUrl(claim.id, attachment.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-accent underline hover:text-brand-navy"
                    >
                      {attachment.originalFilename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <div className="space-y-4 border-t border-admin-divider pt-5">
          <FormField
            multiline
            rows={4}
            label="Respuesta oficial de la agencia"
            value={responseNotes}
            onChange={(e) => setResponseNotes(e.target.value)}
            placeholder="Escribe la respuesta formal, la justificación legal o la solución ofrecida al consumidor…"
            hint="Se guarda junto al reclamo al marcar cualquiera de los tres estados."
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* "Una acción principal por bloque": resolver es la principal;
                evaluar y rechazar reducen su jerarquía. */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={updating}
                onClick={() => onUpdateStatus(claim.id, "IN_PROGRESS", responseNotes)}
              >
                Marcar en evaluación
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={updating}
                onClick={() => onUpdateStatus(claim.id, "RESOLVED", responseNotes)}
              >
                Resolver y guardar respuesta
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={updating}
                onClick={() => onUpdateStatus(claim.id, "REJECTED", responseNotes)}
              >
                Rechazar
              </Button>
            </div>

            {claim.phone && (
              <a
                href={buildWhatsAppUrl(
                  claim.phone,
                  `Hola ${claim.fullName}, nos comunicamos de Viajes Carolina respecto a su Hoja de Reclamación ${claim.claimCode}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[7px] border border-neutral-border bg-white px-3.5 py-2 font-inter text-xs font-bold text-brand-navy transition-colors hover:border-brand-navy/40 hover:bg-neutral-soft"
              >
                <WhatsAppIcon size={15} aria-hidden="true" />
                <span>Contactar por WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
