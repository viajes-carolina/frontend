"use client";

import React from "react";
import {
  ClaimsHeroSection,
  ClaimFormSection,
  ClaimLookupSection,
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
  const { handleSubmitClaim, handleLookupClaim } = useClaimsPage();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Header con Información Legal */}
      <ClaimsHeroSection
        companyName={settings.legalCompanyName || "VIAJES CAROLINA S.A.C."}
        companyRuc={settings.taxId || "20601234567"}
        officeAddress={`${office.addressLine}, ${office.district}, ${office.city}`}
      />

      {/* 2. Formulario de Hoja de Reclamación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClaimFormSection onSubmitClaim={handleSubmitClaim} />
      </div>

      {/* 3. Buscador de Estado de Reclamación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ClaimLookupSection onLookup={handleLookupClaim} />
      </div>
    </main>
  );
};
