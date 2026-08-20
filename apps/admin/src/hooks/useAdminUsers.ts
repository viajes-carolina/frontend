import { useState, useEffect, useCallback } from "react";
import { apiClient, AdminUserDTO, CreateAdminUserRequest, UpdateAdminUserRequest } from "@vc/api-client";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (req: CreateAdminUserRequest) => {
    const created = await apiClient.createAdminUser(req);
    setUsers((prev) => [...prev, created]);
    return created;
  };

  const updateUser = async (id: number, req: UpdateAdminUserRequest) => {
    const updated = await apiClient.updateAdminUser(id, req);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    refreshUsers: fetchUsers,
  };
}
