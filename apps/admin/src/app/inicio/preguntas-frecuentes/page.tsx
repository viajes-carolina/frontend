import { apiClient } from "@vc/api-client";
import { FaqSectionForm } from "../FaqSectionForm";

export const dynamic = "force-dynamic";

export default async function InicioPreguntasFrecuentesPage() {
  const faqSection = await apiClient.getAdminHomeFaqSection();
  return <FaqSectionForm initialConfig={faqSection} />;
}
