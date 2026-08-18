import { apiClient } from "@vc/api-client";
import { ContactClientView } from "./ContactClientView";
import { FaqSection, ClosingCtaSection, JourneyConnector } from "@vc/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contacto & Cotizaciones | Viajes Carolina - Miraflores, Lima",
  description: "Ponte en contacto con una asesora de Viajes Carolina por WhatsApp, formulario o visítanos en Miraflores. Asesoría 100% personalizada sin costo.",
};

export default async function ContactoPage() {
  const [contactData, trustData, siteSettings] = await Promise.all([
    apiClient.getPublicContact(),
    apiClient.getPublicTrust(),
    apiClient.getSiteSettings(),
  ]);

  return (
    <main className="w-full bg-brand-navy text-white min-h-screen">
      {/* 01. Contact Client Hero & Form Grid */}
      <ContactClientView contactData={contactData} />

      <JourneyConnector />

      {/* 02. FAQ Reminders */}
      {trustData.faqs && trustData.faqs.length > 0 && (
        <>
          <FaqSection faqs={trustData.faqs} settings={siteSettings} />
          <JourneyConnector />
        </>
      )}

      {/* 03. Closing CTA */}
      <ClosingCtaSection settings={siteSettings} />
    </main>
  );
}
