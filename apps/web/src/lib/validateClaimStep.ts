import type { SubmitClaimRequest } from "@vc/api-client";

export type ClaimWizardFormData = SubmitClaimRequest & { attachments: File[] };

export type ClaimFieldErrors = Partial<Record<keyof SubmitClaimRequest, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida los campos requeridos de un paso del asistente del Libro de
 * Reclamaciones. Función pura: no muta `data`, solo calcula errores por campo.
 */
export function validateClaimStep(step: number, data: ClaimWizardFormData): ClaimFieldErrors {
  const errors: ClaimFieldErrors = {};

  if (step === 1) {
    if (!data.fullName.trim()) errors.fullName = "Ingresa tus nombres y apellidos.";
    if (!data.documentNumber.trim()) errors.documentNumber = "Ingresa tu número de documento.";
    if (!data.address.trim()) errors.address = "Ingresa tu domicilio.";
    if (!data.phone.trim()) errors.phone = "Ingresa un teléfono de contacto.";
    if (!data.email.trim()) {
      errors.email = "Ingresa tu correo electrónico.";
    } else if (!EMAIL_PATTERN.test(data.email)) {
      errors.email = "Ingresa un correo electrónico válido.";
    }
    if (data.isMinor) {
      if (!data.parentName?.trim()) errors.parentName = "Ingresa el nombre del representante.";
      if (!data.parentDocument?.trim()) errors.parentDocument = "Ingresa el documento del representante.";
    }
  }

  if (step === 2) {
    if (!data.relatedService.trim()) errors.relatedService = "Selecciona el servicio relacionado.";
    if (!data.description.trim()) errors.description = "Describe el servicio contratado.";
    if (data.claimedAmount !== undefined && data.claimedAmount !== null && Number.isNaN(data.claimedAmount)) {
      errors.claimedAmount = "Ingresa un monto válido.";
    }
    if (!data.serviceDate) errors.serviceDate = "Selecciona la fecha de compra o servicio.";
  }

  if (step === 3) {
    if (!data.consumerDetail.trim()) errors.consumerDetail = "Describe qué ocurrió.";
    if (!data.consumerRequest.trim()) errors.consumerRequest = "Indica tu pedido concreto.";
    if (!data.responseChannel) errors.responseChannel = "Selecciona un canal de respuesta.";
  }

  return errors;
}
