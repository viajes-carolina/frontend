"use client";

import React, { useState } from "react";
import { apiClient } from "@vc/api-client";
import type { ClaimRecordDTO } from "@vc/api-client";
import { CloseIcon, FormFeedback, TableSkeleton } from "@vc/ui";
import { useAdminClaims } from "../../hooks/useAdminClaims";
import { buildWhatsAppUrl } from "../../lib/whatsapp";

/* Paleta de estado del reclamo, en tokens del panel. `danger-*` queda
   reservado para lo que exige atención (un reclamo sin atender corre plazo
   legal), el acento marca el trabajo en curso, el navy el caso cerrado con
   respuesta y el neutro el caso cerrado sin lugar. */
const STATUS_BADGE_BASE =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold";

const STATUS_BADGE_TONES: Record<string, string> = {
  RESOLVED: "border-brand-navy/20 bg-brand-navy/10 text-brand-navy",
  IN_PROGRESS: "border-brand-accent/35 bg-brand-accent/10 text-brand-accent",
  REJECTED: "border-neutral-border bg-neutral-surface text-neutral-muted",
  PENDING: "border-danger-border bg-danger-surface text-danger-ink",
};

const MODAL_ACTION_BASE =
  "rounded-xl border px-3.5 py-2 font-inter text-xs font-bold transition-all disabled:opacity-50";

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

interface ClaimsInboxProps {
  initialClaims: ClaimRecordDTO[];
}

