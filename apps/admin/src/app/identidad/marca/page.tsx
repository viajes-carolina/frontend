import { apiClient } from "@vc/api-client";
import { MarcaForm } from "./MarcaForm";

export const dynamic = "force-dynamic";

export default async function IdentidadMarcaPage() {
  const settings = await apiClient.getSiteSettings();
  return <MarcaForm initialSettings={settings} />;
}
