import { apiClient } from "@vc/api-client";
import { FaqSectionForm } from "../FaqSectionForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function InicioPreguntasFrecuentesPage() {
  const faqSection = await withAdminAuth(apiClient.getAdminHomeFaqSection(), "/inicio/preguntas-frecuentes");

  return (
    <div className="space-y-8">
      <FaqSectionForm initialConfig={faqSection} />
    </div>
  );
}