export const ClaimsInbox: React.FC<ClaimsInboxProps> = ({ initialClaims }) => {
  const {
    claims,
    statusFilter,
    loading,
    selectedClaim,
    setSelectedClaim,
    updating,
    feedback,
    handleFilterChange,
    updateStatus,
  } = useAdminClaims(initialClaims);

  const [responseInput, setResponseInput] = useState("");

  const handleOpenModal = (claim: ClaimRecordDTO) => {
    setSelectedClaim(claim);
    setResponseInput(claim.responseNotes || "");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <span className={`${STATUS_BADGE_BASE} ${STATUS_BADGE_TONES.RESOLVED}`}>Atendido</span>;
      case "IN_PROGRESS":
        return <span className={`${STATUS_BADGE_BASE} ${STATUS_BADGE_TONES.IN_PROGRESS}`}>En Evaluación</span>;
      case "REJECTED":
        return <span className={`${STATUS_BADGE_BASE} ${STATUS_BADGE_TONES.REJECTED}`}>Rechazado</span>;
      case "PENDING":
      default:
        return <span className={`${STATUS_BADGE_BASE} ${STATUS_BADGE_TONES.PENDING}`}>Pendiente</span>;
    }
  };

  return (
    <div className="font-inter">
      {/* Notifications */}
      <FormFeedback feedback={feedback} />

      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-border pb-3">
          {[
            { key: "ALL", label: "Todos los Reclamos" },
            { key: "PENDING", label: "Pendientes" },
            { key: "IN_PROGRESS", label: "En Evaluación" },
            { key: "RESOLVED", label: "Atendidos" },
            { key: "REJECTED", label: "Rechazados" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.key
                  ? "border border-brand-navy bg-brand-navy text-white shadow-sm"
                  : "border border-neutral-border bg-white text-neutral-muted hover:bg-neutral-surface hover:text-neutral-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : claims.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-muted">
              No se encontraron hojas de reclamación con el filtro seleccionado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-admin-value">
                <thead className="bg-neutral-soft text-admin-label font-bold uppercase tracking-[0.55px] border-b border-admin-divider">
                  <tr>
                    <th className="py-3.5 px-4">Código</th>
                    <th className="py-3.5 px-4">Fecha</th>
                    <th className="py-3.5 px-4">Consumidor</th>
                    <th className="py-3.5 px-4">Documento</th>
                    <th className="py-3.5 px-4">Tipo</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-divider">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-neutral-soft transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                        {claim.claimCode}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-muted">
                        {new Date(claim.createdAt || "").toLocaleDateString("es-PE")}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-admin-value">
                        {claim.fullName}
                      </td>
                      <td className="py-3.5 px-4">
                        {claim.documentType}: {claim.documentNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-admin-value">{claim.claimType}</span> ({claim.contractedType})
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(claim.status)}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(claim)}
                          className="px-3 py-1.5 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent font-bold rounded-lg text-[11px] transition-all"
                        >
                          Ver Detalle & Responder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Detalle y Respuesta Formal */}
        {selectedClaim && (
          <div className="fixed inset-0 z-50 bg-brand-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-fade-in border border-neutral-border shadow-[0_16px_48px_rgba(17,34,48,0.22)]">
              <div className="flex items-center justify-between border-b border-admin-divider pb-4">
                <div>
                  <span className="text-xs text-neutral-muted font-medium">Hoja de Reclamación Oficial</span>
                  <h3 className="text-xl font-black text-brand-navy font-mono">
                    {selectedClaim.claimCode}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedClaim(null)}
                  aria-label="Cerrar detalle de reclamación"
                  className="rounded-[7px] p-2 text-neutral-muted transition-colors hover:bg-neutral-soft hover:text-neutral-ink"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              {/* Consumer Info */}
              <div className="bg-neutral-soft rounded-2xl p-4 border border-neutral-border text-xs space-y-2">
                <div className="font-bold text-admin-value text-sm mb-1">1. Datos del Reclamante</div>
                <div className="grid grid-cols-2 gap-2 text-admin-value">
                  <div><strong>Nombre:</strong> {selectedClaim.fullName}</div>
                  <div><strong>Documento:</strong> {selectedClaim.documentType} {selectedClaim.documentNumber}</div>
                  <div><strong>Email:</strong> {selectedClaim.email}</div>
                  <div><strong>Teléfono:</strong> {selectedClaim.phone}</div>
                  <div className="col-span-2"><strong>Dirección:</strong> {selectedClaim.address}</div>
                  {selectedClaim.isMinor && (
                    <div className="col-span-2 rounded-lg border border-danger-border bg-danger-surface p-2 text-danger-ink">
                      <strong>Menor de edad. Apoderado:</strong> {selectedClaim.parentName} ({selectedClaim.parentDocument})
                    </div>
                  )}
                </div>
              </div>

              {/* Facts & Request */}
              <div className="bg-neutral-soft rounded-2xl p-4 border border-neutral-border text-xs space-y-3">
                <div className="font-bold text-admin-value text-sm">2. Hechos y Pedido Concreto</div>
                <div>
                  <strong className="text-admin-value">Bien / Servicio:</strong> {selectedClaim.contractedType} — {selectedClaim.description}
                  {selectedClaim.claimedAmount && (
                    <span className="ml-2 font-mono text-brand-navy font-bold">
                      ({selectedClaim.currency} {selectedClaim.claimedAmount})
                    </span>
                  )}
                </div>
                <div>
                  <strong className="text-admin-value">Detalle de los hechos:</strong>
                  <p className="text-admin-value mt-1 bg-white p-3 rounded-xl border border-neutral-border">
                    {selectedClaim.consumerDetail}
                  </p>
                </div>
                <div>
                  <strong className="text-admin-value">Pedido Concreto:</strong>
                  <p className="text-admin-value mt-1 bg-white p-3 rounded-xl border border-neutral-border">
                    {selectedClaim.consumerRequest}
                  </p>
                </div>
              </div>

              {/* Servicio relacionado, reserva, fecha y canal de respuesta */}
              <div className="bg-neutral-soft rounded-2xl p-4 border border-neutral-border text-xs space-y-2">
                <div className="font-bold text-admin-value text-sm mb-1">3. Servicio y Canal de Respuesta</div>
                <div className="grid grid-cols-2 gap-2 text-admin-value">
                  <div>
                    <strong>Servicio relacionado:</strong>{" "}
                    {RELATED_SERVICE_LABELS[(selectedClaim.relatedService || "").toUpperCase()] ||
                      selectedClaim.relatedService ||
                      "—"}
                  </div>
                  <div>
                    <strong>Código de reserva:</strong> {selectedClaim.reservationCode || "—"}
                  </div>
                  <div>
                    <strong>Fecha del servicio:</strong> {selectedClaim.serviceDate || "—"}
                  </div>
                  <div>
                    <strong>Canal de respuesta:</strong>{" "}
                    {RESPONSE_CHANNEL_LABELS[(selectedClaim.responseChannel || "").toUpperCase()] ||
                      selectedClaim.responseChannel ||
                      "—"}
                  </div>
                </div>

                {selectedClaim.attachments && selectedClaim.attachments.length > 0 && (
                  <div className="pt-2">
                    <strong className="text-admin-value">Adjuntos:</strong>
                    <ul className="mt-1 space-y-1">
                      {selectedClaim.attachments.map((attachment) => (
                        <li key={attachment.id}>
                          <a
                            href={apiClient.getAdminClaimAttachmentUrl(selectedClaim.id, attachment.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-accent hover:text-brand-navy font-semibold underline"
                          >
                            {attachment.originalFilename}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Response Section */}
              <div className="space-y-4 pt-2 border-t border-admin-divider">
                <label className="block font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
                  Respuesta Oficial de la Agencia
                </label>
                <textarea
                  rows={4}
                  value={responseInput}
                  onChange={(e) => setResponseInput(e.target.value)}
                  placeholder="Escribe la respuesta formal, justificación legal o solución ofrecida al consumidor..."
                  className="w-full px-4 py-3 bg-admin-field border border-admin-field-border rounded-xl font-inter text-xs text-admin-value transition-colors placeholder:text-admin-footnote/70 hover:border-admin-checkbox focus:border-brand-accent focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
                />

                <div className="flex flex-wrap gap-2 items-center justify-between pt-2">
                  <div className="flex gap-2">
                    <button
                      disabled={updating}
                      onClick={() => updateStatus(selectedClaim.id, "IN_PROGRESS", responseInput)}
                      className={`${MODAL_ACTION_BASE} border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5`}
                    >
                      Marcar En Evaluación
                    </button>
                    <button
                      disabled={updating}
                      onClick={() => updateStatus(selectedClaim.id, "RESOLVED", responseInput)}
                      className={`${MODAL_ACTION_BASE} border-brand-accent bg-brand-accent text-on-accent hover:opacity-90`}
                    >
                      Resolver & Guardar Respuesta
                    </button>
                    <button
                      disabled={updating}
                      onClick={() => updateStatus(selectedClaim.id, "REJECTED", responseInput)}
                      className={`${MODAL_ACTION_BASE} border-danger-border bg-danger-surface text-danger-ink hover:brightness-[0.97]`}
                    >
                      Rechazar
                    </button>
                  </div>

                  {selectedClaim.phone && (
                    <a
                      href={buildWhatsAppUrl(
                        selectedClaim.phone,
                        `Hola ${selectedClaim.fullName}, nos comunicamos de Viajes Carolina respecto a su Hoja de Reclamación ${selectedClaim.claimCode}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-border bg-white px-3.5 py-2 font-inter text-xs font-bold text-brand-navy transition-colors hover:border-brand-navy/40 hover:bg-neutral-soft"
                    >
                      <span>💬 Contactar por WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
