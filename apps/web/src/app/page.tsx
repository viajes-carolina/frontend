import {
  HeroSection,
  PromotionsSection,
  BlogInspirationSection,
  ConversationalPauseSection,
  TestimonialsSection,
  FaqSection,
  ArrivalSection,
} from "@vc/ui";
import { apiClient } from "@vc/api-client";

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
    apiClient.getSiteSettings({ revalidate: 3600 }),
    apiClient.getHomeHero({ revalidate: 3600 }),
    apiClient.getFeaturedPromotions({ revalidate: 3600 }),
    apiClient.getPublicHomeBlogInspiration({ revalidate: 3600 }),
    apiClient.getPublicTrust({ revalidate: 3600 }),
    apiClient.getPublicHomePromotionsSection({ revalidate: 3600 }),
    apiClient.getPublicHomeConversationalPause({ revalidate: 3600 }),
    apiClient.getPublicHomeTestimonialsSection({ revalidate: 3600 }),
    apiClient.getPublicHomeFaqSection({ revalidate: 3600 }),
  ]);

  return (
    <main className="min-h-screen text-neutral-ink flex flex-col items-center">
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

      {/* =========================================================================
          07 · Llegada — Punto de arribo de la ruta narrativa
          ========================================================================= */}
      <ArrivalSection whatsappPhone={siteSettings.whatsappPhone} whatsappMessage={siteSettings.whatsappDefaultMessage} />
    </main>
  );
}
