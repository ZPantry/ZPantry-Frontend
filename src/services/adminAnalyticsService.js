import { apiClient } from "./authService";

async function get(path, params) {
  const response = await apiClient.get(path, { params });
  if (!response.data?.success) throw new Error(response.data?.message || "Không thể tải dữ liệu analytics.");
  return response.data.data;
}

export const adminAnalyticsService = {
  overview: (days = 30) => get("/api/admin/analytics/overview", { days }),
  events: (days = 30) => get("/api/admin/analytics/events", { days }),
  screens: (days = 30) => get("/api/admin/analytics/screens", { days }),
  recognition: () => get("/api/admin/analytics/ai-recognition"),
  recipeFeedback: () => get("/api/admin/analytics/recipe-feedback"),
  revenue: (days = 30) => get("/api/admin/analytics/revenue", { days }),
  transactions: (status) => get("/api/admin/analytics/transactions", status ? { status } : undefined)
};
