"use client";

import { useState } from "react";
import { apiClient, SubmitContactInquiryRequest } from "@vc/api-client";

export function useContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitInquiry = async (payload: SubmitContactInquiryRequest): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.submitContactInquiry(payload);
      return true;
    } catch (err: any) {
      setError(err?.message || "Error al enviar la solicitud");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    submitInquiry,
  };
}
