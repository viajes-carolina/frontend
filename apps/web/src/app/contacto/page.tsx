import { apiClient } from "@vc/api-client";
import { ContactClientView } from "./ContactClientView";
import { FaqSection, ClosingCtaSection, JourneyConnector, ContactExploreSection } from "@vc/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contacto & Cotizaciones | Viajes Carolina - Miraflores, Lima",
  description: "Ponte en contacto con una asesora de Viajes Carolina por WhatsApp, formulario o visítanos en Miraflores. Asesoría 100% personalizada sin costo.",
};

export default async function ContactoPage() {
  const [contactData, trustData, siteSettings, exploreLinks] = await Promise.all([
    apiClient.getPublicContact(),
    apiClient.getPublicTrust(),
    apiClient.getSiteSettings(),
    apiClient.getContactExploreLinks(),
  ]);

  return (
    <main className="w-full bg-neutral-soft text-neutral-ink min-h-screen">
      {/* 01. Contact Client Hero & Form Grid */}
      <ContactClientView contactData={contactData} />

      <JourneyConnector />

      {/* 02. Enlaces de Exploración, Soporte y Libro de Reclamaciones */}
      <ContactExploreSection links={exploreLinks} />

      <JourneyConnector />

      {/* 03. FAQ Reminders */}
      {trustData.faqs && trustData.faqs.length > 0 && (
        <>
          <FaqSection faqs={trustData.faqs} settings={siteSettings} />
          <JourneyConnector />
        </>
      )}

      {/* 04. Closing CTA */}
      <ClosingCtaSection settings={siteSettings} />
    </main>
  );
}
