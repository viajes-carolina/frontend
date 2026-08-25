import { apiClient } from "@vc/api-client";
import { PromotionsSectionForm } from "../PromotionsSectionForm";
import { PromotionsCatalogPanel } from "./PromotionsCatalogPanel";

export const dynamic = "force-dynamic";

export default async function InicioPromocionesPage() {
  const [promotionsSection, promotions] = await Promise.all([
    apiClient.getAdminHomePromotionsSection(),
    apiClient.getAdminPromotions(),
  ]);

  return (
    <div className="space-y-8">
      <PromotionsSectionForm initialConfig={promotionsSection} />
      <PromotionsCatalogPanel initialPromotions={promotions} />
    </div>
  );
}
