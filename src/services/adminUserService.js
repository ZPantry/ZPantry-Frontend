import { apiClient } from "./authService";

function unwrap(response) {
  if (response.data?.success === false) throw new Error(response.data.message || "Yêu cầu thất bại.");
  return response.data;
}

export const adminUserService = {
  async all() {
    const users = [];
    let page = 1;
    while (true) {
      const result = unwrap(await apiClient.get("/api/users", { params: { pageIndex: page, pageSize: 100 } }));
      users.push(...(result.data || []));
      if (!result.hasNextPage) return users;
      page += 1;
    }
  },
  async remove(id) {
    unwrap(await apiClient.delete(`/api/users/${encodeURIComponent(id)}`));
  },
  async changeRole(id, role) {
    unwrap(await apiClient.patch(`/api/admin/users/${encodeURIComponent(id)}/role`, { role }));
  }
};
