import React from "react";
import { PublishingClientView } from "./PublishingClientView";

export const metadata = {
  title: "Publicación ISR & Caché | Panel Administrativo",
  description: "Control de despliegue y revalidación On-Demand ISR de Viajes Carolina",
};

export default function PublishingAdminPage() {
  return <PublishingClientView />;
}
