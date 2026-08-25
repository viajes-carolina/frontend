import { apiClient } from "@vc/api-client";
import { LegalPage } from "@vc/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Términos y condiciones | Viajes Carolina",
  description: "Términos y condiciones de uso de los servicios de Viajes Carolina.",
};

export default async function TerminosPage() {
  const settings = await apiClient.getSiteSettings();

  return (
    <LegalPage
      eyebrow="Legal"
      title="Términos y condiciones"
      intro="Estas son las condiciones bajo las cuales Viajes Carolina ofrece sus servicios de asesoría y venta de viajes."
      contactEmail={settings.contactEmail}
      legalCompanyName={settings.legalCompanyName}
      taxId={settings.taxId}
    />
  );
}
