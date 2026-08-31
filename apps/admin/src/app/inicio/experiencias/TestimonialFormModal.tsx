"use client";

import React from "react";
import Image from "next/image";
import type { MediaAssetDTO } from "@vc/api-client";
import {
  Button,
  Checkbox,
  FormField,
  ImageIcon,
  MediaPickerModal,
  Modal,
  StarIcon,
  Toggle,
  FORM_LABEL_CLASSES,
} from "@vc/ui";

export interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  saving?: boolean;
  clientName: string;
  setClientName: (val: string) => void;
  clientLocation: string;
  setClientLocation: (val: string) => void;
  tripDestination: string;
  setTripDestination: (val: string) => void;
  comment: string;
  setComment: (val: string) => void;
  rating: number;
  setRating: (val: number) => void;
  avatarMediaId?: number;
  avatarMediaUrl?: string;
  consentConfirmed: boolean;
  setConsentConfirmed: (val: boolean) => void;
  displayOrder: number;
  setDisplayOrder: (val: number) => void;
  active: boolean;
  setActive: (val: boolean) => void;
  isAvatarPickerOpen: boolean;
  setIsAvatarPickerOpen: (val: boolean) => void;
  onSelectAvatar: (media: MediaAssetDTO) => void;
  avatarPickerItems: MediaAssetDTO[];
  avatarPickerLoading: boolean;
  onUploadAvatarFile: (file: File) => Promise<MediaAssetDTO>;
  onAvatarFocalPointSave: (id: number, payload: { focalX: number; focalY: number }) => Promise<void>;
}

export function TestimonialFormModal({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  saving = false,
  clientName,
  setClientName,
  clientLocation,
  setClientLocation,
  tripDestination,
  setTripDestination,
  comment,
  setComment,
  rating,
  setRating,
  avatarMediaId,
  avatarMediaUrl,
  consentConfirmed,
  setConsentConfirmed,
  active,
  setActive,
  isAvatarPickerOpen,
  setIsAvatarPickerOpen,
  onSelectAvatar,
  avatarPickerItems,
  avatarPickerLoading,
  onUploadAvatarFile,
  onAvatarFocalPointSave,
}: TestimonialFormModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      title={isEditing ? "Editar Testimonio de Viajero" : "Nuevo Testimonio"}
      description="Registra la experiencia real de un cliente con consentimiento expreso."
      onClose={onClose}
      closeLabel="Cerrar formulario de testimonio"
    >
      <form onSubmit={onSubmit}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Nombre del Cliente o Familia"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Mariana & Gonzalo Torres"
              required
            />
            <FormField
              label="Ubicación o Procedencia"
              type="text"
              value={clientLocation}
              onChange={(e) => setClientLocation(e.target.value)}
              placeholder="Lima, Perú"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Destino o Tipo de Viaje"
              type="text"
              value={tripDestination}
              onChange={(e) => setTripDestination(e.target.value)}
              placeholder="Luna de Miel en Punta Cana"
              required
            />

            <fieldset className="space-y-2">
              <legend className={FORM_LABEL_CLASSES}>Calificación (Estrellas)</legend>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    aria-label={`Calificar con ${val} ${val === 1 ? "estrella" : "estrellas"}`}
                    aria-pressed={val === rating}
                    className={`rounded-[4px] p-1 transition-transform hover:scale-125 ${
                      val <= rating ? "text-brand-accent" : "text-admin-checkbox"
                    }`}
                  >
                    <StarIcon size={22} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <FormField
            label="Cita / Testimonio del Cliente"
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Desde que escribimos por WhatsApp nos atendieron con muchísima paciencia..."
            required
          />

          {/* Avatar */}
          <div className="space-y-2">
            <span className={FORM_LABEL_CLASSES}>Foto del Cliente / Avatar</span>
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-neutral-border bg-neutral-surface">
                {avatarMediaUrl ? (
                  <Image
                    src={
                      avatarMediaUrl.startsWith("http") || avatarMediaUrl.startsWith("/")
                        ? avatarMediaUrl
                        : `/${avatarMediaUrl}`
                    }
                    alt="Avatar del cliente"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-muted">
                    {clientName ? clientName.charAt(0) : <ImageIcon size={18} aria-hidden="true" />}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                icon={<ImageIcon size={14} aria-hidden="true" />}
                iconPosition="left"
                onClick={() => setIsAvatarPickerOpen(true)}
              >
                {avatarMediaId ? "Cambiar Foto" : "Seleccionar de Medios"}
              </Button>
            </div>
          </div>

          <div className="space-y-3 border-t border-admin-divider pt-5">
            {/* Casilla del kit: la de antes era un `<input>` suelto con
                `accent-brand-accent`, fuera de la anatomía 18x18/radio 4 y sin
                el anillo de foco que la guía exige. */}
            <Checkbox
              checked={consentConfirmed}
              onChange={(e) => setConsentConfirmed(e.target.checked)}
              required
              wrapperClassName="items-start"
              label="He verificado el consentimiento expreso del cliente para publicar su opinión y datos."
            />

            <Toggle
              checked={active}
              onChange={setActive}
              label="Testimonio activo y visible en portada"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-admin-divider pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Testimonio"}
          </Button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        onSelect={onSelectAvatar}
        selectedMediaId={avatarMediaId}
        items={avatarPickerItems}
        loading={avatarPickerLoading}
        onUploadFile={onUploadAvatarFile}
        onFocalPointSave={onAvatarFocalPointSave}
        title="Seleccionar Fotografía de Cliente"
      />
    </Modal>
  );
}
