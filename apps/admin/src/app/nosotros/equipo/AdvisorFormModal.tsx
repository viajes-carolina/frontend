"use client";

import React from "react";
import type { TravelAdvisorDTO, CreateOrUpdateAdvisorRequest, MediaAssetDTO } from "@vc/api-client";
import { Button, FormField, Modal, Toggle } from "@vc/ui";
import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";
import { useAdvisorFormModal } from "../../../hooks/useAdvisorFormModal";

export interface AdvisorFormModalProps {
  isOpen: boolean;
  advisor: TravelAdvisorDTO | null;
  saving: boolean;
  photoMediaId?: number;
  photoMediaUrl?: string;
  onSelectPhoto: (media: MediaAssetDTO) => void;
  onClose: () => void;
  onSave: (payload: CreateOrUpdateAdvisorRequest) => void;
}

export function AdvisorFormModal({
  isOpen,
  advisor,
  saving,
  photoMediaId,
  photoMediaUrl,
  onSelectPhoto,
  onClose,
  onSave,
}: AdvisorFormModalProps) {
  const { formData, handleChange, setActive, handleSubmit } = useAdvisorFormModal({
    advisor,
    isOpen,
    photoMediaId,
    onSave,
  });

  if (!isOpen) return null;

  return (
    <Modal
      title={advisor ? "Editar Asesora de Viajes" : "Nueva Asesora de Viajes"}
      description="Configura los datos del perfil y botón de contacto directo por WhatsApp."
      onClose={onClose}
      closeLabel="Cerrar formulario de asesora"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="rounded-[10px] border border-admin-divider bg-admin-field p-4">
            <HeroPhotoSlot
              variant="secondary"
              label="Foto de Perfil"
              mediaId={photoMediaId}
              mediaUrl={photoMediaUrl}
              onSelect={onSelectPhoto}
              modalTitle="Seleccionar Foto de Perfil de la Asesora"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Ej: Carolina Zúñiga"
            />
            <FormField
              label="Cargo / Rol"
              type="text"
              name="roleTitle"
              value={formData.roleTitle}
              onChange={handleChange}
              required
              placeholder="Ej: Fundadora & Asesora Senior"
            />
          </div>

          <FormField
            label="Especialidad / Destinos Clave"
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
            placeholder="Ej: Caribe, Lunas de Miel & Europa"
          />

          <FormField
            label="Biografía / Reseña Profesional"
            multiline
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            required
            placeholder="Breve reseña de su experiencia y pasión por asesorar viajeros..."
          />

          <FormField
            label="Cita Personal (para el layout de asesora destacada, cuando es la única activa)"
            multiline
            name="quote"
            rows={2}
            value={formData.quote}
            onChange={handleChange}
            placeholder="Ej: Cada viaje que diseño lleva un pedacito de la historia de quien lo vive."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Teléfono de WhatsApp"
              type="text"
              name="whatsappPhone"
              value={formData.whatsappPhone}
              onChange={handleChange}
              placeholder="+51987654321"
            />
            <FormField
              label="Orden de Visualización"
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              min={1}
            />
          </div>

          <FormField
            label="Mensaje Predeterminado de WhatsApp"
            multiline
            name="whatsappMessageTemplate"
            rows={2}
            value={formData.whatsappMessageTemplate}
            onChange={handleChange}
            placeholder="Hola, me gustaría una asesoría personalizada..."
          />

          <Toggle
            checked={formData.active}
            onChange={setActive}
            label="Asesora activa (visible en la página pública)"
          />
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-admin-divider pt-6">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Guardando..." : advisor ? "Actualizar Asesora" : "Crear Asesora"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
