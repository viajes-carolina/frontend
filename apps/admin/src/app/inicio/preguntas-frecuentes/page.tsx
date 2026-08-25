import { apiClient } from "@vc/api-client";
import { FaqSectionForm } from "../FaqSectionForm";
import { FaqItemsPanel } from "./FaqItemsPanel";

export const dynamic = "force-dynamic";

export default async function InicioPreguntasFrecuentesPage() {
  const [faqSection, faqs] = await Promise.all([
    apiClient.getAdminHomeFaqSection(),
    apiClient.getFaqs(),
  ]);
  return (
    <div className="space-y-8">
      <FaqSectionForm initialConfig={faqSection} />
      <FaqItemsPanel initialFaqs={faqs} />
    </div>
  );
}
