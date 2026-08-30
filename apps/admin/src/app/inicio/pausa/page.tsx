import { apiClient } from "@vc/api-client";
import { AdminSectionLayout } from "../../../components/AdminSectionLayout";
import { withAdminAuth } from "../../../lib/withAdminAuth";
import { ConversationalPauseForm } from "../ConversationalPauseForm";

export const dynamic = "force-dynamic";

export default async function InicioPausaPage() {
  const conversationalPause = await withAdminAuth(
    apiClient.getAdminHomeConversationalPause(),
    "/inicio/pausa"
  );

  return (
    <AdminSectionLayout
      eyebrow="Inicio"
      title="Pausa conversacional"
      description="Bloque de respiro entre el blog y las experiencias, con la invitación a escribir por WhatsApp."
    >
      <ConversationalPauseForm initialConfig={conversationalPause} />
    </AdminSectionLayout>
  );
}
