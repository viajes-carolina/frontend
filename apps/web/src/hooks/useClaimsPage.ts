"use client";

import { apiClient, SubmitClaimRequest } from "@vc/api-client";

export function useClaimsPage() {
  const handleSubmitClaim = async (payload: SubmitClaimRequest) => {
    return await apiClient.submitClaim(payload);
  };

  const handleLookupClaim = async (claimCode: string) => {
    return await apiClient.getClaimByCode(claimCode);
  };

  return { handleSubmitClaim, handleLookupClaim };
}
