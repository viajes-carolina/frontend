import { apiClient } from "@vc/api-client";
import { AdminSectionLayout } from "../../../components/AdminSectionLayout";
import { withAdminAuth } from "../../../lib/withAdminAuth";
import { TestimonialsSectionForm } from "../TestimonialsSectionForm";

export const dynamic = "force-dynamic";

export default async function InicioExperienciasPage() {
  const testimonialsSection = await withAdminAuth(
    apiClient.getAdminHomeTestimonialsSection(),
    "/inicio/experiencias"
  );

  return (
    <AdminSectionLayout
      eyebrow="Inicio"
      title="Experiencias"
      description="Encabezado de la sección de experiencias de la portada. Los testimonios que la llenan se editan aparte."
    >
      <TestimonialsSectionForm initialConfig={testimonialsSection} />
    </AdminSectionLayout>
  );
}
