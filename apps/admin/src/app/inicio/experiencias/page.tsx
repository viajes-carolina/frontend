import { apiClient } from "@vc/api-client";
import { TestimonialsSectionForm } from "../TestimonialsSectionForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function InicioExperienciasPage() {
  const testimonialsSection = await withAdminAuth(
    apiClient.getAdminHomeTestimonialsSection(),
    "/inicio/experiencias"
  );

  return (
    <div className="space-y-8">
      <TestimonialsSectionForm initialConfig={testimonialsSection} />
    </div>
  );
}
