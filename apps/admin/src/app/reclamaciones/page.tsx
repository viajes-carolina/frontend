import { apiClient } from "@vc/api-client";
import { ClaimsInbox } from "./ClaimsInbox";
import { withAdminAuth } from "../../lib/withAdminAuth";

export const dynamic = "force-dynamic";

export default async function AdminClaimsPage() {
  const claims = await withAdminAuth(apiClient.getAdminClaims(), "/reclamaciones");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Libro de Reclamaciones Virtual
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Bandeja de atención y respuesta a quejas y reclamos registrados por consumidores según Ley N° 29571.
        </p>
      </div>

      <ClaimsInbox initialClaims={claims} />
    </div>
  );
}
