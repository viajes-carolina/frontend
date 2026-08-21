import {
  HeroSection,
  PromotionsSection,
  BlogInspirationSection,
  TestimonialsSection,
  FaqSection,
} from "@vc/ui";
import { apiClient } from "@vc/api-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [siteSettings, homeHero, promotions, blogInspiration, trustData] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getHomeHero(),
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

      {/* =========================================================================
          02 · Promociones Destacadas — Descubrir
          ========================================================================= */}
      <PromotionsSection promotions={promotions} settings={siteSettings} />

      {/* =========================================================================
          03 · Inspiración desde Blog — Prepararse
          ========================================================================= */}
      <BlogInspirationSection config={blogInspiration.config} posts={blogInspiration.posts} />

      {/* =========================================================================
          04 · Testimonios y Experiencias de Clientes — Prepararte
          ========================================================================= */}
      <TestimonialsSection
        testimonials={trustData.testimonials}
        memoryPhoto={{
          url: homeHero.secondaryMedia2Url,
          focalX: homeHero.secondaryMedia2FocalX,
          focalY: homeHero.secondaryMedia2FocalY,
        }}
      />

      {/* =========================================================================
          05 · Preguntas Frecuentes FAQ — Prepararte
          ========================================================================= */}
      <FaqSection faqs={trustData.faqs} settings={siteSettings} />
    </main>
  );
}
