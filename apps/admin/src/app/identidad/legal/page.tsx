import { apiClient } from "@vc/api-client";
import { LegalForm } from "./LegalForm";

export const dynamic = "force-dynamic";

export default async function IdentidadLegalPage() {
  const settings = await apiClient.getSiteSettings();
  return <LegalForm initialSettings={settings} />;
}
