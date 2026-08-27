import { Metadata } from "next";
import { apiClient } from "@vc/api-client";
import { ClaimsClientView } from "./ClaimsClientView";

export const metadata: Metadata = {
  title: "Libro de Reclamaciones Virtual | Viajes Carolina",
  description:
    "Hoja de Reclamación Virtual conforme a la Ley N° 29571 y D.S. N° 011-2011-PCM. Registra tu queja o reclamo con total respaldo y garantía de atención formal.",
};

export default async function ReclamacionesPage() {
  const [settings, office] = await Promise.all([
    apiClient.getSiteSettings({ revalidate: 3600 }),
    apiClient.getOfficeLocation({ revalidate: 3600 }),
  ]);

  return <ClaimsClientView settings={settings} office={office} />;
}
