import { apiClient } from "@vc/api-client";
import { TestimonialItemsPanel } from "./TestimonialItemsPanel";
import { withAdminAuth } from "../../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function InicioExperienciasTestimoniosPage() {
  const testimonials = await withAdminAuth(apiClient.getTestimonials(), "/inicio/experiencias/testimonios");

  return (
    <div className="space-y-8">
      <TestimonialItemsPanel initialTestimonials={testimonials} />
    </div>
  );
}
