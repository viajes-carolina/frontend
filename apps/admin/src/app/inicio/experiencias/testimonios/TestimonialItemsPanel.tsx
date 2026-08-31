"use client";

import React from "react";
import type { TestimonialDTO } from "@vc/api-client";
import { ConfirmDialog, FormFeedback } from "@vc/ui";
import { AdminDataTable, useDataTable } from "../../../../components/table";
import { useAdminTestimonialItems } from "../../../../hooks/useAdminTestimonialItems";
import { useMediaPicker } from "../../../../hooks/useMediaPicker";
import { TestimonialFormModal } from "../TestimonialFormModal";
import {
  buildTestimonialColumns,
  searchInTestimonial,
  TESTIMONIAL_FILTERS,
} from "./testimonialItemsTable";

export interface TestimonialItemsPanelProps {
  initialTestimonials: TestimonialDTO[];
}

export function TestimonialItemsPanel({ initialTestimonials }: TestimonialItemsPanelProps) {
  const {
    testimonials,
    loading,
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
    deactivateConfirmation,
  } = useAdminTestimonialItems(initialTestimonials);

  const avatarPicker = useMediaPicker(isAvatarPickerOpen);

  const table = useDataTable<TestimonialDTO>({
    rows: testimonials,
    getRowId: (t) => String(t.id),
    searchIn: searchInTestimonial,
    filters: TESTIMONIAL_FILTERS,
  });

  const columns = React.useMemo(
    () =>
      buildTestimonialColumns({
        onEdit: openEditTestimonial,
        onDeactivate: handleDeleteTestimonial,
      }),
    [openEditTestimonial, handleDeleteTestimonial]
  );

  return (
    <div className="font-inter">
      <FormFeedback feedback={feedback} />

      <div className="space-y-4">
        <div>
          <h2 className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">
            Testimonios de Clientes
          </h2>
          <p className="mt-1.5 font-inter text-[13px] text-neutral-muted">
            Los testimonios activos se muestran en la sección de Experiencias de la portada.
          </p>
        </div>

        <AdminDataTable
          controller={table}
          columns={columns}
          caption="Testimonios de clientes de la portada"
          loading={loading}
          searchPlaceholder="Buscar por cliente, destino o comentario…"
          searchLabel="Buscar entre los testimonios"
          createAction={{ label: "Nuevo testimonio", onSelect: openCreateTestimonial }}
          itemNoun="testimonios"
          minWidthClassName="min-w-[980px]"
          getRowLabel={(t) => `el testimonio de «${t.clientName}»`}
          emptyState={{
            title: "Aún no hay testimonios",
            description:
              "Publica el primer testimonio con consentimiento del viajero para dar prueba social a la portada.",
            action: { label: "Nuevo testimonio", onSelect: openCreateTestimonial },
          }}
          noResultsState={{
            title: "Ningún testimonio coincide",
            description:
              "No hay testimonios para esta búsqueda o filtro. Los demás siguen guardados: quítalo para volver a verlos.",
          }}
        />
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

      <ConfirmDialog {...deactivateConfirmation} />
    </div>
  );
}
