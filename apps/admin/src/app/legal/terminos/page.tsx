import { apiClient } from "@vc/api-client";
import { LegalTerminosForm } from "./LegalTerminosForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function LegalTerminosPage() {
  const config = await withAdminAuth(apiClient.getAdminLegalTerminos(), "/legal/terminos");
  return <LegalTerminosForm initialConfig={config} />;
}
