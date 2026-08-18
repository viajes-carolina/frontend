"use client";

import React, { useState, useEffect } from "react";
import { TravelAdvisorDTO, CreateOrUpdateAdvisorRequest } from "@vc/api-client";
import { Button } from "@vc/ui";

export interface AdvisorFormModalProps {
  isOpen: boolean;
  advisor: TravelAdvisorDTO | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: CreateOrUpdateAdvisorRequest) => void;
  onOpenMediaPicker: () => void;
}

export function AdvisorFormModal({
  isOpen,
  advisor,
  saving,
  onClose,
  onSave,
  onOpenMediaPicker,
}: AdvisorFormModalProps) {
  const [formData, setFormData] = useState<CreateOrUpdateAdvisorRequest>({
    fullName: "",
    roleTitle: "",
    specialty: "",
    bio: "",
    photoMediaId: undefined,
    whatsappPhone: "+51987654321",
    whatsappMessageTemplate: "",
    displayOrder: 1,
    active: true,
  });

  useEffect(() => {
    if (advisor) {
      setFormData({
        fullName: advisor.fullName,
        roleTitle: advisor.roleTitle,
        specialty: advisor.specialty,
        bio: advisor.bio,
        photoMediaId: advisor.photoMediaId,
        whatsappPhone: advisor.whatsappPhone || "+51987654321",
        whatsappMessageTemplate: advisor.whatsappMessageTemplate || "",
        displayOrder: advisor.displayOrder,
        active: advisor.active,
      });
    } else {
      setFormData({
        fullName: "",
        roleTitle: "Asesora de Viajes",
        specialty: "Destinos Internacionales",
        bio: "",
        photoMediaId: undefined,
        whatsappPhone: "+51987654321",
        whatsappMessageTemplate: "",
        displayOrder: 1,
        active: true,
      });
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
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-sora font-bold text-xl text-white">
              {advisor ? "Editar Asesora de Viajes" : "Nueva Asesora de Viajes"}
            </h3>
            <p className="text-xs text-slate-400">
              Configura los datos del perfil y botón de contacto directo por WhatsApp.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Ej: Carolina Zúñiga"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Cargo / Rol *
              </label>
              <input
                type="text"
                name="roleTitle"
                value={formData.roleTitle}
                onChange={handleChange}
                required
                placeholder="Ej: Fundadora & Asesora Senior"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Especialidad / Destinos Clave *
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                placeholder="Ej: Caribe, Lunas de Miel & Europa"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Foto de Perfil (ID Media: {formData.photoMediaId || "Predeterminada"})
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenMediaPicker}
                className="w-full justify-center !py-2 text-xs text-brand-accent border-brand-accent/40"
              >
                Seleccionar Foto
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Biografía / Reseña Profesional *
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              required
              placeholder="Breve reseña de su experiencia y pasión por asesorar viajeros..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Teléfono de WhatsApp
              </label>
              <input
                type="text"
                name="whatsappPhone"
                value={formData.whatsappPhone || ""}
                onChange={handleChange}
                placeholder="+51987654321"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Orden de Visualización
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder || 1}
                onChange={handleChange}
                min={1}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Mensaje Predeterminado de WhatsApp
            </label>
            <textarea
              name="whatsappMessageTemplate"
              rows={2}
              value={formData.whatsappMessageTemplate || ""}
              onChange={handleChange}
              placeholder="Hola, me gustaría una asesoría personalizada..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active ?? true}
              onChange={handleChange}
              className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="active" className="text-sm font-medium text-slate-300">
              Asesora activa (visible en la página pública)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Guardando..." : advisor ? "Actualizar Asesora" : "Crear Asesora"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
