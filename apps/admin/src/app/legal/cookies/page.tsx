import { apiClient } from "@vc/api-client";
import { LegalCookiesForm } from "./LegalCookiesForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function LegalCookiesPage() {
  const config = await withAdminAuth(apiClient.getAdminLegalCookies(), "/legal/cookies");
  return <LegalCookiesForm initialConfig={config} />;
}
