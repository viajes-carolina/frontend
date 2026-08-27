import { apiClient } from "@vc/api-client";
import { ConversationalPauseForm } from "../ConversationalPauseForm";
import { withAdminAuth } from "../../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function InicioPausaPage() {
  const conversationalPause = await withAdminAuth(apiClient.getAdminHomeConversationalPause(), "/inicio/pausa");
  return <ConversationalPauseForm initialConfig={conversationalPause} />;
}
