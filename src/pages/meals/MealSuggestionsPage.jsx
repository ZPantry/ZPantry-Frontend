import { CalendarPlus, Eye, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { ingredientService } from "../../services/ingredientService";
import { mealPlanService } from "../../services/mealPlanService";
import { recipeService } from "../../services/recipeService";

export function MealSuggestionsPage() {
  const auth = authService.current();
  const ingredients = ingredientService.all(auth.id);
  const [suggestions, setSuggestions] = useState(recipeService.suggest(ingredients));
  const toast = useToast();
  const refresh = () => { setSuggestions(recipeService.suggest(ingredients)); toast.show("Đã làm mới gợi ý."); };
  const add = (recipe) => { mealPlanService.save({ userId: auth.id, date: new Date().toISOString().slice(0, 10), day: "Thứ Hai", slot: recipe.type, name: recipe.name, ingredients: recipe.ingredients, completed: false }); toast.show("Đã thêm vào lịch bữa ăn."); };

  return (
    <>
      <PageHeader eyebrow="Gợi ý thông minh" title="Món ăn dựa trên nguyên liệu của tôi" description="Thuật toán mẫu so khớp tủ bếp của bạn với bộ công thức và xếp hạng món phù hợp nhất." action={<button onClick={refresh} className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white"><Sparkles size={18} />Gợi ý món</button>} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {suggestions.map((recipe) => (
          <article key={recipe.id} className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 h-32 rounded-[22px] bg-[linear-gradient(135deg,#fed7aa,#dcfce7)]" />
            <div className="flex items-start justify-between gap-3"><h3 className="font-heading text-xl font-black">{recipe.name}</h3><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">{recipe.score}%</span></div>
            <p className="mt-2 text-sm text-slate-600">{recipe.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">{recipe.tags.map((tag) => <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{tag}</span>)}</div>
            <p className="mt-4 text-sm"><strong>Đang có:</strong> {recipe.matching.join(", ") || "Chưa có nguyên liệu khớp"}</p>
            <p className="mt-1 text-sm text-slate-600"><strong>Còn thiếu:</strong> {recipe.missing.join(", ") || "Không thiếu gì"}</p>
            <p className="mt-1 text-sm text-slate-600">{recipe.time} phút • {recipe.difficulty} • {recipe.type}</p>
            <div className="mt-5 flex gap-2"><button onClick={() => add(recipe)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"><CalendarPlus size={17} />Thêm</button><Link to={`/suggestions/${recipe.id}`} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black"><Eye size={17} />Chi tiết</Link></div>
          </article>
        ))}
      </section>
    </>
  );
}
