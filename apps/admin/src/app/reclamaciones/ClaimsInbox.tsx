"use client";

import React, { useState } from "react";
import { apiClient } from "@vc/api-client";
import type { ClaimRecordDTO } from "@vc/api-client";
import { CloseIcon } from "@vc/ui";
import { useAdminClaims } from "../../hooks/useAdminClaims";
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
    error,
    successMessage,
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
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">Atendido</span>;
      case "IN_PROGRESS":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">En Evaluación</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800">Rechazado</span>;
      case "PENDING":
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">Pendiente</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          {successMessage}
        </div>
      )}

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
                ? "bg-brand-navy text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-muted">Cargando registros...</div>
        ) : claims.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-muted">
            No se encontraron hojas de reclamación con el filtro seleccionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-neutral-border">
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
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                      {claim.claimCode}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(claim.createdAt || "").toLocaleDateString("es-PE")}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {claim.fullName}
                    </td>
                    <td className="py-3.5 px-4">
                      {claim.documentType}: {claim.documentNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{claim.claimType}</span> ({claim.contractedType})
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Hoja de Reclamación Oficial</span>
                <h3 className="text-xl font-black text-brand-navy font-mono">
                  {selectedClaim.claimCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                aria-label="Cerrar detalle de reclamación"
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-2"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Consumer Info */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 text-sm mb-1">1. Datos del Reclamante</div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div><strong>Nombre:</strong> {selectedClaim.fullName}</div>
                <div><strong>Documento:</strong> {selectedClaim.documentType} {selectedClaim.documentNumber}</div>
                <div><strong>Email:</strong> {selectedClaim.email}</div>
                <div><strong>Teléfono:</strong> {selectedClaim.phone}</div>
                <div className="col-span-2"><strong>Dirección:</strong> {selectedClaim.address}</div>
                {selectedClaim.isMinor && (
                  <div className="col-span-2 text-amber-800 bg-amber-50 p-2 rounded-lg">
                    <strong>Menor de edad. Apoderado:</strong> {selectedClaim.parentName} ({selectedClaim.parentDocument})
                  </div>
                )}
              </div>
            </div>

            {/* Facts & Request */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3">
              <div className="font-bold text-slate-900 text-sm">2. Hechos y Pedido Concreto</div>
              <div>
                <strong className="text-slate-900">Bien / Servicio:</strong> {selectedClaim.contractedType} — {selectedClaim.description}
                {selectedClaim.claimedAmount && (
                  <span className="ml-2 font-mono text-brand-navy font-bold">
                    ({selectedClaim.currency} {selectedClaim.claimedAmount})
                  </span>
                )}
              </div>
              <div>
                <strong className="text-slate-900">Detalle de los hechos:</strong>
                <p className="text-slate-700 mt-1 bg-white p-3 rounded-xl border border-slate-200">
                  {selectedClaim.consumerDetail}
                </p>
              </div>
              <div>
                <strong className="text-slate-900">Pedido Concreto:</strong>
                <p className="text-slate-700 mt-1 bg-white p-3 rounded-xl border border-slate-200">
                  {selectedClaim.consumerRequest}
                </p>
              </div>
            </div>

            {/* Servicio relacionado, reserva, fecha y canal de respuesta */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 text-sm mb-1">3. Servicio y Canal de Respuesta</div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
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
                  <strong className="text-slate-900">Adjuntos:</strong>
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
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Respuesta Oficial de la Agencia
              </label>
              <textarea
                rows={4}
                value={responseInput}
                onChange={(e) => setResponseInput(e.target.value)}
                placeholder="Escribe la respuesta formal, justificación legal o solución ofrecida al consumidor..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
              />

              <div className="flex flex-wrap gap-2 items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button
                    disabled={updating}
                    onClick={() => updateStatus(selectedClaim.id, "IN_PROGRESS", responseInput)}
                    className="px-3.5 py-2 bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
                  >
                    Marcar En Evaluación
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => updateStatus(selectedClaim.id, "RESOLVED", responseInput)}
                    className="px-3.5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
                  >
                    Resolver & Guardar Respuesta
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => updateStatus(selectedClaim.id, "REJECTED", responseInput)}
                    className="px-3.5 py-2 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
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
                    className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
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
  );
};
