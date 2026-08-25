import { Metadata } from "next";
import { apiClient } from "@vc/api-client";
import { ClaimWizardView } from "./ClaimWizardView";

export const metadata: Metadata = {
  title: "Registrar Hoja de Reclamación | Viajes Carolina",
  description:
    "Asistente guiado de 4 pasos para registrar tu Hoja de Reclamación conforme a la Ley N° 29571 y D.S. N° 011-2011-PCM.",
};

export const dynamic = "force-dynamic";

export default async function RegistrarReclamacionPage() {
  const [settings, office] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getOfficeLocation(),
  ]);

  return <ClaimWizardView settings={settings} office={office} />;
}
