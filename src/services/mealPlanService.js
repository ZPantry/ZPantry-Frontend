import { keys, read, write } from "./storage";

export const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
export const slots = ["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"];

export const mealPlanService = {
  all(userId) {
    return read(keys.meals, []).filter((meal) => meal.userId === userId);
  },
  save(meal) {
    const all = read(keys.meals, []);
    const next = meal.id ? all.map((item) => (item.id === meal.id ? meal : item)) : [{ ...meal, id: `meal-${Date.now()}` }, ...all];
    write(keys.meals, next);
    return next.filter((item) => item.userId === meal.userId);
  },
  remove(id, userId) {
    write(keys.meals, read(keys.meals, []).filter((meal) => meal.id !== id));
    return this.all(userId);
  },
  toggle(id, userId) {
    const next = read(keys.meals, []).map((meal) => (meal.id === id ? { ...meal, completed: !meal.completed } : meal));
    write(keys.meals, next);
    return this.all(userId);
  }
};
