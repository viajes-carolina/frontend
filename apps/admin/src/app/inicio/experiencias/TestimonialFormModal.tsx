"use client";

import React from "react";
import Image from "next/image";
import { Button, FormField, ImageIcon, MediaPickerModal, Modal, StarIcon } from "@vc/ui";
import { MediaAssetDTO } from "@vc/api-client";

export interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
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
  displayOrder,
  setDisplayOrder,
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
    >
      {/* Form Body */}
      <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Nombre del Cliente o Familia"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Mariana & Gonzalo Torres"
                required
              />
            </div>

            <div>
              <FormField
                label="Ubicación o Procedencia"
                type="text"
                value={clientLocation}
                onChange={(e) => setClientLocation(e.target.value)}
                placeholder="Lima, Perú"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Destino o Tipo de Viaje"
                type="text"
                value={tripDestination}
                onChange={(e) => setTripDestination(e.target.value)}
                placeholder="Luna de Miel en Punta Cana"
                required
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Calificación (Estrellas)
              </label>
              <div className="flex items-center gap-2 pt-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`p-1 transition-transform hover:scale-125 ${
                      val <= rating ? "text-amber-400" : "text-neutral-border"
                    }`}
                  >
                    <StarIcon size={22} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <FormField
              label="Cita / Testimonio del Cliente"
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Desde que escribimos por WhatsApp nos atendieron con muchísima paciencia..."
              required
            />
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Foto del Cliente / Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full bg-neutral-surface border border-neutral-border overflow-hidden shrink-0">
                {avatarMediaUrl ? (
                  <Image
                    src={avatarMediaUrl.startsWith("http") || avatarMediaUrl.startsWith("/") ? avatarMediaUrl : `/${avatarMediaUrl}`}
                    alt="Avatar"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-muted font-sora font-bold text-sm">
                    {clientName ? clientName.charAt(0) : <ImageIcon size={18} />}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsAvatarPickerOpen(true)}
              >
                🖼️ {avatarMediaId ? "Cambiar Foto" : "Seleccionar de Medios"}
              </Button>
            </div>
          </div>

          {/* Consent Checkbox & Active */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="consentCheckbox"
                checked={consentConfirmed}
                onChange={(e) => setConsentConfirmed(e.target.checked)}
                className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                required
              />
              <label htmlFor="consentCheckbox" className="font-inter text-xs text-neutral-muted cursor-pointer">
                He verificado el consentimiento expreso del cliente para publicar su opinión y datos.
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activeTestimonialCheckbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
              />
              <label htmlFor="activeTestimonialCheckbox" className="font-inter text-sm text-brand-navy font-medium cursor-pointer">
                Testimonio activo y visible en portada
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-border">
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Testimonio"}
            </Button>
          </div>
        </form>

        {/* Media Picker Modal */}
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
