import { apiClient } from "@vc/api-client";
import { AboutHeroSection, AccompanySection, AdvisorsSection } from "@vc/ui";

export const metadata = {
  title: "Nosotros | Viajes Carolina - Agencia Boutique en Miraflores",
  description: "Conoce nuestra forma de trabajar y al equipo de asesoras que acompaña cada viaje en Viajes Carolina.",
};

export default async function NosotrosPage() {
  const [data, settings] = await Promise.all([
    apiClient.getPublicAbout({ revalidate: 3600 }),
    apiClient.getSiteSettings({ revalidate: 3600 }),
  ]);

  return (
    <main className="w-full text-neutral-ink min-h-screen">
      {/* 01. Hero institucional */}
      <AboutHeroSection page={data.page} whatsappPhone={settings.whatsappPhone} />

      {/* 02. Nuestra forma de trabajar */}
      <AccompanySection page={data.page} />

      {/* 03. Quién está detrás — equipo */}
      <AdvisorsSection
        advisors={data.advisors}
        advisorsBadge={data.page.advisorsBadge ?? ""}
        advisorsHighlights={data.page.advisorsHighlights}
      />
    </main>
  );
}
