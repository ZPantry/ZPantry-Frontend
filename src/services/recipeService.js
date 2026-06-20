import { recipes } from "../data/mockData";

export const recipeService = {
  all() {
    return recipes;
  },
  get(id) {
    return recipes.find((recipe) => recipe.id === id);
  },
  suggest(ingredients) {
    const available = ingredients.map((item) => item.name.toLowerCase());
    return recipes
      .map((recipe) => {
        const matching = recipe.ingredients.filter((ingredient) => available.some((item) => item.includes(ingredient) || ingredient.includes(item)));
        const missing = recipe.ingredients.filter((ingredient) => !matching.includes(ingredient));
        return { ...recipe, matching, missing, score: Math.round((matching.length / recipe.ingredients.length) * 100) };
      })
      .sort((a, b) => b.score - a.score || a.time - b.time);
  }
};
