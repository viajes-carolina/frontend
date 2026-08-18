"use client";

import React from "react";
import { UsersTable } from "@vc/ui";
import { useAdminUsers } from "../../hooks/useAdminUsers";

export function UsersClientView() {
  const { users, loading, createUser, updateUser } = useAdminUsers();

  return (
    <div className="space-y-6">
      <UsersTable
        users={users}
        loading={loading}
        onCreateUser={createUser}
        onUpdateUser={updateUser}
      />
    </div>
  );
}
