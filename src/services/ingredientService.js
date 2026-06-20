import { keys, read, write } from "./storage";

export const categories = ["Rau củ", "Thịt", "Hải sản", "Trái cây", "Ngũ cốc", "Sữa và trứng", "Gia vị", "Đồ uống", "Khác"];
export const units = ["gram", "kg", "ml", "lít", "cái", "gói", "hộp", "chai", "hũ", "bó", "lon", "bát", "muỗng", "khác"];
export const storageLocations = ["Tủ lạnh", "Tủ đông", "Tủ bếp", "Khác"];

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
  }
};
