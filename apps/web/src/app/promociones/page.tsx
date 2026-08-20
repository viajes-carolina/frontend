import { apiClient } from "@vc/api-client";
import { PromotionCard } from "@vc/ui";

export const dynamic = "force-dynamic";

export default async function PromotionsCatalogPage() {
  const [siteSettings, promotions] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getPromotions(),
  ]);

  return (
    <main className="min-h-screen bg-neutral-soft text-neutral-ink flex flex-col items-center pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-border shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-accent">
              Catálogo Completo
            </span>
          </div>

          <h1 className="font-sora font-extrabold text-3xl sm:text-5xl text-brand-navy mb-4">
            Todas nuestras <span className="text-brand-accent">promociones y paquetes</span>
          </h1>

          <p className="font-inter text-neutral-muted text-base sm:text-lg leading-relaxed">
            Descubre todas las opciones de viaje diseñadas a medida. Cotiza directamente con una asesora por WhatsApp con vuelos y hoteles incluidos.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {promotions.map((promo) => (
            <PromotionCard
              key={promo.id || promo.slug}
              promotion={promo}
              settings={siteSettings}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
