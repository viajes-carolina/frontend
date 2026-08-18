import { apiClient } from "@vc/api-client";
import { PromotionList } from "./PromotionList";

export const dynamic = "force-dynamic";

export default async function PromotionsAdminPage() {
  const promotions = await apiClient.getAdminPromotions();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Promociones & Paquetes Turísticos
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Gestiona las ofertas destacadas de portada y el catálogo completo de viajes con precios en USD/PEN, itinerarios e inclusiones.
        </p>
      </div>

      <PromotionList initialPromotions={promotions} />
    </div>
  );
}
