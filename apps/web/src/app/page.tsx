import {
  HeroSection,
  JourneyConnector,
  IntentionsSection,
  PromotionsSection,
  BlogInspirationSection,
  TestimonialsSection,
  FaqSection,
  ClosingCtaSection,
} from "@vc/ui";
import { apiClient } from "@vc/api-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [siteSettings, homeHero, intentions, promotions, blogInspiration, trustData] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getHomeHero(),
    apiClient.getTravelIntentions(),
    apiClient.getFeaturedPromotions(),
    apiClient.getPublicHomeBlogInspiration(),
    apiClient.getPublicTrust(),
  ]);

  return (
    <main className="min-h-screen bg-neutral-soft text-neutral-ink flex flex-col items-center">
      {/* =========================================================================
          01 · Hero Section Dinámica — Imaginar
          ========================================================================= */}
      <HeroSection hero={homeHero} settings={siteSettings} />

      {/* Ruta narrativa, parada 1/3: arranca el recorrido */}
      <div className="w-full max-w-5xl px-4">
        <JourneyConnector step="01" label="Imaginar → Explorar" />
      </div>

      {/* =========================================================================
          02 · Intenciones de Viaje — Explorar
          ========================================================================= */}
      <IntentionsSection intentions={intentions} settings={siteSettings} />

      {/* =========================================================================
          03 · Promociones Destacadas — Explorar
          ========================================================================= */}
      <PromotionsSection promotions={promotions} settings={siteSettings} />

      {/* =========================================================================
          04 · Inspiración desde Blog — Explorar
          ========================================================================= */}
      <BlogInspirationSection config={blogInspiration.config} posts={blogInspiration.posts} />

      {/* Ruta narrativa, parada 2/3: de inspiración a validación social */}
      <div className="w-full max-w-5xl px-4">
        <JourneyConnector step="02" label="Explorar → Prepararte" />
      </div>

      {/* =========================================================================
          05 · Testimonios y Experiencias de Clientes — Prepararte
          ========================================================================= */}
      <TestimonialsSection testimonials={trustData.testimonials} />

      {/* =========================================================================
          06 · Preguntas Frecuentes FAQ — Prepararte
          ========================================================================= */}
      <FaqSection faqs={trustData.faqs} settings={siteSettings} />

      {/* Ruta narrativa, parada 3/3: llegada a la conversación */}
      <div className="w-full max-w-5xl px-4">
        <JourneyConnector step="03" label="Prepararte → Conversar" />
      </div>

      {/* =========================================================================
          07 · Cierre y Gran Llamado a la Acción — Conversar
          ========================================================================= */}
      <ClosingCtaSection settings={siteSettings} />
    </main>
  );
}
