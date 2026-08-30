import { apiClient } from "@vc/api-client";
import { LegalArticleSection } from "@vc/ui";
import { toLegalArticleSectionProps } from "../../lib/legalArticleMapper";

export const metadata = {
  title: "Compromiso contra la ESNNA | Viajes Carolina",
  description:
    "Compromiso de Viajes Carolina contra la Explotación Sexual de Niños, Niñas y Adolescentes (ESNNA) en el turismo.",
};

export default async function CompromisoEsnnaPage() {
  const [legal, settings] = await Promise.all([
    apiClient.getPublicLegalEsnna({ revalidate: 3600 }),
    apiClient.getSiteSettings({ revalidate: 3600 }),
  ]);

  return (
    <LegalArticleSection
      {...toLegalArticleSectionProps(legal)}
      declaration={{
        eyebrow: legal.declarationEyebrow,
        title: legal.declarationTitle,
        body: legal.declarationBody,
      }}
      whatsappPhone={settings.whatsappPhone}
      whatsappMessage="Hola Viajes Carolina, necesito reportar una situación relacionada con el compromiso contra la ESNNA."
    />
  );
}
