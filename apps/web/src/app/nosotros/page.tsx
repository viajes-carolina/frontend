import { apiClient } from "@vc/api-client";
import {
  AboutHeroSection,
  StorySection,
  MissionVisionSection,
  AdvisorsSection,
  ClosingCtaSection,
  JourneyConnector,
} from "@vc/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nosotros | Viajes Carolina - Agencia Boutique en Miraflores",
  description: "Conoce la historia, misión, valores y al equipo de asesoras especializadas de Viajes Carolina. Más de 12 años diseñando experiencias turísticas inolvidables.",
};

export default async function NosotrosPage() {
  const [data, settings] = await Promise.all([
    apiClient.getPublicAbout(),
    apiClient.getSiteSettings(),
  ]);

  return (
    <main className="w-full bg-brand-navy text-white min-h-screen">
      {/* 01. Hero & Stats */}
      <AboutHeroSection page={data.page} />

      <JourneyConnector />

      {/* 02. Story & Values */}
      <StorySection page={data.page} />

      <JourneyConnector />

      {/* 03. Mission & Vision */}
      <MissionVisionSection page={data.page} />

      <JourneyConnector />

      {/* 04. Team / Advisors */}
      <AdvisorsSection advisors={data.advisors} />

      <JourneyConnector />

      {/* 05. Closing CTA */}
      <ClosingCtaSection settings={settings} />
    </main>
  );
}
