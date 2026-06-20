import { mockAccounts, starterIngredients, starterMealPlans } from "../data/mockData";

const keys = {
  users: "zpantry_users",
  auth: "zpantry_auth",
  ingredients: "zpantry_ingredients",
  meals: "zpantry_meal_plans",
  seedVersion: "zpantry_seed_version"
};

export function read(key, fallback) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function ensureSeedData() {
  if (localStorage.getItem(keys.seedVersion) !== "vi-2") {
    write(keys.users, mockAccounts);
    write(keys.ingredients, starterIngredients);
    write(keys.meals, starterMealPlans);
    write(keys.seedVersion, "vi-2");
    return;
  }
  if (!localStorage.getItem(keys.users)) write(keys.users, mockAccounts);
  if (!localStorage.getItem(keys.ingredients)) write(keys.ingredients, starterIngredients);
  if (!localStorage.getItem(keys.meals)) write(keys.meals, starterMealPlans);
}

export { keys };
