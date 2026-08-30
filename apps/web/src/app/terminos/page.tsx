import { apiClient } from "@vc/api-client";
import { LegalArticleSection } from "@vc/ui";
import { toLegalArticleSectionProps } from "../../lib/legalArticleMapper";

export const metadata = {
  title: "Términos y condiciones | Viajes Carolina",
  description:
    "Condiciones generales aplicables a las cotizaciones, reservas y servicios gestionados por Viajes Carolina.",
};

export default async function TerminosPage() {
  const [legal, settings] = await Promise.all([
    apiClient.getPublicLegalTerminos({ revalidate: 3600 }),
    apiClient.getSiteSettings({ revalidate: 3600 }),
  ]);

  return (
    <LegalArticleSection
      {...toLegalArticleSectionProps(legal)}
      whatsappPhone={settings.whatsappPhone}
      whatsappMessage="Hola Viajes Carolina, tengo una consulta sobre los términos y condiciones."
    />
  );
}
