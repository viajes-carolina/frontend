import { apiClient } from "@vc/api-client";
import { TestimonialItemsPanel } from "./TestimonialItemsPanel";

export const dynamic = "force-dynamic";

export default async function InicioExperienciasTestimoniosPage() {
  const testimonials = await apiClient.getTestimonials();

  return (
    <div className="space-y-8">
      <TestimonialItemsPanel initialTestimonials={testimonials} />
    </div>
  );
}
