"use client";

import { useState, useEffect, useMemo } from "react";
import { OfficeLocationDTO, apiClient } from "@vc/api-client";
import { buildFormFeedback } from "../lib/formFeedback";

const SAVE_SUCCESS_MESSAGE =
  "Datos de la oficina física guardados y sincronizados con el footer y la página de contacto.";

export function useAdminOffice(initialOffice: OfficeLocationDTO) {
  const [office, setOffice] = useState<OfficeLocationDTO>(initialOffice);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Refresh with latest data on mount
    apiClient.getOfficeLocation().then((fresh) => {
      if (fresh) setOffice(fresh);
    });
  }, []);

  const updateField = (field: keyof OfficeLocationDTO, value: string | number | boolean) => {
    setOffice((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  /**
   * El formulario muestra ciudad y país en un solo campo ("Lima, Perú"); el
   * parseo vivía en el `onChange` del `.tsx`. Aquí queda junto al resto del
   * estado, y el `.tsx` solo pasa el texto tal cual se escribió.
   */
  const updateCityCountry = (value: string) => {
    const [rawCity, rawCountry] = value.split(",");
    setOffice((prev) => ({
      ...prev,
      city: rawCity?.trim() || prev.city,
      ...(rawCountry ? { country: rawCountry.trim() } : {}),
    }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await apiClient.updateOfficeLocation(office);
      setOffice(updated);
      setSaveSuccess(true);
    } catch (err: unknown) {
      // El `catch` marcaba `saveSuccess = true`: un guardado fallido mostraba
      // el mismo banner verde que uno exitoso.
      setSaveSuccess(false);
      setSaveError(err instanceof Error ? err.message : "Error al guardar los datos de la oficina.");
    } finally {
      setIsSaving(false);
    }
  };

  const feedback = useMemo(
    () => buildFormFeedback(saveError, saveSuccess, SAVE_SUCCESS_MESSAGE),
    [saveError, saveSuccess]
  );

  return {
    office,
    isSaving,
    saveSuccess,
    feedback,
    updateField,
    updateCityCountry,
    handleSave,
  };
}
