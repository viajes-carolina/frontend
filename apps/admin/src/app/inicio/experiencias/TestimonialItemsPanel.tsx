"use client";

import React from "react";
import Image from "next/image";
import { TestimonialDTO } from "@vc/api-client";
import { useAdminTestimonialItems } from "../../../hooks/useAdminTestimonialItems";
import { useMediaPicker } from "../../../hooks/useMediaPicker";
import { Button, PlusIcon, EditIcon, TrashIcon, CheckIcon, StarIcon } from "@vc/ui";
import { TestimonialFormModal } from "./TestimonialFormModal";

export interface TestimonialItemsPanelProps {
  initialTestimonials: TestimonialDTO[];
}

export function TestimonialItemsPanel({ initialTestimonials }: TestimonialItemsPanelProps) {
  const {
    testimonials,
    statusMessage,
    isTestimonialModalOpen, setIsTestimonialModalOpen,
    editingTestimonial,
    clientName, setClientName,
    clientLocation, setClientLocation,
    tripDestination, setTripDestination,
    comment, setComment,
    rating, setRating,
    avatarMediaId, avatarMediaUrl,
    consentConfirmed, setConsentConfirmed,
    testimonialDisplayOrder, setTestimonialDisplayOrder,
    testimonialActive, setTestimonialActive,
    isAvatarPickerOpen, setIsAvatarPickerOpen,
    openCreateTestimonial, openEditTestimonial,
    handleSelectAvatar, handleSaveTestimonial, handleDeleteTestimonial,
  } = useAdminTestimonialItems(initialTestimonials);

  const avatarPicker = useMediaPicker(isAvatarPickerOpen);

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Testimonios de Clientes</h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            {testimonials.length} testimonios · se muestran en la sección de Experiencias del Home.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<PlusIcon size={18} />} onClick={openCreateTestimonial}>
          Nuevo Testimonio
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-border bg-neutral-surface/50 text-[11px] font-sora font-bold text-neutral-muted uppercase tracking-wider">
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Viaje / Destino</th>
                <th className="py-4 px-6">Calificación</th>
                <th className="py-4 px-6">Comentario</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {testimonials.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-surface/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 flex items-center justify-center">
                        {item.avatarMediaUrl ? (
                          <Image
                            src={item.avatarMediaUrl.startsWith("http") || item.avatarMediaUrl.startsWith("/") ? item.avatarMediaUrl : `/${item.avatarMediaUrl}`}
                            alt={item.clientName}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <span className="font-sora font-bold text-xs text-brand-navy">
                            {item.clientName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-sora font-bold text-sm text-brand-navy block">
                          {item.clientName}
                        </span>
                        <span className="font-inter text-xs text-neutral-muted">
                          {item.clientLocation || "Perú"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-inter text-xs text-brand-navy font-semibold">
                    {item.tripDestination}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <StarIcon key={i} size={14} />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-xs font-inter text-xs text-neutral-muted line-clamp-2 italic">
                    "{item.comment}"
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-neutral-surface text-neutral-muted border border-neutral-border"
                      }`}
                    >
                      {item.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" icon={<EditIcon size={14} />} onClick={() => openEditTestimonial(item)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" icon={<TrashIcon size={14} />} onClick={() => handleDeleteTestimonial(item.id)}>
                        Desactivar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TestimonialFormModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        onSubmit={handleSaveTestimonial}
        isEditing={!!editingTestimonial}
        clientName={clientName}
        setClientName={setClientName}
        clientLocation={clientLocation}
        setClientLocation={setClientLocation}
        tripDestination={tripDestination}
        setTripDestination={setTripDestination}
        comment={comment}
        setComment={setComment}
        rating={rating}
        setRating={setRating}
        avatarMediaId={avatarMediaId}
        avatarMediaUrl={avatarMediaUrl}
        consentConfirmed={consentConfirmed}
        setConsentConfirmed={setConsentConfirmed}
        displayOrder={testimonialDisplayOrder}
        setDisplayOrder={setTestimonialDisplayOrder}
        active={testimonialActive}
        setActive={setTestimonialActive}
        isAvatarPickerOpen={isAvatarPickerOpen}
        setIsAvatarPickerOpen={setIsAvatarPickerOpen}
        onSelectAvatar={handleSelectAvatar}
        avatarPickerItems={avatarPicker.items}
        avatarPickerLoading={avatarPicker.loading}
        onUploadAvatarFile={avatarPicker.uploadFile}
        onAvatarFocalPointSave={avatarPicker.saveFocalPoint}
      />
    </div>
  );
}
