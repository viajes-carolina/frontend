"use client";

import React, { useState } from "react";
import { ContactInquiryDTO } from "@vc/api-client";
import { Button, WhatsAppIcon, MailIcon, PhoneIcon, CheckIcon, StarIcon } from "@vc/ui";

export interface InquiryInboxProps {
  inquiries: ContactInquiryDTO[];
  statusFilter: string;
  onFilterChange: (status: string) => void;
  onUpdateStatus: (id: number, status: string) => Promise<boolean>;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  NEW: {
    label: "NUEVO",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  IN_PROGRESS: {
    label: "EN ATENCIÓN",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  CONTACTED: {
    label: "CONTACTADO",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  ARCHIVED: {
    label: "ARCHIVADO",
    bg: "bg-neutral-100",
    text: "text-neutral-600",
    border: "border-neutral-200",
  },
};

export function InquiryInbox({
  inquiries,
  statusFilter,
  onFilterChange,
  onUpdateStatus,
}: InquiryInboxProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    await onUpdateStatus(id, newStatus);
    setUpdatingId(null);
  };

  const getWhatsAppLeadUrl = (inquiry: ContactInquiryDTO) => {
    if (!inquiry.phone) return null;
    const cleanPhone = inquiry.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hola ${inquiry.fullName.split(" ")[0]}, te saludamos de Viajes Carolina. Recibimos tu consulta sobre ${
        inquiry.destinationOfInterest || "tu próximo viaje"
      }. ¿Cómo podemos ayudarte a diseñar tu itinerario ideal?`
    );
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-border shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "ALL", label: "Todas las Consultas" },
            { key: "NEW", label: "Nuevas" },
            { key: "IN_PROGRESS", label: "En Atención" },
            { key: "CONTACTED", label: "Contactadas" },
            { key: "ARCHIVED", label: "Archivadas" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-inter transition-all ${
                statusFilter === tab.key
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-neutral-light text-neutral-dark hover:bg-neutral-border/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-inter text-neutral-muted">
          Total: <strong>{inquiries.length}</strong> solicitudes
        </span>
      </div>

      {/* Inquiry List Cards */}
      {inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-border p-12 text-center space-y-3">
          <p className="font-sora font-semibold text-neutral-dark text-base">
            No hay solicitudes en esta sección
          </p>
          <p className="font-inter text-neutral-muted text-xs">
            Las nuevas consultas enviadas desde el formulario público aparecerán aquí en tiempo real.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const statusStyle = STATUS_CONFIG[inq.status] || STATUS_CONFIG.NEW;
            const waUrl = getWhatsAppLeadUrl(inq);

            return (
              <div
                key={inq.id}
                className="bg-white rounded-2xl border border-neutral-border p-6 shadow-sm hover:border-brand-accent/40 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent font-sora font-bold text-sm flex items-center justify-center">
                      {inq.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-base text-brand-navy">
                        {inq.fullName}
                      </h3>
                      <span className="font-inter text-xs text-neutral-muted">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleString("es-PE") : "Fecha reciente"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Turnstile Verified Badge */}
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      <CheckIcon size={12} /> Anti-Bot OK
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-bold font-inter px-3 py-1 rounded-lg border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-inter text-neutral-dark bg-neutral-light/50 p-4 rounded-xl">
                  <div>
                    <span className="block text-[11px] text-neutral-muted font-semibold">Correo Electrónico</span>
                    <a href={`mailto:${inq.email}`} className="text-brand-accent font-medium hover:underline">
                      {inq.email}
                    </a>
                  </div>

                  <div>
                    <span className="block text-[11px] text-neutral-muted font-semibold">Teléfono / WhatsApp</span>
                    <span className="font-medium text-neutral-dark">
                      {inq.phone || "No especificado"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-neutral-muted font-semibold">Destino de Interés</span>
                    <span className="font-semibold text-brand-navy">
                      {inq.destinationOfInterest || "General"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-neutral-muted font-semibold">Fecha / Viajeros</span>
                    <span className="text-neutral-dark">
                      {inq.travelDateApprox || "Flexible"} · {inq.travelersCount} persona(s)
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider font-inter">
                    Mensaje del Cliente:
                  </span>
                  <p className="text-sm font-inter text-neutral-dark leading-relaxed bg-white border border-neutral-border/80 p-3.5 rounded-xl">
                    "{inq.message}"
                  </p>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-muted font-inter">Cambiar estado:</span>
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-border text-xs font-semibold font-inter bg-white text-neutral-dark focus:outline-none focus:border-brand-accent cursor-pointer"
                    >
                      <option value="NEW">Nuevo</option>
                      <option value="IN_PROGRESS">En Atención</option>
                      <option value="CONTACTED">Contactado</option>
                      <option value="ARCHIVED">Archivado</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {waUrl && (
                      <a href={waUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="whatsapp"
                          size="sm"
                          icon={<WhatsAppIcon size={16} />}
                        >
                          Responder por WhatsApp
                        </Button>
                      </a>
                    )}
                    <a href={`mailto:${inq.email}?subject=Cotizaci%C3%B3n%20Viajes%20Carolina%20-%20${encodeURIComponent(inq.destinationOfInterest || "Tu Viaje")}`}>
                      <Button variant="outline" size="sm" icon={<MailIcon size={16} />}>
                        Enviar Correo
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
