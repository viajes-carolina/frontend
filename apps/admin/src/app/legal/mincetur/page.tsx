import { apiClient } from "@vc/api-client";
import { LegalMinceturForm } from "./LegalMinceturForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function LegalMinceturPage() {
  const config = await withAdminAuth(apiClient.getAdminLegalMincetur(), "/legal/mincetur");
  return <LegalMinceturForm initialConfig={config} />;
}
