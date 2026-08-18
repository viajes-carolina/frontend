"use client";

import React from "react";
import { PublishingManagerCard } from "@vc/ui";
import { useAdminPublishing } from "../../hooks/useAdminPublishing";

export const PublishingClientView: React.FC = () => {
  const { status, loading, triggerPublish } = useAdminPublishing();

  return (
    <div className="space-y-6">
      <PublishingManagerCard
        lastPublishStatus={status}
        onPublish={triggerPublish}
        loading={loading}
      />
    </div>
  );
};
