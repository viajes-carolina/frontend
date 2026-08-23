import { apiClient } from "@vc/api-client";
import { ConversationalPauseForm } from "../ConversationalPauseForm";

export const dynamic = "force-dynamic";

export default async function InicioPausaPage() {
  const conversationalPause = await apiClient.getAdminHomeConversationalPause();
  return <ConversationalPauseForm initialConfig={conversationalPause} />;
}
