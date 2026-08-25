"use client";

import React from "react";
import {
  ClaimsHeroSection,
  ClaimLookupSection,
  Button,
} from "@vc/ui";
import { SiteSettingsDTO, OfficeLocationDTO } from "@vc/api-client";
import { useClaimsPage } from "../../hooks/useClaimsPage";

export interface ClaimsClientViewProps {
  settings: SiteSettingsDTO;
  office: OfficeLocationDTO;
}

export const ClaimsClientView: React.FC<ClaimsClientViewProps> = ({
  settings,
  office,
}) => {
  const { handleLookupClaim, handleStartClaim } = useClaimsPage();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Header con Información Legal */}
      <ClaimsHeroSection
        companyName={settings.legalCompanyName || "VIAJES CAROLINA S.A.C."}
        companyRuc={settings.taxId || "20601234567"}
        officeAddress={`${office.addressLine}, ${office.district}, ${office.city}`}
      />

      {/* 2. CTA hacia el asistente de 4 pasos */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-sm text-neutral-muted mb-5 max-w-xl mx-auto">
          Registra tu Hoja de Reclamación en un asistente guiado de 4 pasos: tus datos, el servicio,
          lo ocurrido y una revisión final antes de enviarla.
        </p>
        <Button variant="primary" size="lg" onClick={handleStartClaim}>
          Iniciar mi reclamo
        </Button>
      </div>

      {/* 3. Buscador de Estado de Reclamación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ClaimLookupSection onLookup={handleLookupClaim} />
      </div>
    </main>
  );
};
