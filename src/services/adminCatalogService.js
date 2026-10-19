import { apiClient } from "./authService";

function unwrap(response) {
  const result = response.data;
  if (result?.success === false) throw new Error(result.message || "Yêu cầu thất bại.");
  return result;
}

async function all(kind) {
  const items = [];
  let page = 1;
  while (true) {
    const result = unwrap(await apiClient.get(`/api/${kind}`, { params: { pageIndex: page, pageSize: 100 } }));
    items.push(...(result.data || []));
    if (!result.hasNextPage) return items;
    page += 1;
  }
}

async function save(kind, id, payload) {
  const path = `/api/${kind}${id ? `/${encodeURIComponent(id)}` : ""}`;
  const body = kind === "ingredients" ? {
    name: payload.name, category: payload.category, unit: payload.unit,
    caloriesPerUnit: payload.caloriesPerUnit,
    [id ? "proteinPerUnit" : "protenPerUnit"]: payload.proteinPerUnit,
    fatPerUnit: payload.fatPerUnit, carbPerUnit: payload.carbPerUnit,
    imageUrl: payload.imageUrl, gradientFrom: payload.gradientFrom,
    gradientTo: payload.gradientTo, allergens: payload.allergens
  } : {
    name: payload.name, description: payload.description, cookingTimeMinutes: payload.cookingTimeMinutes,
    difficulty: payload.difficulty, servingSize: payload.servingSize,
    instructionText: payload.instructionText, imageUrl: payload.imageUrl,
    sourceType: payload.sourceType, gradientFrom: payload.gradientFrom,
    gradientTo: payload.gradientTo, allergens: payload.allergens,
    ingredients: payload.ingredients.map((item) => ({
      ingredientId: item.ingredientId, ingredientName: item.ingredientName,
      quantity: item.quantity, unit: item.unit, isRequired: item.isRequired, note: item.note || ""
    }))
  };
  const response = id ? await apiClient.put(path, body) : await apiClient.post(path, body);
  return unwrap(response).data;
}

async function remove(kind, id) {
  unwrap(await apiClient.delete(`/api/${kind}/${encodeURIComponent(id)}`));
}

async function getIngredient(id) {
  return unwrap(await apiClient.get(`/api/ingredients/${encodeURIComponent(id)}`)).data;
}

async function uploadImage(file) {
  const body = new FormData();
  body.append("file", file);
  return unwrap(await apiClient.post("/api/media/upload", body, { headers: { "Content-Type": "multipart/form-data" } })).data;
}

async function aliases(id) {
  return unwrap(await apiClient.get(`/api/ingredients/${encodeURIComponent(id)}/aliases`)).data || [];
}

async function addAlias(id, aliasName) {
  return unwrap(await apiClient.post(`/api/ingredients/${encodeURIComponent(id)}/aliases`, { aliasName })).data;
}

async function removeAlias(id, aliasId) {
  unwrap(await apiClient.delete(`/api/ingredients/${encodeURIComponent(id)}/aliases/${encodeURIComponent(aliasId)}`));
}

export const adminCatalogService = { all, save, remove, getIngredient, uploadImage, aliases, addAlias, removeAlias };
