"use client";

import React from "react";
import { PublishingManagerCard, RetryableError } from "@vc/ui";
import { useAdminPublishing } from "../../hooks/useAdminPublishing";

export interface PublishingClientViewProps {
  draftUrl: string;
}

export const PublishingClientView: React.FC<PublishingClientViewProps> = ({ draftUrl }) => {
  const { status, loading, loadError, triggerPublish, refreshStatus } = useAdminPublishing();

  /* Sin esto, un fallo al leer el estado dejaba la tarjeta en su esqueleto de
     forma indefinida: `PublishingManagerCard` solo sale del esqueleto cuando
     llega un resultado, y con la petición caída no llegaba nunca. */
  if (loadError) {
    return (
      <RetryableError
        message="No se pudo leer el estado de la última publicación. El sitio publicado no ha cambiado: vuelve a intentarlo."
        onRetry={refreshStatus}
        retrying={loading}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PublishingManagerCard
        lastPublishStatus={status}
        onPublish={triggerPublish}
        loading={loading}
        draftUrl={draftUrl}
      />
    </div>
  );
};
