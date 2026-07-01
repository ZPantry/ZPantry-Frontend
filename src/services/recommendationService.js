import { recipes } from "../data/mockData";
import { apiClient } from "./authService";
import { recipeService } from "./recipeService";

function getErrorMessage(error, fallback = "Không thể lấy gợi ý món ăn.") {
  const data = error?.response?.data;
  const fieldError = Array.isArray(data?.errors) ? data.errors.find((item) => item?.message) : null;
  const validationError =
    data?.errors && !Array.isArray(data.errors)
      ? Object.values(data.errors).flat().find(Boolean)
      : "";
  return fieldError?.message || validationError || data?.message || data?.title || error?.message || fallback;
}

function cleanNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toRecommendationPayload(payload) {
  const request = {
    inputIngredientText: payload.inputIngredientText || "",
    ingredients: Array.isArray(payload.ingredients) ? payload.ingredients.filter((item) => typeof item === "string") : [],
    candidateRecipes: Array.isArray(payload.candidateRecipes) ? payload.candidateRecipes : [],
    topK: Math.min(Math.max(cleanNumber(payload.topK) || 5, 1), 10)
  };
  if (payload.userId) request.userId = payload.userId;
  return request;
}

function hasPositiveMatch(item) {
  return cleanNumber(item.matchScore ?? item.score ?? item.confidence ?? 0) > 0;
}

function extractRecommendations(body) {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.recommendations)) return body.recommendations;
  if (Array.isArray(body?.data?.recommendations)) return body.data.recommendations;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.data?.items)) return body.data.items;
  return [];
}

function normalizeRecommendation(item, index = 0) {
  const rawScore = cleanNumber(item.score ?? item.matchScore ?? item.confidence ?? 0);
  const score = rawScore > 0 && rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);
  const recipeId = item.recipeId || item.id || item.recipe?.id || recipes[index]?.id || `recommendation-${index}`;

  return {
    recipeId,
    id: recipeId,
    name: item.name || item.recipeName || item.recipe?.name || "Món được gợi ý",
    description: item.description || item.reason || item.recipe?.description || "Món phù hợp với nguyên liệu bạn đang có.",
    score,
    rank: item.rank || index + 1,
    reason: item.reason || "",
    missingIngredientCount: cleanNumber(item.missingIngredientCount ?? item.missingIngredients?.length ?? item.missingIngredientNames?.length),
    matchedIngredients: item.matchedIngredients || item.matchingIngredientNames || item.matching || [],
    missingIngredients: item.missingIngredients || item.missingIngredientNames || item.missing || [],
    tags: item.tags || item.recipe?.tags || [],
    time: item.time || item.cookingTimeMinutes || item.recipe?.cookingTimeMinutes,
    difficulty: item.difficulty || item.recipe?.difficulty,
    type: item.type || item.mealType || item.recipe?.type || "Bữa ăn"
  };
}

function normalizeResponse(body) {
  return {
    success: body?.success ?? true,
    message: body?.message || "Meal recommendations generated successfully",
    recommendations: extractRecommendations(body).filter(hasPositiveMatch).map(normalizeRecommendation),
    errors: body?.errors || null,
    traceId: body?.traceId || "",
    timestamp: body?.timestamp || "",
    fromFallback: false
  };
}

function fallbackRecommendations(payload, pantryItems = []) {
  const selected = payload.selectedIngredients.map((item) => ({
    name: item.name || item.ingredientName || item.ingredientId,
    quantity: item.quantity,
    unit: item.unit
  }));
  const source = selected.length ? selected : pantryItems;
  const suggestions = recipeService.suggest(source).filter((recipe) => cleanNumber(recipe.score) > 0).slice(0, payload.topK);

  return {
    success: true,
    message: suggestions.length ? "Meal recommendations generated from local fallback" : "No suitable recipes found.",
    recommendations: suggestions.map((recipe) =>
      normalizeRecommendation({
        ...recipe,
        recipeId: recipe.id,
        score: recipe.score,
        matchedIngredients: recipe.matching,
        missingIngredients: recipe.missing
      })
    ),
    errors: null,
    traceId: "",
    timestamp: new Date().toISOString(),
    fromFallback: true
  };
}

export const recommendationService = {
  async recommendMeals(payload, pantryItems = []) {
    const requestPayload = toRecommendationPayload(payload);
    const shouldUseLocalFallback = payload.selectedIngredients?.some((item) => item.isFallback);
    if (shouldUseLocalFallback) {
      return fallbackRecommendations({ ...requestPayload, selectedIngredients: payload.selectedIngredients || [] }, pantryItems);
    }

    try {
      const response = await apiClient.post("/api/recommendations/meals", requestPayload);
      const body = response.data;
      if (body?.success === false) throw new Error(body.message || "Failed to generate meal recommendations.");
      return normalizeResponse(body);
    } catch (error) {
      if (error?.response) throw new Error(getErrorMessage(error));
      return fallbackRecommendations({ ...requestPayload, selectedIngredients: payload.selectedIngredients || [] }, pantryItems);
    }
  }
};
