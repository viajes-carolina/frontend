import { apiClient } from "@vc/api-client";
import { FaqItemsPanel } from "./FaqItemsPanel";

export const dynamic = "force-dynamic";

export default async function InicioPreguntasFrecuentesPreguntasPage() {
  const faqs = await apiClient.getFaqs();

  return (
    <div className="space-y-8">
      <FaqItemsPanel initialFaqs={faqs} />
    </div>
  );
}
