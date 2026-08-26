import { apiClient } from "@vc/api-client";
import { PromotionsCatalogPanel } from "./PromotionsCatalogPanel";

export const dynamic = "force-dynamic";

export default async function InicioPromocionesCatalogoPage() {
  const promotions = await apiClient.getAdminPromotions();

  return (
    <div className="space-y-8">
      <PromotionsCatalogPanel initialPromotions={promotions} />
    </div>
  );
}
