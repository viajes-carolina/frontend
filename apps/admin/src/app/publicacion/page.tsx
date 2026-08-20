import React from "react";
import { PublishingClientView } from "./PublishingClientView";

export const metadata = {
  title: "Publicación ISR & Caché | Panel Administrativo",
  description: "Control de despliegue y revalidación On-Demand ISR de Viajes Carolina",
};

export default function PublishingAdminPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const revalidationSecret = process.env.REVALIDATION_SECRET || "revalidation-secret-viajes-carolina-2026";
  const draftUrl = `${siteUrl}/api/draft?secret=${revalidationSecret}&path=/`;

  return <PublishingClientView draftUrl={draftUrl} />;
}
