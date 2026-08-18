import { Footer } from "@vc/ui";
import { SiteSettingsDTO, OfficeLocationDTO } from "@vc/api-client";

export interface FooterWrapperProps {
  settings: SiteSettingsDTO;
  office: OfficeLocationDTO;
}

export function FooterWrapper({ settings, office }: FooterWrapperProps) {
  return (
    <Footer
      siteName={settings.siteName}
      brandTagline={settings.brandTagline}
      contactEmail={settings.contactEmail}
      primaryPhone={settings.primaryPhone}
      whatsappPhone={settings.whatsappPhone}
      whatsappMessage={settings.whatsappDefaultMessage}
      address={office.addressLine}
      district={office.district}
      city={office.city}
      scheduleWeekdays={office.scheduleWeekdays}
      scheduleSaturdays={office.scheduleSaturdays}
      facebookUrl={settings.facebookUrl}
      instagramUrl={settings.instagramUrl}
      tiktokUrl={settings.tiktokUrl}
    />
  );
}
