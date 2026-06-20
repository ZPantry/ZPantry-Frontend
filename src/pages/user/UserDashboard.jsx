import { CalendarDays, Clock, Package, Plus, Sparkles, UserRound } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/ui/Fields";
import { authService } from "../../services/authService";
import { ingredientService } from "../../services/ingredientService";
import { mealPlanService, slots } from "../../services/mealPlanService";
import { recipeService } from "../../services/recipeService";
import { userService } from "../../services/userService";

export function UserDashboard() {
  const auth = authService.current();
  const user = userService.get(auth.id);
  if (!user?.profile?.onboarded) return <Navigate to="/onboarding" replace />;
  const ingredients = ingredientService.all(auth.id);
  const meals = mealPlanService.all(auth.id);
  const expiring = ingredientService.nearExpiration(ingredients);
  const suggestions = recipeService.suggest(ingredients).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow="Tổng quan" title={`Chào mừng trở lại, ${user.profile.fullName || auth.name}`} description="Lên kế hoạch hôm nay, xem nhanh cả tuần và ưu tiên dùng nguyên liệu sắp hết hạn." />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Package} label="Nguyên liệu đang có" value={ingredients.length} />
        <StatCard icon={Clock} label="Sắp hết hạn" value={expiring.length} tone="green" />
        <StatCard icon={CalendarDays} label="Món đã lên lịch" value={meals.length} tone="blue" />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between"><h3 className="font-heading text-2xl font-black">Lịch ăn hôm nay</h3><Link className="font-bold text-orange-600" to="/meal-plan">Mở lịch</Link></div>
          <div className="grid gap-3 md:grid-cols-2">
            {slots.map((slot) => {
              const meal = meals.find((item) => item.slot === slot);
              return <div key={slot} className="rounded-2xl bg-orange-50 p-4"><p className="text-xs font-black uppercase text-orange-600">{slot}</p><h4 className="mt-2 font-heading text-lg font-black">{meal?.name || "Chưa lên lịch"}</h4><p className="text-sm text-slate-600">{meal?.ingredients?.join(", ") || "Thêm món khi bạn sẵn sàng."}</p></div>;
            })}
          </div>
        </div>
        <div className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-2xl font-black">Thao tác nhanh</h3>
          <div className="mt-4 grid gap-3">
            {[
              ["/ingredients", "Thêm nguyên liệu", Plus],
              ["/ingredients", "Xem kho nguyên liệu", Package],
              ["/suggestions", "Gợi ý món ăn", Sparkles],
              ["/meal-plan", "Lập thực đơn tuần", CalendarDays],
              ["/profile/edit", "Cập nhật hồ sơ", UserRound]
            ].map(([to, label, Icon]) => <Link key={label} to={to} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 font-bold hover:bg-orange-50"><Icon size={18} />{label}</Link>)}
          </div>
        </div>
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm"><h3 className="font-heading text-2xl font-black">Tổng quan tuần</h3><div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-bold">{["T2","T3","T4","T5","T6","T7","CN"].map((day, i) => <span key={day} className={`rounded-2xl p-3 ${i < 4 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{day}<br />{i < 4 ? "2 món" : "Trống"}</span>)}</div></div>
        <div className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm"><h3 className="font-heading text-2xl font-black">Gợi ý từ tủ bếp</h3><div className="mt-4 grid gap-3">{suggestions.map((recipe) => <Link to={`/suggestions/${recipe.id}`} key={recipe.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span className="font-bold">{recipe.name}</span><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">{recipe.score}% khớp</span></Link>)}</div></div>
      </section>
    </>
  );
}
