import { apiClient } from "@vc/api-client";
import { AdminSectionLayout } from "../../../../components/AdminSectionLayout";
import { withAdminAuth } from "../../../../lib/withAdminAuth";
import { TestimonialItemsPanel } from "./TestimonialItemsPanel";

export const dynamic = "force-dynamic";

export default async function InicioExperienciasTestimoniosPage() {
  const testimonials = await withAdminAuth(apiClient.getTestimonials(), "/inicio/experiencias/testimonios");

  return (
    <AdminSectionLayout
      eyebrow="Inicio"
      title="Testimonios"
      description="Testimonios reales de viajeros que se muestran en la sección de experiencias de la portada."
    >
      <TestimonialItemsPanel initialTestimonials={testimonials} />
    </AdminSectionLayout>
  );
}
