import { apiClient } from "@vc/api-client";
import { FaqItemsPanel } from "./FaqItemsPanel";
import { withAdminAuth } from "../../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function InicioPreguntasFrecuentesPreguntasPage() {
  const faqs = await withAdminAuth(apiClient.getFaqs(), "/inicio/preguntas-frecuentes/preguntas");

  return (
    <div className="space-y-8">
      <FaqItemsPanel initialFaqs={faqs} />
    </div>
  );
}
