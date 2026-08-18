import { HeroSection, JourneyConnector, IntentionsSection, PromotionsSection } from "@vc/ui";
import { apiClient } from "@vc/api-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [siteSettings, homeHero, intentions, promotions] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getHomeHero(),
    apiClient.getTravelIntentions(),
    apiClient.getFeaturedPromotions(),
  ]);

  return (
    <main className="min-h-screen bg-atmosphere-twilight text-white flex flex-col items-center">
      {/* =========================================================================
          01 · Hero Section Dinámica (Figma: 01. Hero — Tu viaje comienza antes de despegar)
          ========================================================================= */}
      <HeroSection hero={homeHero} settings={siteSettings} />

      {/* =========================================================================
          02 · Journey Connector (Figma: 06 — Journey Connector)
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

      {/* Continue journey cue */}
      <div className="flex flex-col items-center gap-2 pb-16 opacity-70 hover:opacity-100 transition-opacity">
        <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-brand-sunset" />
        <span className="font-sora text-[10px] font-bold tracking-[0.15em] text-brand-sunset uppercase">
          Sigue bajando · El viaje recién comienza
        </span>
      </div>
    </main>
  );
}
