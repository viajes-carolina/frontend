"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { CreateOrUpdateAdvisorRequest, TravelAdvisorDTO } from "@vc/api-client";

export interface AdvisorTextFields {
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

export interface UseAdvisorFormModalOptions {
  advisor: TravelAdvisorDTO | null;
  isOpen: boolean;
  photoMediaId?: number;
  onSave: (payload: CreateOrUpdateAdvisorRequest) => void;
}

/**
 * Estado del formulario de asesora del modal de equipo: se rehidrata cada vez
 * que se abre (con la asesora en edición o en blanco para el alta). Vivía
 * dentro de `AdvisorFormModal.tsx`, que debe ser solo plantilla.
 */
export function useAdvisorFormModal({ advisor, isOpen, photoMediaId, onSave }: UseAdvisorFormModalOptions) {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setActive = (active: boolean) => setFormData((prev) => ({ ...prev, active }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ ...formData, photoMediaId });
  };

  return { formData, handleChange, setActive, handleSubmit };
}
