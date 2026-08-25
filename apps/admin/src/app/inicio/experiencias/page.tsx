import { apiClient } from "@vc/api-client";
import { TestimonialsSectionForm } from "../TestimonialsSectionForm";
import { TestimonialItemsPanel } from "./TestimonialItemsPanel";

export const dynamic = "force-dynamic";

export default async function InicioExperienciasPage() {
  const [testimonialsSection, testimonials] = await Promise.all([
    apiClient.getAdminHomeTestimonialsSection(),
    apiClient.getTestimonials(),
  ]);
  return (
    <div className="space-y-8">
      <TestimonialsSectionForm initialConfig={testimonialsSection} />
      <TestimonialItemsPanel initialTestimonials={testimonials} />
    </div>
  );
}
