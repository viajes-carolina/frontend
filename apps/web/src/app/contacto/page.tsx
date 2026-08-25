import { apiClient } from "@vc/api-client";
import { ContactHeroSection, OfficeMapSection } from "@vc/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contacto | Viajes Carolina - Miraflores, Lima",
  description: "Escríbenos por WhatsApp y conversemos sobre tu próximo viaje. Asesoría 100% personalizada, sin formularios impersonales.",
};

export default async function ContactoPage() {
  const [contactData, siteSettings] = await Promise.all([
    apiClient.getPublicContact(),
    apiClient.getSiteSettings(),
  ]);

  return (
    <main className="w-full bg-surface-ivory text-neutral-ink min-h-screen">
      {/* 01. Hero conversación */}
      <ContactHeroSection
        page={contactData.page}
        contactEmail={contactData.contactEmail}
        officeAddress={contactData.officeAddress}
        officeHours={contactData.officeHours}
        officeScheduleSaturdays={contactData.officeScheduleSaturdays}
        whatsappPhone={siteSettings.whatsappPhone}
      />

      {/* 02. Oficina y Google Maps */}
      <OfficeMapSection
        page={contactData.page}
        officeGoogleMapsUrl={contactData.officeGoogleMapsUrl}
        officeAddress={contactData.officeAddress}
        officeHours={contactData.officeHours}
        officeScheduleSaturdays={contactData.officeScheduleSaturdays}
        officeLatitude={contactData.officeLatitude}
        officeLongitude={contactData.officeLongitude}
      />
    </main>
  );
}
