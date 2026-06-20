import { CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Field, PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { ingredientService } from "../../services/ingredientService";
import { days, mealPlanService, slots } from "../../services/mealPlanService";

export function MealPlanPage() {
  const auth = authService.current();
  const ingredients = ingredientService.all(auth.id);
  const [meals, setMeals] = useState(mealPlanService.all(auth.id));
  const [mode, setMode] = useState("daily");
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), day: "Thứ Hai", slot: "Bữa sáng", name: "", ingredients: "" });
  const toast = useToast();
  const enough = (meal) => meal.ingredients?.every((need) => ingredients.some((item) => item.name.toLowerCase().includes(need.toLowerCase())));

  const add = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return toast.show("Vui lòng nhập tên món ăn.", "error");
    setMeals(mealPlanService.save({ ...form, userId: auth.id, ingredients: form.ingredients.split(",").map((x) => x.trim()).filter(Boolean), completed: false }));
    setForm({ ...form, name: "", ingredients: "" });
    toast.show("Đã thêm món vào lịch.");
  };

  return (
    <>
      <PageHeader eyebrow="Lịch ăn" title="Lịch bữa ăn" description="Chuyển giữa chế độ xem theo ngày và kế hoạch cả tuần." />
      <div className="mb-5 flex w-fit rounded-2xl bg-white p-1 shadow-sm"><button onClick={() => setMode("daily")} className={`rounded-xl px-5 py-2 font-black ${mode === "daily" ? "bg-orange-500 text-white" : ""}`}>Theo ngày</button><button onClick={() => setMode("weekly")} className={`rounded-xl px-5 py-2 font-black ${mode === "weekly" ? "bg-orange-500 text-white" : ""}`}>Theo tuần</button></div>
      <section className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={add} className="grid gap-4 rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-2xl font-black">Thêm món thủ công</h3>
          <Field label="Tên món"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Bữa"><select className={inputClass} value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>{slots.map((x) => <option key={x}>{x}</option>)}</select></Field>
          {mode === "daily" ? <Field label="Ngày"><input className={inputClass} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field> : <Field label="Thứ"><select className={inputClass} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>{days.map((x) => <option key={x}>{x}</option>)}</select></Field>}
          <Field label="Nguyên liệu sử dụng, cách nhau bằng dấu phẩy"><input className={inputClass} value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} /></Field>
          <button className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-200">Thêm món</button>
        </form>
        {mode === "daily" ? (
          <div className="grid gap-3">{slots.map((slot) => <MealSlot key={slot} title={slot} meals={meals.filter((m) => m.slot === slot)} enough={enough} setMeals={setMeals} auth={auth} />)}</div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-7">{days.map((day) => <div key={day} className="rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm"><h3 className="mb-3 font-black">{day}</h3>{slots.slice(0, 3).map((slot) => <MealSlot compact key={slot} title={slot} meals={meals.filter((m) => m.day === day && m.slot === slot)} enough={enough} setMeals={setMeals} auth={auth} />)}</div>)}</div>
        )}
      </section>
    </>
  );
}

function MealSlot({ title, meals, enough, setMeals, auth, compact }) {
  return <div className={`${compact ? "mb-3" : "rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm"}`}><p className="mb-2 text-xs font-black uppercase text-orange-600">{title}</p>{meals.length === 0 ? <p className="text-sm text-slate-500">Còn trống</p> : meals.map((meal) => <div key={meal.id} className="mb-2 rounded-2xl bg-slate-50 p-3"><div className="flex justify-between gap-2"><strong>{meal.name}</strong><button aria-label="Xóa món" onClick={() => setMeals(mealPlanService.remove(meal.id, auth.id))}><Trash2 size={16} /></button></div><p className="text-xs text-slate-500">{meal.ingredients?.join(", ") || "Chưa ghi nguyên liệu"}</p><div className="mt-2 flex items-center justify-between text-xs font-black"><span className={enough(meal) ? "text-emerald-600" : "text-red-600"}>{enough(meal) ? "Đủ nguyên liệu" : "Thiếu nguyên liệu"}</span><button aria-label="Đánh dấu hoàn thành" onClick={() => setMeals(mealPlanService.toggle(meal.id, auth.id))} className={meal.completed ? "text-emerald-600" : "text-slate-400"}><CheckCircle2 size={18} /></button></div></div>)}</div>;
}
