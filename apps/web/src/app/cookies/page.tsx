import { apiClient } from "@vc/api-client";
import { LegalArticleSection, CookiePreferencesPanel } from "@vc/ui";
import { toLegalArticleSectionProps } from "../../lib/legalArticleMapper";

export const metadata = {
  title: "Política de cookies | Viajes Carolina",
  description: "Cómo utiliza cookies el sitio web de Viajes Carolina.",
};

export default async function CookiesPage() {
  const [legal, settings] = await Promise.all([
    apiClient.getPublicLegalCookies({ revalidate: 3600 }),
    apiClient.getSiteSettings({ revalidate: 3600 }),
  ]);

  return (
    <>
      <LegalArticleSection
        {...toLegalArticleSectionProps(legal)}
        whatsappPhone={settings.whatsappPhone}
        whatsappMessage="Hola Viajes Carolina, tengo una consulta sobre la política de cookies."
      />
      <CookiePreferencesPanel
        categories={legal.cookieCategories}
        acceptAllLabel={legal.acceptAllLabel}
        savePreferencesLabel={legal.savePreferencesLabel}
      />
    </>
  );
}
