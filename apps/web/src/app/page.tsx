import {
  HeroSection,
  PromotionsSection,
  BlogInspirationSection,
  ConversationalPauseSection,
  TestimonialsSection,
  FaqSection,
} from "@vc/ui";
import { apiClient } from "@vc/api-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    siteSettings,
    homeHero,
    promotions,
    blogInspiration,
    trustData,
    promotionsSectionConfig,
    conversationalPauseConfig,
    testimonialsSectionConfig,
    faqSectionConfig,
  ] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getHomeHero(),
    apiClient.getFeaturedPromotions(),
    apiClient.getPublicHomeBlogInspiration(),
    apiClient.getPublicTrust(),
    apiClient.getPublicHomePromotionsSection(),
    apiClient.getPublicHomeConversationalPause(),
    apiClient.getPublicHomeTestimonialsSection(),
    apiClient.getPublicHomeFaqSection(),
  ]);

  return (
    <main className="min-h-screen bg-neutral-soft text-neutral-ink flex flex-col items-center">
      {/* =========================================================================
          01 · Hero Section Dinámica — Imaginar
          ========================================================================= */}
      <HeroSection hero={homeHero} settings={siteSettings} />

      {/* =========================================================================
          02 · Promociones Destacadas — Descubrir
          ========================================================================= */}
      <PromotionsSection promotions={promotions} settings={siteSettings} config={promotionsSectionConfig} />

      {/* =========================================================================
          03 · Inspiración desde Blog — Prepararse
          ========================================================================= */}
      <BlogInspirationSection config={blogInspiration.config} posts={blogInspiration.posts} />

      {/* =========================================================================
          04 · Pausa Conversacional — Antes de seguir
          ========================================================================= */}
      <ConversationalPauseSection settings={siteSettings} config={conversationalPauseConfig} />

      {/* =========================================================================
          05 · Testimonios y Experiencias de Clientes — Prepararte
          ========================================================================= */}
      <TestimonialsSection
        testimonials={trustData.testimonials}
        config={testimonialsSectionConfig}
      />

      {/* =========================================================================
          06 · Preguntas Frecuentes FAQ — Prepararte
          ========================================================================= */}
      <FaqSection faqs={trustData.faqs} settings={siteSettings} config={faqSectionConfig} />
    </main>
  );
}
