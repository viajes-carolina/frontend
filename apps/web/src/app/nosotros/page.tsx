import { apiClient } from "@vc/api-client";
import {
  AboutHeroSection,
  MissionSection,
  AccompanySection,
  AdvisorsSection,
  MomentsSection,
  HumanReplySection,
} from "@vc/ui";

export const metadata = {
  title: "Nosotros | Viajes Carolina - Agencia Boutique en Miraflores",
  description: "Conoce la historia, la misión y al equipo de asesoras que acompaña cada viaje en Viajes Carolina.",
};

export default async function NosotrosPage() {
  const [data, settings] = await Promise.all([
    apiClient.getPublicAbout({ revalidate: 3600 }),
    apiClient.getSiteSettings({ revalidate: 3600 }),
  ]);

  return (
    <main className="w-full bg-surface-ivory text-neutral-ink min-h-screen">
      {/* 01. Hero humano */}
      <AboutHeroSection page={data.page} whatsappPhone={settings.whatsappPhone} />

      {/* 02. Misión */}
      <MissionSection page={data.page} />

      {/* 03. Cómo te acompañamos */}
      <AccompanySection page={data.page} />

      {/* 04. Equipo — quién te acompaña */}
      <AdvisorsSection advisors={data.advisors} />

      {/* 05. Experiencias que humanizan */}
      <MomentsSection page={data.page} />

      {/* 06. Una persona al otro lado */}
      <HumanReplySection page={data.page} />
    </main>
  );
}
