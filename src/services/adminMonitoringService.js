import { apiClient } from "./authService";

function unwrap(response) {
  if (response.data?.success !== true) throw new Error(response.data?.message || "Không tải được dữ liệu quản trị.");
  return response.data.data;
}

export const adminMonitoringService = {
  async revenue() {
    return unwrap(await apiClient.get("/api/admin/monitoring/revenue"));
  },
  async services() {
    return unwrap(await apiClient.get("/api/admin/monitoring/services", { timeout: 8_000 }));
  },
  async ingredientCount() {
    const response = await apiClient.get("/api/ingredients", { params: { pageIndex: 1, pageSize: 1 } });
    if (response.data?.success !== true) throw new Error(response.data?.message || "Không tải được số nguyên liệu.");
    return response.data.totalItems;
  }
};
