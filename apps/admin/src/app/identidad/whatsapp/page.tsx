import { apiClient } from "@vc/api-client";
import { WhatsappForm } from "./WhatsappForm";

export const dynamic = "force-dynamic";

export default async function IdentidadWhatsappPage() {
  const settings = await apiClient.getSiteSettings();
  return <WhatsappForm initialSettings={settings} />;
}
