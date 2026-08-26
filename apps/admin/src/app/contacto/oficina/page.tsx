import { apiClient } from "@vc/api-client";
import { OfficeForm } from "./OfficeForm";

export const dynamic = "force-dynamic";

export default async function OfficeSettingsPage() {
  const office = await apiClient.getOfficeLocation();

  return <OfficeForm initialOffice={office} />;
}
