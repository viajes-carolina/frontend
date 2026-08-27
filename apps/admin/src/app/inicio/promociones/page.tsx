import { apiClient } from "@vc/api-client";
import { PromotionsSectionForm } from "../PromotionsSectionForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function InicioPromocionesPage() {
  const promotionsSection = await withAdminAuth(apiClient.getAdminHomePromotionsSection(), "/inicio/promociones");

  return (
    <div className="space-y-8">
      <PromotionsSectionForm initialConfig={promotionsSection} />
    </div>
  );
}
