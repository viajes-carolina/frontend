"use client";

import React from "react";
import {
  ClaimWizardShell,
  ClaimStepDatos,
  ClaimStepDatosHelpPanel,
  ClaimStepServicio,
  ClaimStepDetalle,
  ClaimStepRevisar,
  ClaimStepConstancia,
} from "@vc/ui";
import { apiClient, SiteSettingsDTO, OfficeLocationDTO } from "@vc/api-client";
import { useClaimWizard } from "../../../hooks/useClaimWizard";

export interface ClaimWizardViewProps {
  settings: SiteSettingsDTO;
  office: OfficeLocationDTO;
}

const STEP_COPY: Record<number, { title: string; description: string }> = {
  1: {
    title: "Cuéntanos quién eres.",
    description:
      "Estos datos identifican a la persona consumidora que registra la Hoja de Reclamación.",
  },
  2: {
    title: "Cuéntanos sobre el servicio.",
    description: "Identifica el tipo de caso y el servicio contratado con Viajes Carolina.",
  },
  3: {
    title: "Ahora cuéntanos qué ocurrió.",
    description: "Describe los hechos y el pedido concreto que esperas de nosotros.",
  },
  4: {
    title: "Revisa antes de registrar.",
    description: "Verifica cada sección antes de enviar tu Hoja de Reclamación.",
  },
};

export const ClaimWizardView: React.FC<ClaimWizardViewProps> = ({ settings, office }) => {
  const {
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
  } = useClaimWizard();

  if (submittedClaim) {
    return (
      <ClaimStepConstancia
        claimCode={submittedClaim.claimCode}
        createdAt={submittedClaim.createdAt}
        email={submittedClaim.email}
        pdfUrl={apiClient.getClaimConstanciaPdfUrl(
          submittedClaim.claimCode,
          submittedClaim.documentNumber
        )}
      />
    );
  }

  const companyName = settings.legalCompanyName || "VIAJES CAROLINA S.A.C.";
  const taxId = settings.taxId || "20601234567";
  const legalAddress = `${office.addressLine}, ${office.district}, ${office.city}`;
  const copy = STEP_COPY[currentStep];

  return (
    <ClaimWizardShell
      companyName={companyName}
      taxId={taxId}
      legalAddress={legalAddress}
      currentStep={currentStep}
      stepTitle={copy.title}
      stepDescription={copy.description}
      showBack={currentStep > 1}
      onBack={goBack}
      onNext={currentStep === 4 ? handleSubmit : goNext}
      nextLabel={currentStep === 4 ? "Registrar Hoja de Reclamación" : "Continuar"}
      nextDisabled={currentStep === 4 ? !declaredTruth : false}
      nextLoading={submitting}
      helpPanel={
        currentStep === 1 ? (
          <ClaimStepDatosHelpPanel
            whatsappPhone={settings.whatsappPhone}
            whatsappMessage="Hola Viajes Carolina, tengo una consulta antes de registrar mi Hoja de Reclamación."
            onContinueWithClaim={focusFirstField}
          />
        ) : undefined
      }
    >
      {currentStep === 1 && (
        <ClaimStepDatos
          values={formData}
          errors={fieldErrors}
          onChange={updateField}
          firstFieldRef={firstFieldRef}
        />
      )}
      {currentStep === 2 && (
        <ClaimStepServicio values={formData} errors={fieldErrors} onChange={updateField} />
      )}
      {currentStep === 3 && (
        <ClaimStepDetalle
          values={formData}
          errors={fieldErrors}
          onChange={updateField}
          onAttachmentsChange={setAttachments}
        />
      )}
      {currentStep === 4 && (
        <ClaimStepRevisar
          data={formData}
          declaredTruth={declaredTruth}
          onDeclaredTruthChange={setDeclaredTruth}
          onEditStep={goToStep}
          error={error}
        />
      )}
    </ClaimWizardShell>
  );
};
