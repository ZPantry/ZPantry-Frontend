import { apiClient } from "./authService";

function getErrorMessage(error, fallback = "Có lỗi xảy ra. Vui lòng thử lại.") {
  const data = error?.response?.data;
  const fieldError = Array.isArray(data?.errors) ? data.errors.find((item) => item?.message) : null;
  const validationError =
    data?.errors && !Array.isArray(data.errors)
      ? Object.values(data.errors).flat().find(Boolean)
      : "";
  return fieldError?.message || validationError || data?.message || data?.title || error?.message || fallback;
}

function unwrap(response) {
  const body = response.data;
  if (body && typeof body === "object" && "success" in body && body.success === false) {
    throw new Error(body.message || "Yêu cầu không thành công.");
  }
  return body;
}

function normalizePage(body, pageIndex = 1, pageSize = 10) {
  if (Array.isArray(body)) {
    return {
      items: body,
      pageIndex,
      pageSize,
      totalItems: body.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }

  const data = body?.data && typeof body.data === "object" ? body.data : {};
  const items = Array.isArray(body?.items)
    ? body.items
    : Array.isArray(data.items)
      ? data.items
      : Array.isArray(body?.data)
        ? body.data
        : [];
  const totalItems = Number(body?.totalItems ?? body?.totalCount ?? data.totalItems ?? data.totalCount ?? items.length);

  return {
    items,
    pageIndex: Number(body?.pageIndex || data.pageIndex || pageIndex),
    pageSize: Number(body?.pageSize || data.pageSize || pageSize),
    totalItems,
    totalCount: totalItems,
    totalPages: Number(body?.totalPages || data.totalPages || Math.max(1, Math.ceil(totalItems / Math.max(1, Number(body?.pageSize || data.pageSize || pageSize))))),
    hasNextPage: Boolean(body?.hasNextPage ?? data.hasNextPage),
    hasPreviousPage: Boolean(body?.hasPreviousPage ?? data.hasPreviousPage)
  };
}

async function request(task, fallback) {
  try {
    const response = await task();
    return unwrap(response);
  } catch (error) {
    throw new Error(getErrorMessage(error, fallback));
  }
}

function cleanNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export const adminApiService = {
  async listIngredients({ pageIndex = 1, pageSize = 10 } = {}) {
    const body = await request(
      () => apiClient.get("/api/ingredients", { params: { pageIndex, pageSize } }),
      "Không thể tải danh sách nguyên liệu."
    );
    return normalizePage(body, pageIndex, pageSize);
  },
  async createIngredient(form) {
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      unit: form.unit.trim(),
      caloriesPerUnit: cleanNumber(form.caloriesPerUnit),
      proteinPerUnit: cleanNumber(form.proteinPerUnit),
      fatPerUnit: cleanNumber(form.fatPerUnit),
      carbPerUnit: cleanNumber(form.carbPerUnit),
      imageUrl: form.imageUrl.trim()
    };
    const body = await request(() => apiClient.post("/api/ingredients", payload), "Không thể tạo nguyên liệu.");
    return body?.data ?? body;
  },
  async updateIngredient(id, form) {
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      unit: form.unit.trim(),
      caloriesPerUnit: cleanNumber(form.caloriesPerUnit),
      proteinPerUnit: cleanNumber(form.proteinPerUnit),
      fatPerUnit: cleanNumber(form.fatPerUnit),
      carbPerUnit: cleanNumber(form.carbPerUnit),
      imageUrl: form.imageUrl.trim()
    };
    const body = await request(() => apiClient.put(`/api/ingredients/${id}`, payload), "Không thể cập nhật nguyên liệu.");
    return body?.data ?? body;
  },
  async deleteIngredient(id) {
    const body = await request(() => apiClient.delete(`/api/ingredients/${id}`), "Không thể xóa nguyên liệu.");
    return body?.data ?? body;
  },

  async uploadMedia(file) {
    const formData = new FormData();
    formData.append("file", file);
    const body = await request(
      () => apiClient.post("/api/media/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }),
      "Không thể upload media."
    );
    return body?.data ?? body;
  },
  async getMedia(id) {
    const body = await request(() => apiClient.get(`/api/media/${id}`), "Không thể tải media.");
    return body?.data ?? body;
  },

  async listUserPantry(userId, { pageIndex = 1, pageSize = 10 } = {}) {
    const body = await request(
      () => apiClient.get(`/api/users/${userId}/pantry`, { params: { pageIndex, pageSize } }),
      "Không thể tải tủ bếp của người dùng."
    );
    return normalizePage(body, pageIndex, pageSize);
  },
  async createPantryItem(userId, form) {
    const body = await request(() => apiClient.post(`/api/users/${userId}/pantry/items`, toPantryPayload(form)), "Không thể thêm nguyên liệu vào tủ bếp.");
    return body?.data ?? body;
  },
  async updatePantryItem(userId, itemId, form) {
    const body = await request(() => apiClient.put(`/api/users/${userId}/pantry/items/${itemId}`, toPantryPayload(form)), "Không thể cập nhật nguyên liệu trong tủ bếp.");
    return body?.data ?? body;
  },
  async deletePantryItem(userId, itemId) {
    const body = await request(() => apiClient.delete(`/api/users/${userId}/pantry/items/${itemId}`), "Không thể xóa nguyên liệu khỏi tủ bếp.");
    return body?.data ?? body;
  },

  async listRecipes({ pageIndex = 1, pageSize = 10 } = {}) {
    const body = await request(
      () => apiClient.get("/api/recipes", { params: { pageIndex, pageSize } }),
      "Không thể tải danh sách công thức."
    );
    return normalizePage(body, pageIndex, pageSize);
  },
  async createRecipe(form) {
    const body = await request(() => apiClient.post("/api/recipes", toRecipePayload(form)), "Không thể tạo công thức.");
    return body?.data ?? body;
  },
  async updateRecipe(id, form) {
    const body = await request(() => apiClient.put(`/api/recipes/${id}`, toRecipePayload(form)), "Không thể cập nhật công thức.");
    return body?.data ?? body;
  },
  async deleteRecipe(id) {
    const body = await request(() => apiClient.delete(`/api/recipes/${id}`), "Không thể xóa công thức.");
    return body?.data ?? body;
  },

  async recommendMeals(payload) {
    const body = await request(() => apiClient.post("/api/recommendations/meals", toRecommendationPayload(payload)), "Không thể lấy gợi ý món ăn.");
    return body?.data ?? body;
  },
  async getMissingIngredients(payload) {
    const body = await request(() => apiClient.post("/api/recommendations/missing-ingredients", toRecommendationPayload(payload)), "Không thể lấy danh sách nguyên liệu còn thiếu.");
    return body?.data ?? body;
  },
  async getRecommendation(id) {
    const body = await request(() => apiClient.get(`/api/recommendations/${id}`), "Không thể tải gợi ý.");
    return body?.data ?? body;
  },
  async sendRecommendationFeedback(id, payload) {
    const body = await request(() => apiClient.post(`/api/recommendations/${id}/feedback`, payload), "Không thể gửi phản hồi gợi ý.");
    return body?.data ?? body;
  }
};

function toRecipePayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    cookingTimeMinutes: cleanNumber(form.cookingTimeMinutes),
    difficulty: form.difficulty.trim(),
    servingSize: cleanNumber(form.servingSize),
    instructionText: form.instructionText.trim(),
    imageUrl: form.imageUrl.trim(),
    sourceType: form.sourceType.trim() || "Manual",
    ingredients: Array.isArray(form.ingredients)
      ? form.ingredients
          .filter((item) => item.ingredientId)
          .map((item) => ({
            ingredientId: item.ingredientId,
            quantity: cleanNumber(item.quantity),
            unit: item.unit?.trim() || "",
            isRequired: Boolean(item.isRequired),
            note: item.note?.trim() || ""
          }))
      : []
  };
}

function toPantryPayload(form) {
  return {
    ingredientId: form.ingredientId,
    quantity: cleanNumber(form.quantity),
    unit: form.unit?.trim() || "",
    expiredAt: form.expiredAt || null,
    storageLocation: form.storageLocation?.trim() || "",
    note: form.note?.trim() || ""
  };
}

function toRecommendationPayload(payload) {
  return {
    userId: payload.userId,
    inputIngredientText: payload.inputIngredientText || "",
    ingredients: Array.isArray(payload.ingredients) ? payload.ingredients : [],
    candidateRecipes: Array.isArray(payload.candidateRecipes) ? payload.candidateRecipes : [],
    topK: cleanNumber(payload.topK)
  };
}
