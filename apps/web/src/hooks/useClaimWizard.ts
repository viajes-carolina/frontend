"use client";

import { useCallback, useRef, useState } from "react";
import { apiClient, ClaimRecordDTO, SubmitClaimRequest } from "@vc/api-client";
import { validateClaimStep, ClaimFieldErrors, ClaimWizardFormData } from "../lib/validateClaimStep";

export type { ClaimWizardFormData };

type ClaimWizardFieldValue = string | number | boolean | undefined;

const INITIAL_FORM_DATA: ClaimWizardFormData = {
  fullName: "",
  documentType: "DNI",
  documentNumber: "",
  email: "",
  phone: "",
  address: "",
  isMinor: false,
  parentName: "",
  parentDocument: "",
  contractedType: "SERVICIO",
  claimedAmount: undefined,
  currency: "PEN",
  description: "",
  claimType: "RECLAMO",
  consumerDetail: "",
  consumerRequest: "",
  turnstileToken: "turnstile-verified-token",
  relatedService: "",
  reservationCode: "",
  serviceDate: "",
  responseChannel: "EMAIL",
  attachments: [],
};

export function useClaimWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClaimWizardFormData>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<ClaimFieldErrors>({});
  const [declaredTruth, setDeclaredTruth] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<ClaimRecordDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const updateField = useCallback(
    (field: keyof SubmitClaimRequest, value: ClaimWizardFieldValue) => {
      setFormData((prev) => ({ ...prev, [field]: value }) as ClaimWizardFormData);
      setFieldErrors((prev) => {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const setAttachments = useCallback((files: File[]) => {
    setFormData((prev) => ({ ...prev, attachments: files }));
  }, []);

  const goNext = useCallback(() => {
    const errors = validateClaimStep(currentStep, formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setCurrentStep((step) => Math.min(step + 1, 4));
  }, [currentStep, formData]);

  const goBack = useCallback(() => {
    setFieldErrors({});
    setCurrentStep((step) => Math.max(step - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setFieldErrors({});
    setCurrentStep(Math.min(Math.max(step, 1), 4));
  }, []);

  const focusFirstField = useCallback(() => {
    firstFieldRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    firstFieldRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!declaredTruth) {
      setError("Debes aceptar la declaración jurada para registrar la hoja de reclamación.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { attachments, ...payload } = formData;
      const created = await apiClient.submitClaim(payload);

      // Los adjuntos son opcionales: si alguno falla, se advierte pero no se
      // revierte ni bloquea el registro ya exitoso de la hoja de reclamación.
      for (const file of attachments) {
        try {
          await apiClient.uploadClaimAttachment(created.id, file);
        } catch (uploadErr) {
          console.warn(`No se pudo subir el adjunto "${file.name}"`, uploadErr);
        }
      }

      setSubmittedClaim(created);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo registrar la hoja de reclamación.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [declaredTruth, formData]);

  return {
    currentStep,
    formData,
    fieldErrors,
    declaredTruth,
    setDeclaredTruth,
    submittedClaim,
    submitting,
    error,
    firstFieldRef,
    updateField,
    setAttachments,
    goNext,
    goBack,
    goToStep,
    focusFirstField,
    handleSubmit,
  };
}
