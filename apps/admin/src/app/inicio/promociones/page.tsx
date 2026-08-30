import { apiClient } from "@vc/api-client";
import { AdminSectionLayout } from "../../../components/AdminSectionLayout";
import { withAdminAuth } from "../../../lib/withAdminAuth";
import { PromotionsSectionForm } from "../PromotionsSectionForm";
import { PromotionsCatalogPanel } from "./PromotionsCatalogPanel";

export const dynamic = "force-dynamic";

/**
 * Promociones de la portada: el encabezado de la sección y el catálogo de
 * ofertas destacadas, que antes vivían en dos rutas distintas. Se editan
 * juntos porque se ven juntos en el sitio.
 */
export default async function InicioPromocionesPage() {
  const [section, promotions] = await Promise.all([
    withAdminAuth(apiClient.getAdminHomePromotionsSection(), "/inicio/promociones"),
    withAdminAuth(apiClient.getAdminPromotions(), "/inicio/promociones"),
  ]);

  return (
    <AdminSectionLayout
      eyebrow="Inicio"
      title="Promociones"
      description="Encabezado de la sección y catálogo de promociones destacadas que se muestran en la portada."
    >
      <div className="space-y-8">
        <PromotionsSectionForm initialConfig={section} />
        <PromotionsCatalogPanel initialPromotions={promotions} />
      </div>
    </AdminSectionLayout>
  );
}
