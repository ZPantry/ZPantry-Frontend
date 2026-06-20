import { CalendarPlus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { ingredientService } from "../../services/ingredientService";
import { mealPlanService } from "../../services/mealPlanService";
import { recipeService } from "../../services/recipeService";

export function MealDetailPage() {
  const { id } = useParams();
  const auth = authService.current();
  const recipe = recipeService.get(id);
  const ingredients = ingredientService.all(auth.id);
  const suggestion = recipeService.suggest(ingredients).find((item) => item.id === id) || recipe;
  const toast = useToast();
  if (!recipe) return <PageHeader eyebrow="Không tìm thấy" title="Không tìm thấy công thức" action={<Link to="/suggestions">Quay lại</Link>} />;

  const add = (slot = recipe.type) => {
    mealPlanService.save({ userId: auth.id, date: new Date().toISOString().slice(0, 10), day: "Thứ Hai", slot, name: recipe.name, ingredients: recipe.ingredients, completed: false });
    toast.show("Đã thêm vào lịch bữa ăn.");
  };

  return (
    <>
      <PageHeader eyebrow="Chi tiết món ăn" title={recipe.name} description={recipe.description} />
      <article className="overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-sm">
        <div className="min-h-64 bg-[linear-gradient(135deg,rgba(249,115,22,.88),rgba(22,163,74,.78)),url('https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center p-8 text-white">
          <p className="font-black">{recipe.type} • {recipe.time} phút • {recipe.difficulty}</p>
          <div className="mt-5 flex flex-wrap gap-2">{recipe.tags.map((tag) => <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">{tag}</span>)}</div>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-3">
          <div><h3 className="font-heading text-xl font-black">Nguyên liệu cần có</h3><ul className="mt-3 grid gap-2 text-slate-600">{recipe.ingredients.map((x) => <li key={x}>• {x}</li>)}</ul></div>
          <div><h3 className="font-heading text-xl font-black">Đang có</h3><p className="mt-3 text-emerald-700">{suggestion.matching?.join(", ") || "Chưa có nguyên liệu khớp"}</p><h3 className="mt-5 font-heading text-xl font-black">Còn thiếu</h3><p className="mt-3 text-red-600">{suggestion.missing?.join(", ") || "Không thiếu gì"}</p></div>
          <div><h3 className="font-heading text-xl font-black">Các bước nấu</h3><ol className="mt-3 grid gap-2 text-slate-600">{recipe.steps.map((x, i) => <li key={x}>{i + 1}. {x}</li>)}</ol></div>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-orange-100 p-6"><button onClick={() => add(recipe.type)} className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white"><CalendarPlus size={18} />Thêm vào lịch ngày</button><button onClick={() => add("Bữa tối")} className="rounded-2xl border border-slate-200 px-5 py-3 font-black">Thêm vào lịch tuần</button></div>
      </article>
    </>
  );
}
