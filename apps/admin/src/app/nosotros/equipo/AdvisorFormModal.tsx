"use client";

import React, { useState, useEffect } from "react";
import { TravelAdvisorDTO, CreateOrUpdateAdvisorRequest, MediaAssetDTO } from "@vc/api-client";
import { Button, FormField, Modal } from "@vc/ui";
import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";

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

interface AdvisorTextFields {
  fullName: string;
  roleTitle: string;
  specialty: string;
  bio: string;
  quote: string;
  whatsappPhone: string;
  whatsappMessageTemplate: string;
  displayOrder: number;
  active: boolean;
}

const EMPTY_ADVISOR: AdvisorTextFields = {
  fullName: "",
  roleTitle: "Asesora de Viajes",
  specialty: "Destinos Internacionales",
  bio: "",
  quote: "",
  whatsappPhone: "+51987654321",
  whatsappMessageTemplate: "",
  displayOrder: 1,
  active: true,
};

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
  const [formData, setFormData] = useState<AdvisorTextFields>(EMPTY_ADVISOR);

  useEffect(() => {
    if (advisor) {
      setFormData({
        fullName: advisor.fullName,
        roleTitle: advisor.roleTitle,
        specialty: advisor.specialty,
        bio: advisor.bio,
        quote: advisor.quote || "",
        whatsappPhone: advisor.whatsappPhone || "+51987654321",
        whatsappMessageTemplate: advisor.whatsappMessageTemplate || "",
        displayOrder: advisor.displayOrder,
        active: advisor.active,
      });
    } else {
      setFormData(EMPTY_ADVISOR);
    }
  }, [advisor, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      photoMediaId,
    });
  };

  return (
    <Modal
      title={advisor ? "Editar Asesora de Viajes" : "Nueva Asesora de Viajes"}
      description="Configura los datos del perfil y botón de contacto directo por WhatsApp."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <HeroPhotoSlot
          variant="secondary"
          label="Foto de Perfil"
          mediaId={photoMediaId}
          mediaUrl={photoMediaUrl}
          onSelect={onSelectPhoto}
          modalTitle="Seleccionar Foto de Perfil de la Asesora"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Ej: Carolina Zúñiga"
            />
          </div>

          <div>
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
        </div>

        <div>
          <FormField
            label="Especialidad / Destinos Clave"
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
            placeholder="Ej: Caribe, Lunas de Miel & Europa"
          />
        </div>

        <div>
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
        </div>

        <div>
          <FormField
            label="Cita Personal (para el layout de asesora destacada, cuando es la única activa)"
            multiline
            name="quote"
            rows={2}
            value={formData.quote}
            onChange={handleChange}
            placeholder="Ej: Cada viaje que diseño lleva un pedacito de la historia de quien lo vive."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Teléfono de WhatsApp"
              type="text"
              name="whatsappPhone"
              value={formData.whatsappPhone}
              onChange={handleChange}
              placeholder="+51987654321"
            />
          </div>

          <div>
            <FormField
              label="Orden de Visualización"
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              min={1}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Mensaje Predeterminado de WhatsApp"
            multiline
            name="whatsappMessageTemplate"
            rows={2}
            value={formData.whatsappMessageTemplate}
            onChange={handleChange}
            placeholder="Hola, me gustaría una asesoría personalizada..."
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
          />
          <label htmlFor="active" className="text-sm font-medium text-neutral-ink">
            Asesora activa (visible en la página pública)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-neutral-border">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
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
