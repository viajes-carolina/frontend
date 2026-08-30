import { apiClient } from "@vc/api-client";
import { LegalPrivacidadForm } from "./LegalPrivacidadForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function LegalPrivacidadPage() {
  const config = await withAdminAuth(apiClient.getAdminLegalPrivacidad(), "/legal/privacidad");
  return <LegalPrivacidadForm initialConfig={config} />;
}
