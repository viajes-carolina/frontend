import { apiClient } from "@vc/api-client";
import { PromotionsSectionForm } from "../PromotionsSectionForm";

export const dynamic = "force-dynamic";

export default async function InicioPromocionesPage() {
  const promotionsSection = await apiClient.getAdminHomePromotionsSection();
  return <PromotionsSectionForm initialConfig={promotionsSection} />;
}
