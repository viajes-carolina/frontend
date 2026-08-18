import { AuditLogsClientView } from "./AuditLogsClientView";

export const metadata = {
  title: "Bitácora de Auditoría · Panel Administrativo",
  description: "Trazabilidad inmutable de mutaciones y gobernanza en Viajes Carolina.",
};

export default function AuditLogsPage() {
  return <AuditLogsClientView />;
}
