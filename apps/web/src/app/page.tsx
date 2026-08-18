import { Button, WhatsAppButton, JourneyConnector } from "@vc/ui";
import { apiClient } from "@vc/api-client";

export default async function HomePage() {
  const siteInfo = await apiClient.getInfo();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto">
      {/* Eyebrow */}
      <span className="text-xs uppercase tracking-[0.1em] font-sora font-semibold text-brand-sunset mb-4 px-3.5 py-1.5 rounded-full bg-brand-navy/60 border border-brand-sunset/30">
        Primera Parada
      </span>

      {/* Main Title Sora ExtraBold 52px */}
      <h1 className="font-sora font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.15] mb-6">
        Tu próximo viaje <span className="text-brand-accent">empieza aquí</span>
      </h1>

      {/* Description Inter 18px */}
      <p className="font-inter text-atmosphere-sky text-lg sm:text-xl max-w-2xl leading-relaxed mb-8">
        Cuéntanos cómo quieres sentirte y diseñaremos el viaje contigo. Asesoría personalizada y acompañamiento en cada paso.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <WhatsAppButton
          size="lg"
          message="Hola Viajes Carolina, deseo planificar mi próximo viaje."
        >
          Escríbenos por WhatsApp
        </WhatsAppButton>
        <Button variant="secondary" size="lg">
          Ver Promociones
        </Button>
      </div>

      {/* Journey Connector */}
      <JourneyConnector />

      {/* System Info Footnote */}
      <div className="mt-8 text-xs text-neutral-subtle/70">
        <span>{siteInfo.name}</span> · <span>{siteInfo.architecture}</span>
      </div>
    </main>
  );
}
