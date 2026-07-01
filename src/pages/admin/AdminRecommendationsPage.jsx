import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Field, PageHeader, inputClass } from "../../components/ui/Fields";
import { adminApiService } from "../../services/adminApiService";

const defaultForm = {
  userId: "39c76c73-7b0b-44dc-9341-6e959470a5ec",
  inputIngredientText: "63895219-3498-49a9-b08d-afae33bc7415",
  ingredients: "cà chua",
  candidateRecipes: "",
  topK: 3
};

function lines(value) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPayload(form) {
  return {
    userId: form.userId.trim(),
    inputIngredientText: form.inputIngredientText.trim(),
    ingredients: lines(form.ingredients),
    candidateRecipes: lines(form.candidateRecipes),
    topK: Number(form.topK) || 3
  };
}

function recommendationItems(result) {
  return result?.items || result?.recommendations || result?.data?.recommendations || [];
}

function displayScore(item) {
  const score = Number(item.matchScore ?? item.score ?? 0);
  if (!Number.isFinite(score)) return "0%";
  return `${Math.round(score > 0 && score <= 1 ? score * 100 : score)}%`;
}

export function AdminRecommendationsPage() {
  const [form, setForm] = useState(defaultForm);
  const [mode, setMode] = useState("meals");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const run = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = toPayload(form);
      const data = mode === "meals"
        ? await adminApiService.recommendMeals(payload)
        : await adminApiService.getMissingIngredients(payload);
      setResult(data);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const items = recommendationItems(result);

  return (
    <>
      <PageHeader
        eyebrow="API /api/recommendations"
        title="Kiểm tra gợi ý món ăn"
        description="Admin test request gợi ý và xem lỗi backend/AI service trực tiếp trong web."
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={run} className="grid content-start gap-4 rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 text-sm font-black">
            <button type="button" onClick={() => setMode("meals")} className={`rounded-xl px-3 py-2 ${mode === "meals" ? "bg-white shadow" : "text-slate-500"}`}>Meals</button>
            <button type="button" onClick={() => setMode("missing")} className={`rounded-xl px-3 py-2 ${mode === "missing" ? "bg-white shadow" : "text-slate-500"}`}>Missing</button>
          </div>
          <Field label="User ID">
            <input className={inputClass} value={form.userId} onChange={(event) => updateField("userId", event.target.value)} />
          </Field>
          <Field label="Input ingredient text">
            <input className={inputClass} value={form.inputIngredientText} onChange={(event) => updateField("inputIngredientText", event.target.value)} />
          </Field>
          <Field label="Ingredients, mỗi dòng là tên nguyên liệu">
            <textarea className={inputClass} rows={4} value={form.ingredients} onChange={(event) => updateField("ingredients", event.target.value)} />
          </Field>
          <Field label="Candidate recipes">
            <textarea className={inputClass} rows={4} value={form.candidateRecipes} onChange={(event) => updateField("candidateRecipes", event.target.value)} />
          </Field>
          <Field label="Top K">
            <input className={inputClass} type="number" min="1" value={form.topK} onChange={(event) => updateField("topK", event.target.value)} />
          </Field>
          <button disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white disabled:opacity-60">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Chạy gợi ý
          </button>
        </form>

        <div className="grid content-start gap-4">
          {error ? (
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-amber-800">
              <div className="flex items-center gap-2 font-black"><AlertTriangle size={18} /> API trả lỗi</div>
              <p className="mt-2 text-sm font-semibold">{error}</p>
            </div>
          ) : null}

          {!error && !result ? (
            <div className="rounded-[24px] border border-dashed border-orange-200 bg-white p-10 text-center font-bold text-slate-500">
              Nhập dữ liệu và chạy gợi ý để xem response.
            </div>
          ) : null}

          {items.length ? (
            <div className="grid gap-3">
              {items.map((item) => (
                <article key={`${item.recipeId || item.id}-${item.rank || item.name || item.recipeName}`} className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-xl font-black">{item.recipeName || item.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.reason || item.description}</p>
                    </div>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">{item.rank ? `#${item.rank} · ` : ""}{displayScore(item)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Đã có: {(item.matchedIngredients || item.matchingIngredientNames)?.join(", ") || "Chưa có dữ liệu"}</p>
                  <p className="mt-1 text-sm text-slate-500">Thiếu: {(item.missingIngredients || item.missingIngredientNames)?.join(", ") || "Không thiếu"}</p>
                </article>
              ))}
            </div>
          ) : null}

          {result && !items.length ? (
            <pre className="overflow-auto rounded-[24px] border border-orange-100 bg-slate-950 p-5 text-sm text-slate-100">{JSON.stringify(result, null, 2)}</pre>
          ) : null}
        </div>
      </section>
    </>
  );
}
