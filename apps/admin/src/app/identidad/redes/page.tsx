import { apiClient } from "@vc/api-client";
import { RedesForm } from "./RedesForm";

export const dynamic = "force-dynamic";

export default async function IdentidadRedesPage() {
  const settings = await apiClient.getSiteSettings();
  return <RedesForm initialSettings={settings} />;
}
