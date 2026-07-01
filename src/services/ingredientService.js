import { recipes, starterIngredients } from "../data/mockData";
import { apiClient } from "./authService";
import { keys, read, write } from "./storage";

export const categories = ["Rau củ", "Thịt", "Hải sản", "Trái cây", "Ngũ cốc", "Sữa và trứng", "Gia vị", "Đồ uống", "Khác"];
export const units = ["gram", "kg", "ml", "lít", "cái", "gói", "hộp", "chai", "hũ", "bó", "lon", "bát", "muỗng", "khác"];
export const storageLocations = ["Tủ lạnh", "Tủ đông", "Tủ bếp", "Khác"];

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slug(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeIngredient(item) {
  return {
    id: item.id || item.ingredientId,
    name: item.name || item.ingredientName || "",
    normalizedName: item.normalizedName || normalizeText(item.name || item.ingredientName),
    category: item.category || "Khác",
    defaultUnit: item.defaultUnit || item.unit || "g"
  };
}

function localIngredientCatalog() {
  const fromPantry = starterIngredients.map((item) => normalizeIngredient({ ...item, defaultUnit: item.unit }));
  const fromRecipes = recipes.flatMap((recipe) =>
    recipe.ingredients.map((name) =>
      normalizeIngredient({
        id: `mock-${slug(name)}`,
        name,
        normalizedName: normalizeText(name),
        category: "Gợi ý",
        defaultUnit: "g"
      })
    )
  );
  const byName = new Map();
  [...fromPantry, ...fromRecipes].forEach((item) => {
    const key = normalizeText(item.name);
    if (!byName.has(key)) byName.set(key, item);
  });
  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

function matchesSearch(item, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  return [item.name, item.normalizedName, item.category].some((value) => normalizeText(value).includes(normalizedQuery));
}

function normalizeSearchResponse(body, pageIndex, pageSize, query = "") {
  const rawItems = Array.isArray(body?.items)
    ? body.items
    : Array.isArray(body?.data?.items)
      ? body.data.items
      : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body)
          ? body
          : [];
  const items = rawItems.map(normalizeIngredient).filter((item) => item.id && item.name && matchesSearch(item, query));

  return {
    success: body?.success ?? true,
    message: body?.message || (items.length ? "Ingredients retrieved successfully" : "No ingredients found"),
    items,
    pageIndex: Number(body?.pageIndex || body?.data?.pageIndex || pageIndex),
    pageSize: Number(body?.pageSize || body?.data?.pageSize || pageSize),
    totalCount: items.length,
    fromFallback: false
  };
}

export const ingredientService = {
  all(userId) {
    return read(keys.ingredients, []).filter((item) => item.userId === userId);
  },
  save(item) {
    const all = read(keys.ingredients, []);
    const next = item.id
      ? all.map((current) => (current.id === item.id ? item : current))
      : [{ ...item, id: `ing-${Date.now()}` }, ...all];
    write(keys.ingredients, next);
    return next.filter((ingredient) => ingredient.userId === item.userId);
  },
  remove(id, userId) {
    write(keys.ingredients, read(keys.ingredients, []).filter((item) => item.id !== id));
    return this.all(userId);
  },
  nearExpiration(items) {
    const today = new Date();
    return items.filter((item) => {
      const diff = (new Date(item.expirationDate) - today) / 86400000;
      return diff <= 3 && diff >= -1;
    });
  },
  async searchSystem(search, { pageIndex = 1, pageSize = 10 } = {}) {
    const query = search.trim();
    try {
      const response = await apiClient.get("/api/ingredients", {
        params: { search: query, pageIndex, pageSize }
      });
      return normalizeSearchResponse(response.data, pageIndex, pageSize, query);
    } catch {
      const normalizedQuery = normalizeText(query);
      const filtered = localIngredientCatalog().filter((item) => normalizeText(item.name).includes(normalizedQuery));
      const start = (pageIndex - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize).map((item) => ({ ...item, isFallback: true }));
      return {
        success: true,
        message: items.length ? "Ingredients retrieved from local fallback" : "No ingredients found",
        items,
        pageIndex,
        pageSize,
        totalCount: filtered.length,
        fromFallback: true
      };
    }
  }
};
