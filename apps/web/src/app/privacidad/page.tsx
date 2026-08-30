import { apiClient } from "@vc/api-client";
import { LegalArticleSection } from "@vc/ui";
import { toLegalArticleSectionProps } from "../../lib/legalArticleMapper";

export const metadata = {
  title: "Política de privacidad | Viajes Carolina",
  description: "Cómo Viajes Carolina protege y utiliza los datos personales de sus clientes.",
};

export default async function PrivacidadPage() {
  const [legal, settings] = await Promise.all([
    apiClient.getPublicLegalPrivacidad({ revalidate: 3600 }),
    apiClient.getSiteSettings({ revalidate: 3600 }),
  ]);

  return (
    <LegalArticleSection
      {...toLegalArticleSectionProps(legal)}
      whatsappPhone={settings.whatsappPhone}
      whatsappMessage="Hola Viajes Carolina, tengo una consulta sobre la política de privacidad."
    />
  );
}
