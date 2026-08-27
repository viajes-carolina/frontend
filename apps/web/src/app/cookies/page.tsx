import { apiClient } from "@vc/api-client";
import { LegalPage } from "@vc/ui";

export const metadata = {
  title: "Política de cookies | Viajes Carolina",
  description: "Cómo utiliza cookies el sitio web de Viajes Carolina.",
};

export default async function CookiesPage() {
  const settings = await apiClient.getSiteSettings({ revalidate: 3600 });

  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de cookies"
      intro="Este sitio utiliza cookies para mejorar tu experiencia de navegación y entender cómo se usa el sitio."
      contactEmail={settings.contactEmail}
      legalCompanyName={settings.legalCompanyName}
      taxId={settings.taxId}
    />
  );
}
