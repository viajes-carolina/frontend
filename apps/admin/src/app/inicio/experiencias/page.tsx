import { apiClient } from "@vc/api-client";
import { TestimonialsSectionForm } from "../TestimonialsSectionForm";

export const dynamic = "force-dynamic";

export default async function InicioExperienciasPage() {
  const testimonialsSection = await apiClient.getAdminHomeTestimonialsSection();

  return (
    <div className="space-y-8">
      <TestimonialsSectionForm initialConfig={testimonialsSection} />
    </div>
  );
}
