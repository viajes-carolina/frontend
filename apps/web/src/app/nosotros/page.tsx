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
  const [data, settings, office] = await Promise.all([
    apiClient.getPublicAbout(),
    apiClient.getSiteSettings(),
    apiClient.getOfficeLocation(),
  ]);

  return (
    <main className="w-full bg-neutral-soft text-neutral-ink min-h-screen">
      {/* 01. Hero & Stats */}
      <AboutHeroSection page={data.page} />

      <JourneyConnector step="01" label="Nuestra historia" />

      {/* 02. Story & Values */}
      <StorySection page={data.page} office={office} />

      {/* 03. Mission & Vision */}
      <MissionVisionSection page={data.page} />

      {/* 04. Team / Advisors */}
      <AdvisorsSection advisors={data.advisors} />

      <JourneyConnector step="02" label="Conversemos" />

      {/* 05. Closing CTA */}
      <ClosingCtaSection settings={settings} />
    </main>
  );
}
