"use client";

import React from "react";
import { RetryableError, UsersTable } from "@vc/ui";
import { useAdminUsers } from "../../hooks/useAdminUsers";

export function UsersClientView() {
  const { users, loading, loadError, createUser, updateUser, refreshUsers } = useAdminUsers();

  /* El error SUSTITUYE a la tabla en vez de acompañarla: dejarla debajo con su
     "no hay usuarios" contaría dos cosas incompatibles a la vez. */
  if (loadError) {
    return (
      <RetryableError
        message="No se pudo cargar la lista de usuarios. Ninguna cuenta se ha modificado: vuelve a intentarlo."
        onRetry={refreshUsers}
        retrying={loading}
      />
    );
  }

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
