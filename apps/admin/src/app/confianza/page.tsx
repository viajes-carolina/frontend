import { apiClient } from "@vc/api-client";
import { TrustManager } from "./TrustManager";

export const dynamic = "force-dynamic";

export default async function TrustAdminPage() {
  const [testimonials, faqs] = await Promise.all([
    apiClient.getTestimonials(),
    apiClient.getFaqs(),
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Confianza, Testimonios & FAQ
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Gestiona las opiniones de clientes verificados con consentimiento de datos y las respuestas a dudas recurrentes de los viajeros.
        </p>
      </div>

      <TrustManager initialTestimonials={testimonials} initialFaqs={faqs} />
    </div>
  );
}
