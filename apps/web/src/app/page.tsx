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
          01 · Hero Section Dinámica (Figma: 01. Hero — Tu viaje comienza antes de despegar)
          ========================================================================= */}
      <HeroSection hero={homeHero} settings={siteSettings} />

      {/* =========================================================================
          02 · Journey Connector
          ========================================================================= */}
      <div className="w-full max-w-5xl px-4 my-6">
        <JourneyConnector />
      </div>

      {/* =========================================================================
          03 · Intenciones de Viaje (Figma: 02. Intenciones de Viaje)
          ========================================================================= */}
      <IntentionsSection intentions={intentions} settings={siteSettings} />

      {/* =========================================================================
          04 · Journey Connector
          ========================================================================= */}
      <div className="w-full max-w-5xl px-4 my-6">
        <JourneyConnector />
      </div>

      {/* =========================================================================
          05 · Promociones Destacadas (Figma: 03. Promociones Destacadas)
          ========================================================================= */}
      <PromotionsSection promotions={promotions} settings={siteSettings} />

      {/* =========================================================================
          06 · Journey Connector
          ========================================================================= */}
      <div className="w-full max-w-5xl px-4 my-6">
        <JourneyConnector />
      </div>

      {/* =========================================================================
          07 · Inspiración desde Blog (Figma: 06. Inspiración para tu viaje)
          ========================================================================= */}
      <BlogInspirationSection config={blogInspiration.config} posts={blogInspiration.posts} />

      {/* =========================================================================
          08 · Journey Connector
          ========================================================================= */}
      <div className="w-full max-w-5xl px-4 my-6">
        <JourneyConnector />
      </div>

      {/* =========================================================================
          09 · Testimonios y Experiencias de Clientes (Figma: 04. Confianza y Testimonios)
          ========================================================================= */}
      <TestimonialsSection testimonials={trustData.testimonials} />

      {/* =========================================================================
          08 · Journey Connector
          ========================================================================= */}
      <div className="w-full max-w-5xl px-4 my-6">
        <JourneyConnector />
      </div>

      {/* =========================================================================
          09 · Preguntas Frecuentes FAQ (Figma: 05. Preguntas Frecuentes)
          ========================================================================= */}
      <FaqSection faqs={trustData.faqs} settings={siteSettings} />

      {/* =========================================================================
          10 · Journey Connector
          ========================================================================= */}
      <div className="w-full max-w-5xl px-4 my-6">
        <JourneyConnector />
      </div>

      {/* =========================================================================
          11 · Cierre y Gran Llamado a la Acción (Figma: 07. Conversación Final)
          ========================================================================= */}
      <ClosingCtaSection settings={siteSettings} />
    </main>
  );
}
