import { apiClient } from "@vc/api-client";
import { LegalArticleSection } from "@vc/ui";
import { toLegalArticleSectionProps } from "../../lib/legalArticleMapper";

export const metadata = {
  title: "Constancia MINCETUR | Viajes Carolina",
  description:
    "Constancia de registro de Viajes Carolina como Agencia de Viajes y Turismo ante el Ministerio de Comercio Exterior y Turismo (MINCETUR).",
};

export default async function ConstanciaMinceturPage() {
  const [legal, settings] = await Promise.all([
    apiClient.getPublicLegalMincetur({ revalidate: 3600 }),
    apiClient.getSiteSettings({ revalidate: 3600 }),
  ]);

  return (
    <LegalArticleSection
      {...toLegalArticleSectionProps(legal)}
      verification={{
        eyebrow: legal.verificationEyebrow,
        buttonLabel: legal.verificationButtonLabel,
        note: legal.verificationNote,
        legalCompanyName: settings.legalCompanyName || "",
        taxId: settings.taxId || "",
        registrationNumber: settings.minceturRegistrationNumber,
        location: settings.minceturLocation || "",
        certificateUrl: settings.minceturCertificateUrl,
      }}
      whatsappPhone={settings.whatsappPhone}
      whatsappMessage="Hola Viajes Carolina, tengo una consulta sobre su registro ante MINCETUR."
    />
  );
}
