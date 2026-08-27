import { apiClient } from "@vc/api-client";
import { PromotionsCatalogPanel } from "./PromotionsCatalogPanel";
import { withAdminAuth } from "../../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function InicioPromocionesCatalogoPage() {
  const promotions = await withAdminAuth(apiClient.getAdminPromotions(), "/inicio/promociones/catalogo");

  return (
    <div className="space-y-8">
      <PromotionsCatalogPanel initialPromotions={promotions} />
    </div>
  );
}
