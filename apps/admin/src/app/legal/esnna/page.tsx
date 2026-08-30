import { apiClient } from "@vc/api-client";
import { LegalEsnnaForm } from "./LegalEsnnaForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function LegalEsnnaPage() {
  const config = await withAdminAuth(apiClient.getAdminLegalEsnna(), "/legal/esnna");
  return <LegalEsnnaForm initialConfig={config} />;
}
