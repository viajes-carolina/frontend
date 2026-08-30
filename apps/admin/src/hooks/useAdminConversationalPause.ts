import { useState, useCallback, useEffect, useMemo } from "react";
import { buildFormFeedback } from "../lib/formFeedback";
import {
  apiClient,
  HomeConversationalPauseDTO,
  UpdateHomeConversationalPauseRequest,
} from "@vc/api-client";

export function useAdminConversationalPause(initialConfig?: HomeConversationalPauseDTO) {
  const [config, setConfig] = useState<HomeConversationalPauseDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Texto crudo (separado por coma) del input de "Bancos Participantes" —
  // mismo criterio que `tagsInput` en BlogFormModal.tsx: se mantiene como
  // fuente de verdad de lo que el usuario está escribiendo (permite comas y
  // espacios finales mientras tipea) y solo se normaliza a `financingBanks`
  // (array trim + filtrado) en cada cambio, sin nunca derivarlo de vuelta
  // desde el array (eso perdería el texto crudo en cada tecla).
  const [financingBanksText, setFinancingBanksTextState] = useState<string>(
    initialConfig?.financingBanks?.join(", ") || ""
  );

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminHomeConversationalPause();
      setConfig(data);
      setFinancingBanksTextState(data.financingBanks?.join(", ") || "");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la configuración de Pausa Conversacional";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialConfig) {
      fetchConfig();
    }
  }, [initialConfig, fetchConfig]);

  const updateField = useCallback(
    <K extends keyof HomeConversationalPauseDTO>(field: K, value: HomeConversationalPauseDTO[K]) => {
      setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
      setSuccess(false);
      setError(null);
    },
    []
  );

  // Setter dedicado para el input de texto de "Bancos Participantes":
  // guarda el texto crudo tal cual lo escribe el usuario y, en paralelo,
  // normaliza `config.financingBanks` (split por coma + trim + filtrado de
  // vacíos) para que quede listo para guardar sin pasos adicionales.
  const setFinancingBanksText = useCallback((text: string) => {
    setFinancingBanksTextState(text);
    const banks = text.split(",").map((b) => b.trim()).filter(Boolean);
    setConfig((prev) => (prev ? { ...prev, financingBanks: banks } : null));
    setSuccess(false);
    setError(null);
  }, []);

  const saveConfig = useCallback(
    async (payload?: UpdateHomeConversationalPauseRequest) => {
      const dataToSave = payload || (config ? {
        badgeText: config.badgeText,
        title: config.title,
        subtitle: config.subtitle,
        whatsappCtaText: config.whatsappCtaText,
        whatsappMessageTemplate: config.whatsappMessageTemplate,
        financingEyebrowText: config.financingEyebrowText,
        financingInstallmentsCount: config.financingInstallmentsCount,
        financingDisclaimerText: config.financingDisclaimerText,
        financingBanks: config.financingBanks,
      } : null);

      if (!dataToSave) return;

      try {
        setSaving(true);
        setError(null);
        setSuccess(false);
        const updated = await apiClient.updateAdminHomeConversationalPause(dataToSave);
        setConfig(updated);
        setFinancingBanksTextState(updated.financingBanks?.join(", ") || "");
        setSuccess(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error al guardar los cambios";
        setError(msg);
      } finally {
        setSaving(false);
      }
    },
    [config]
  );

  // Forma única de feedback que consume `FormFeedback` (banner con
  // `role="status"`): un error de guardado gana sobre el éxito previo.
  const feedback = useMemo(
    () => buildFormFeedback(error, success, "Configuración guardada exitosamente en el servidor."),
    [error, success]
  );

  return {
    config,
    loading,
    saving,
    error,
    success,
    feedback,
    updateField,
    financingBanksText,
    setFinancingBanksText,
    saveConfig,
    refetch: fetchConfig,
  };
}
