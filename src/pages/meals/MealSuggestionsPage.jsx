import { AlertCircle, CalendarPlus, Check, Eye, Loader2, Plus, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Field, PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { ingredientService } from "../../services/ingredientService";
import { mealPlanService } from "../../services/mealPlanService";
import { recommendationService } from "../../services/recommendationService";
import { recipeService } from "../../services/recipeService";

const defaultSearch = "trứng";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function displayList(items, emptyText) {
  return items?.length ? items.join(", ") : emptyText;
}

function scoreLabel(score) {
  return `${Math.max(0, Math.min(100, Math.round(toNumber(score))))}%`;
}

function validate(selectedIngredients, topK, pantryCount) {
  const errors = {};
  if (!selectedIngredients.length && pantryCount === 0) {
    errors.form = "Vui lòng chọn ít nhất một nguyên liệu hoặc thêm nguyên liệu vào tủ bếp.";
  }
  selectedIngredients.forEach((item) => {
    if (toNumber(item.quantity) <= 0) errors[`quantity-${item.ingredientId}`] = "Số lượng phải lớn hơn 0.";
    if (!item.unit.trim()) errors[`unit-${item.ingredientId}`] = "Đơn vị không được để trống.";
  });
  if (toNumber(topK) < 1 || toNumber(topK) > 10) errors.topK = "Top K nên nằm trong khoảng 1 đến 10.";
  return errors;
}

export function MealSuggestionsPage() {
  const auth = authService.current();
  const pantryItems = useMemo(() => ingredientService.all(auth.id), [auth.id]);
  const [search, setSearch] = useState(defaultSearch);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [usesFallbackSearch, setUsesFallbackSearch] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [topK, setTopK] = useState(5);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiMeta, setApiMeta] = useState(null);
  const toast = useToast();
  const selectedIds = useMemo(() => new Set(selectedIngredients.map((item) => item.ingredientId)), [selectedIngredients]);

  useEffect(() => {
    const keyword = search.trim();
    if (!keyword) {
      setSearchResults([]);
      setSearchMessage("");
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await ingredientService.searchSystem(keyword, { pageIndex: 1, pageSize: 10 });
        setSearchResults(response.items);
        setSearchMessage(response.items.length ? "" : "Không tìm thấy nguyên liệu phù hợp. Bạn có thể thử từ khóa khác.");
        setUsesFallbackSearch(response.fromFallback);
      } catch (error) {
        setSearchResults([]);
        setSearchMessage(error.message || "Không thể tìm nguyên liệu.");
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  const addIngredient = (ingredient) => {
    setErrors({});
    if (selectedIngredients.some((item) => item.ingredientId === ingredient.id)) {
      toast.show("Nguyên liệu này đã được chọn.", "error");
      return;
    }
    setSelectedIngredients((current) => [
      ...current,
      {
        ingredientId: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        isFallback: Boolean(ingredient.isFallback),
        quantity: 1,
        unit: ingredient.defaultUnit || "g"
      }
    ]);
  };

  const updateSelected = (ingredientId, field, value) => {
    setSelectedIngredients((current) =>
      current.map((item) => (item.ingredientId === ingredientId ? { ...item, [field]: value } : item))
    );
    setErrors((current) => ({ ...current, [`${field}-${ingredientId}`]: "", form: "" }));
  };

  const removeSelected = (ingredientId) => {
    setSelectedIngredients((current) => current.filter((item) => item.ingredientId !== ingredientId));
  };

  const submit = async () => {
    const nextErrors = validate(selectedIngredients, topK, pantryItems.length);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    setApiMeta(null);
    try {
      const response = await recommendationService.recommendMeals(
        {
          inputIngredientText: selectedIngredients.map((item) => item.ingredientId).join(", "),
          ingredients: selectedIngredients.map((item) => item.name),
          selectedIngredients,
          candidateRecipes: [],
          topK
        },
        pantryItems
      );
      setSuggestions(response.recommendations);
      setApiMeta(response);
      toast.show(response.fromFallback ? "Đang hiển thị gợi ý mẫu khi API chưa sẵn sàng." : "Đã tạo gợi ý món ăn.");
    } catch (error) {
      setSuggestions([]);
      setApiMeta({ success: false, message: error.message, errors: [{ field: "recommendation", message: error.message }] });
      toast.show(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addToMealPlan = (recipe) => {
    mealPlanService.save({
      userId: auth.id,
      date: new Date().toISOString().slice(0, 10),
      day: "Thứ Hai",
      slot: recipe.type || "Bữa ăn",
      name: recipe.name,
      ingredients: [...(recipe.matchedIngredients || []), ...(recipe.missingIngredients || [])],
      completed: false
    });
    toast.show("Đã thêm vào lịch bữa ăn.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Gợi ý thông minh"
        title="Gợi ý món theo nguyên liệu"
        description="Tìm nguyên liệu trong hệ thống, nhập định lượng rồi gửi danh sách đã chọn để backend resolve dữ liệu và tạo gợi ý món phù hợp."
        action={
          <button
            onClick={submit}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-200 disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Gợi ý món
          </button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <div className="grid content-start gap-5">
          <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-2xl font-black">Chọn nguyên liệu</h3>
                <p className="mt-1 text-sm text-slate-500">Frontend chỉ gửi ingredientId, quantity và unit cho backend.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{pantryItems.length} pantry</span>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className={`${inputClass} pl-11`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm nguyên liệu, ví dụ: trứng, cà chua..."
              />
              {isSearching ? <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-orange-500" size={18} /> : null}
            </div>

            {selectedIngredients.length ? (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Đã chọn {selectedIngredients.length} nguyên liệu</p>
                  <button type="button" onClick={() => setSelectedIngredients([])} className="text-xs font-black text-emerald-700">Xóa tất cả</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map((item) => (
                    <span key={item.ingredientId} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-800 shadow-sm">
                      {item.name}
                      <span className="text-slate-500">{item.quantity} {item.unit}</span>
                      <button type="button" onClick={() => removeSelected(item.ingredientId)} className="rounded-full bg-slate-100 p-1 text-slate-500" aria-label={`Bỏ ${item.name}`}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {usesFallbackSearch ? (
              <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
                Backend chưa phản hồi, đang dùng dữ liệu mẫu để bạn kiểm tra flow UI.
              </p>
            ) : null}

            <div className="mt-4 grid gap-2">
              {searchResults.map((ingredient) => {
                const isSelected = selectedIds.has(ingredient.id);
                return (
                  <button
                    type="button"
                    key={ingredient.id}
                    onClick={() => addIngredient(ingredient)}
                    className={`grid gap-2 rounded-2xl border p-3 text-left transition sm:grid-cols-[1fr_auto] sm:items-center ${
                      isSelected
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-100 bg-slate-50 hover:border-orange-200 hover:bg-orange-50"
                    }`}
                  >
                    <span>
                      <strong className="block text-sm text-slate-900">{ingredient.name}</strong>
                      <span className="text-xs font-semibold text-slate-500">{ingredient.category || "Khác"} · mặc định {ingredient.defaultUnit || "g"}</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-black ${isSelected ? "text-emerald-700" : "text-orange-600"}`}>
                      {isSelected ? <Check size={14} /> : <Plus size={14} />}
                      {isSelected ? "Đã chọn" : "Chọn"}
                    </span>
                  </button>
                );
              })}
              {searchMessage ? <div className="rounded-2xl border border-dashed border-orange-200 p-4 text-sm font-bold text-slate-500">{searchMessage}</div> : null}
            </div>
          </div>

          <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-2xl font-black">Nguyên liệu gửi API</h3>
                <p className="mt-1 text-sm text-slate-500">API nhận ID trong inputIngredientText và tên nguyên liệu trong ingredients.</p>
              </div>
              <Field label="Top K" error={errors.topK}>
                <input className="w-24 rounded-2xl border border-orange-100 px-3 py-2 text-sm font-bold outline-none focus:border-orange-400" type="number" min="1" max="10" value={topK} onChange={(event) => setTopK(event.target.value)} />
              </Field>
            </div>

            {errors.form ? (
              <div className="mb-3 flex gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                <AlertCircle size={18} /> {errors.form}
              </div>
            ) : null}

            <div className="grid gap-3">
              {selectedIngredients.map((item) => (
                <div key={item.ingredientId} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <strong className="block">{item.name}</strong>
                      <span className="text-xs font-semibold text-slate-500">{item.category || "Nguyên liệu hệ thống"}</span>
                    </div>
                    <button type="button" onClick={() => removeSelected(item.ingredientId)} className="rounded-xl bg-white p-2 text-slate-500" aria-label={`Bỏ ${item.name}`}>
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field label="Số lượng" error={errors[`quantity-${item.ingredientId}`]}>
                      <input className={inputClass} type="number" min="0.1" step="0.1" value={item.quantity} onChange={(event) => updateSelected(item.ingredientId, "quantity", event.target.value)} />
                    </Field>
                    <Field label="Đơn vị" error={errors[`unit-${item.ingredientId}`]}>
                      <input className={inputClass} value={item.unit} onChange={(event) => updateSelected(item.ingredientId, "unit", event.target.value)} />
                    </Field>
                  </div>
                </div>
              ))}

              {!selectedIngredients.length ? (
                <div className="rounded-2xl border border-dashed border-orange-200 p-5 text-center text-sm font-bold text-slate-500">
                  Chưa chọn nguyên liệu. Nếu tủ bếp đã có item, bạn vẫn có thể bấm gợi ý để backend tự gộp pantry.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid content-start gap-4">
          {apiMeta?.success === false ? (
            <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 text-red-700">
              <div className="flex items-center gap-2 font-black"><AlertCircle size={18} /> Không thể tạo gợi ý</div>
              <p className="mt-2 text-sm font-semibold">{apiMeta.message}</p>
            </div>
          ) : null}

          {apiMeta?.fromFallback ? (
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-800">
              API recommendation chưa phản hồi nên UI đang hiển thị kết quả mẫu. Khi backend sẵn sàng, payload sẽ gửi ID trong inputIngredientText và tên trong ingredients.
            </div>
          ) : null}

          {!apiMeta && !suggestions.length ? (
            <div className="grid min-h-80 place-items-center rounded-[28px] border border-dashed border-orange-200 bg-white p-8 text-center">
              <div>
                <Sparkles className="mx-auto mb-3 text-orange-500" size={34} />
                <h3 className="font-heading text-2xl font-black">Sẵn sàng tạo gợi ý</h3>
                <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">Chọn nguyên liệu và nhập định lượng để xem món phù hợp, nguyên liệu đã match và phần còn thiếu.</p>
              </div>
            </div>
          ) : null}

          {apiMeta && suggestions.length === 0 && apiMeta.success !== false ? (
            <div className="rounded-[28px] border border-dashed border-orange-200 bg-white p-10 text-center">
              <h3 className="font-heading text-2xl font-black">Chưa có món nào match</h3>
              <p className="mt-2 text-sm font-semibold text-slate-500">Backend đã trả kết quả nhưng không có món nào có matchScore lớn hơn 0.</p>
            </div>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2">
            {suggestions.map((recipe) => {
              const hasLocalDetail = Boolean(recipeService.get(recipe.recipeId));
              return (
                <article key={recipe.recipeId} className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="h-28 bg-[linear-gradient(135deg,rgba(249,115,22,.88),rgba(22,163,74,.72)),url('https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-xl font-black">{recipe.name}</h3>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">#{recipe.rank} · {scoreLabel(recipe.score)}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{recipe.description}</p>
                    {recipe.tags?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
                        {recipe.tags.map((tag) => <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{tag}</span>)}
                      </div>
                    ) : null}
                    <div className="mt-4 grid gap-2 text-sm">
                      <p><strong className="text-emerald-700">Đã có:</strong> {displayList(recipe.matchedIngredients, "Backend chưa trả danh sách match")}</p>
                      <p className="text-slate-600"><strong className="text-red-600">Còn thiếu:</strong> {displayList(recipe.missingIngredients, "Không thiếu gì")}</p>
                      {recipe.reason ? <p className="text-xs font-semibold text-slate-500">{recipe.reason}</p> : null}
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button onClick={() => addToMealPlan(recipe)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">
                        <CalendarPlus size={17} /> Thêm
                      </button>
                      {hasLocalDetail ? (
                        <Link to={`/suggestions/${recipe.recipeId}`} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black">
                          <Eye size={17} /> Chi tiết
                        </Link>
                      ) : (
                        <button onClick={() => toast.show("Chi tiết công thức sẽ mở khi backend recipe detail API sẵn sàng.")} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black">
                          <Eye size={17} /> Tóm tắt
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </>
  );
}
