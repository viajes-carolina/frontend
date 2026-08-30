"use client";

import React from "react";
import type { TestimonialDTO } from "@vc/api-client";
import { Button, EditIcon, FormFeedback, PlusIcon, StarIcon, TrashIcon } from "@vc/ui";
import { MediaThumb } from "../../../../components/MediaThumb";
import { useAdminTestimonialItems } from "../../../../hooks/useAdminTestimonialItems";
import { useMediaPicker } from "../../../../hooks/useMediaPicker";
import { TestimonialFormModal } from "../TestimonialFormModal";

export interface TestimonialItemsPanelProps {
  initialTestimonials: TestimonialDTO[];
}

export function TestimonialItemsPanel({ initialTestimonials }: TestimonialItemsPanelProps) {
  const {
    testimonials,
    saving,
    feedback,
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
    <div className="font-inter">
      <FormFeedback feedback={feedback} />

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">
              Testimonios de Clientes
            </h2>
            <p className="mt-1.5 font-inter text-[13px] text-neutral-muted">
              {testimonials.length} testimonios · se muestran en la sección de Experiencias del Home.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<PlusIcon size={16} />}
            iconPosition="left"
            onClick={openCreateTestimonial}
          >
            Nuevo Testimonio
          </Button>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-neutral-border bg-white shadow-[0_8px_24px_rgba(17,34,48,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-admin-divider bg-neutral-soft text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Viaje / Destino</th>
                  <th className="px-6 py-4">Calificación</th>
                  <th className="px-6 py-4">Comentario</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-divider">
                {testimonials.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-neutral-soft">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <MediaThumb
                          url={item.avatarMediaUrl}
                          alt={item.clientName}
                          sizes="40px"
                          iconSize={14}
                          className="h-10 w-10 shrink-0 rounded-full border border-neutral-border"
                          empty={
                            <span className="text-xs font-bold text-brand-navy">
                              {item.clientName.charAt(0)}
                            </span>
                          }
                        />
                        <div>
                          <span className="block text-sm font-bold text-admin-value">{item.clientName}</span>
                          <span className="text-xs text-neutral-muted">{item.clientLocation || "Perú"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-admin-value">{item.tripDestination}</td>
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-0.5 text-brand-accent"
                        aria-label={`${item.rating || 5} de 5 estrellas`}
                      >
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <StarIcon key={i} size={14} aria-hidden="true" />
                        ))}
                      </div>
                    </td>
                    <td className="line-clamp-2 max-w-xs px-6 py-4 text-xs italic text-neutral-muted">
                      &ldquo;{item.comment}&rdquo;
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          item.active
                            ? "border-brand-navy/20 bg-brand-navy/10 text-brand-navy"
                            : "border-neutral-border bg-neutral-soft text-neutral-muted"
                        }`}
                      >
                        {item.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<EditIcon size={14} />}
                          onClick={() => openEditTestimonial(item)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<TrashIcon size={14} />}
                          onClick={() => handleDeleteTestimonial(item.id)}
                        >
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
      </div>

      <TestimonialFormModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        onSubmit={handleSaveTestimonial}
        isEditing={!!editingTestimonial}
        saving={saving}
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
