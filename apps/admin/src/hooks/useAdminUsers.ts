import { useState, useEffect, useCallback } from "react";
import { apiClient, AdminUserDTO, CreateAdminUserRequest, UpdateAdminUserRequest } from "@vc/api-client";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  /**
   * El fallo de carga se guardaba en un `error` que NINGUNA pantalla pintaba:
   * cuando la petición fallaba, la tabla se quedaba con su fila de "No se
   * encontraron usuarios registrados" — información falsa, porque usuarios hay,
   * lo que no hubo fue respuesta. Ahora es un booleano que la vista traduce a
   * `RetryableError`, con salida.
   */
  const [loadError, setLoadError] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const data = await apiClient.getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading admin users:", err);
      setLoadError(true);
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
    loadError,
    createUser,
    updateUser,
    refreshUsers: fetchUsers,
  };
}
