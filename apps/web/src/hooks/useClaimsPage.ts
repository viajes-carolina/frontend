"use client";

import { useRouter } from "next/navigation";
import { apiClient } from "@vc/api-client";

export function useClaimsPage() {
  const router = useRouter();

  const handleLookupClaim = async (claimCode: string) => {
    return await apiClient.getClaimByCode(claimCode);
  };

  const handleStartClaim = () => {
    router.push("/reclamaciones/registrar");
  };

  return { handleLookupClaim, handleStartClaim };
}
