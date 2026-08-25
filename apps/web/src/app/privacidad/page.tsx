import { apiClient } from "@vc/api-client";
import { LegalPage } from "@vc/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Política de privacidad | Viajes Carolina",
  description: "Cómo Viajes Carolina protege y utiliza los datos personales de sus clientes.",
};

export default async function PrivacidadPage() {
  const settings = await apiClient.getSiteSettings();

  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de privacidad"
      intro="En Viajes Carolina protegemos los datos personales que nos confías para asesorarte y gestionar tu viaje."
      contactEmail={settings.contactEmail}
      legalCompanyName={settings.legalCompanyName}
      taxId={settings.taxId}
    />
  );
}
