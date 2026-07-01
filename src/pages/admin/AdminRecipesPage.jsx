import { Clock, Edit3, ImageOff, Loader2, Plus, RefreshCcw, Search, Trash2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Field, PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { adminApiService } from "../../services/adminApiService";

const emptyForm = {
  id: "",
  name: "",
  description: "",
  cookingTimeMinutes: "",
  difficulty: "Easy",
  servingSize: 1,
  instructionText: "",
  imageUrl: "",
  sourceType: "Manual",
  ingredients: []
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Vui lòng nhập tên công thức.";
  if (!form.description.trim()) errors.description = "Vui lòng nhập mô tả.";
  if (!form.difficulty.trim()) errors.difficulty = "Vui lòng nhập độ khó.";
  if (!form.instructionText.trim()) errors.instructionText = "Vui lòng nhập hướng dẫn nấu.";
  if (!Number.isFinite(Number(form.cookingTimeMinutes)) || Number(form.cookingTimeMinutes) <= 0) {
    errors.cookingTimeMinutes = "Thời gian nấu phải lớn hơn 0.";
  }
  if (!Number.isFinite(Number(form.servingSize)) || Number(form.servingSize) <= 0) {
    errors.servingSize = "Khẩu phần phải lớn hơn 0.";
  }
  if (form.imageUrl && !/^https?:\/\//i.test(form.imageUrl)) errors.imageUrl = "Ảnh nên là URL http/https.";
  return errors;
}

function toForm(recipe) {
  return {
    id: recipe.id || "",
    name: recipe.name || "",
    description: recipe.description || "",
    cookingTimeMinutes: recipe.cookingTimeMinutes ?? "",
    difficulty: recipe.difficulty || "Easy",
    servingSize: recipe.servingSize ?? 1,
    instructionText: recipe.instructionText || "",
    imageUrl: recipe.imageUrl || "",
    sourceType: recipe.sourceType || "Manual",
    ingredients: []
  };
}

export function AdminRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10, totalPages: 1, totalItems: 0 });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const toast = useToast();

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return recipes;
    return recipes.filter((recipe) => `${recipe.name} ${recipe.description} ${recipe.difficulty}`.toLowerCase().includes(keyword));
  }, [recipes, query]);

  const load = async (pageIndex = pagination.pageIndex) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const [result, ingredientPage] = await Promise.all([
        adminApiService.listRecipes({ pageIndex, pageSize: pagination.pageSize }),
        adminApiService.listIngredients({ pageIndex: 1, pageSize: 100 })
      ]);
      setRecipes(result.items);
      setIngredients(ingredientPage.items);
      setPagination(result);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const addIngredientRow = () => {
    setForm((current) => ({
      ...current,
      ingredients: [
        ...(current.ingredients || []),
        {
          ingredientId: ingredients[0]?.id || "",
          quantity: 1,
          unit: ingredients[0]?.unit || "100g",
          isRequired: true,
          note: ""
        }
      ]
    }));
  };

  const updateIngredientRow = (index, field, value) => {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.map((item, currentIndex) => {
        if (currentIndex !== index) return item;
        const selected = field === "ingredientId" ? ingredients.find((ingredient) => ingredient.id === value) : null;
        return {
          ...item,
          [field]: value,
          ...(selected ? { unit: selected.unit || item.unit } : {})
        };
      })
    }));
  };

  const removeIngredientRow = (index) => {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.filter((_, currentIndex) => currentIndex !== index)
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSaving(true);
    try {
      if (form.id) await adminApiService.updateRecipe(form.id, form);
      else await adminApiService.createRecipe(form);
      toast.show(form.id ? "Đã cập nhật công thức." : "Đã thêm công thức.");
      setForm(emptyForm);
      await load(form.id ? pagination.pageIndex : 1);
    } catch (error) {
      toast.show(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await adminApiService.uploadMedia(file);
      updateField("imageUrl", String(url || ""));
      toast.show("Đã upload ảnh.");
    } catch (error) {
      toast.show(error.message, "error");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const remove = async (recipe) => {
    if (!confirm(`Xóa công thức "${recipe.name}"?`)) return;
    try {
      await adminApiService.deleteRecipe(recipe.id);
      toast.show("Đã xóa công thức.");
      await load(pagination.pageIndex);
    } catch (error) {
      toast.show(error.message, "error");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="API /api/recipes"
        title="Quản lý công thức"
        description="Quản trị danh sách món ăn lấy từ backend, hỗ trợ tạo mới, chỉnh sửa và xóa công thức."
        action={
          <button onClick={() => load(pagination.pageIndex)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700">
            <RefreshCcw size={18} /> Làm mới
          </button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <form onSubmit={save} className="grid gap-4 rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-2xl font-black">{form.id ? "Cập nhật công thức" : "Thêm công thức"}</h3>
            {form.id ? (
              <button type="button" onClick={() => setForm(emptyForm)} className="rounded-xl bg-slate-100 p-2" aria-label="Hủy sửa">
                <X size={18} />
              </button>
            ) : null}
          </div>

          <Field label="Tên món" error={errors.name}>
            <input className={inputClass} value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </Field>

          <Field label="Mô tả" error={errors.description}>
            <textarea className={inputClass} rows={3} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Phút" error={errors.cookingTimeMinutes}>
              <input className={inputClass} type="number" min="1" step="1" value={form.cookingTimeMinutes} onChange={(event) => updateField("cookingTimeMinutes", event.target.value)} />
            </Field>
            <Field label="Độ khó" error={errors.difficulty}>
              <select className={inputClass} value={form.difficulty} onChange={(event) => updateField("difficulty", event.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </Field>
            <Field label="Khẩu phần" error={errors.servingSize}>
              <input className={inputClass} type="number" min="1" step="1" value={form.servingSize} onChange={(event) => updateField("servingSize", event.target.value)} />
            </Field>
          </div>

          <Field label="Hướng dẫn nấu" error={errors.instructionText}>
            <textarea className={inputClass} rows={5} value={form.instructionText} onChange={(event) => updateField("instructionText", event.target.value)} />
          </Field>

          <div className="grid gap-3 rounded-2xl border border-orange-100 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-slate-700">Nguyên liệu trong công thức</p>
              <button type="button" onClick={addIngredientRow} className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-black text-orange-700">Thêm dòng</button>
            </div>
            {form.ingredients.length === 0 ? <p className="text-sm text-slate-500">Chưa chọn nguyên liệu. Backend vẫn có thể nhận công thức không kèm ingredients.</p> : null}
            {form.ingredients.map((item, index) => (
              <div key={index} className="grid gap-2 rounded-2xl bg-slate-50 p-3">
                <select className={inputClass} value={item.ingredientId} onChange={(event) => updateIngredientRow(index, "ingredientId", event.target.value)}>
                  <option value="">Chọn nguyên liệu</option>
                  {ingredients.map((ingredient) => <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>)}
                </select>
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input className={inputClass} type="number" min="0" step="0.1" value={item.quantity} onChange={(event) => updateIngredientRow(index, "quantity", event.target.value)} />
                  <input className={inputClass} value={item.unit} onChange={(event) => updateIngredientRow(index, "unit", event.target.value)} />
                  <label className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-bold">
                    <input type="checkbox" checked={item.isRequired} onChange={(event) => updateIngredientRow(index, "isRequired", event.target.checked)} />
                    Bắt buộc
                  </label>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input className={inputClass} placeholder="Ghi chú" value={item.note} onChange={(event) => updateIngredientRow(index, "note", event.target.value)} />
                  <button type="button" onClick={() => removeIngredientRow(index)} className="rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-600">Xóa</button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
            <Field label="Image URL" error={errors.imageUrl}>
              <input className={inputClass} value={form.imageUrl} onChange={(event) => updateField("imageUrl", event.target.value)} />
            </Field>
            <Field label="Nguồn">
              <input className={inputClass} value={form.sourceType} onChange={(event) => updateField("sourceType", event.target.value)} />
            </Field>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-orange-200 px-4 py-3 text-sm font-black text-orange-700">
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {isUploading ? "Đang upload..." : "Upload ảnh công thức"}
            <input className="sr-only" type="file" accept="image/*" onChange={uploadImage} disabled={isUploading} />
          </label>

          <button disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-200 disabled:opacity-60">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            {form.id ? "Lưu cập nhật" : "Thêm công thức"}
          </button>
        </form>

        <div className="grid content-start gap-4">
          <div className="relative rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className={`${inputClass} pl-11`} placeholder="Tìm theo tên, mô tả, độ khó" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>

          {loadError ? (
            <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 font-bold text-red-700">{loadError}</div>
          ) : null}

          {isLoading ? (
            <div className="grid place-items-center rounded-[24px] border border-orange-100 bg-white p-10 text-slate-500">
              <Loader2 className="mb-3 animate-spin" /> Đang tải công thức...
            </div>
          ) : null}

          {!isLoading && filtered.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-orange-200 bg-white p-10 text-center font-bold text-slate-500">
              Chưa có công thức phù hợp.
            </div>
          ) : null}

          <div className="grid gap-3">
            {filtered.map((recipe) => (
              <article key={recipe.id} className="grid overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-sm md:grid-cols-[220px_1fr]">
                <div className="min-h-44 bg-orange-50">
                  {recipe.imageUrl ? <img className="h-full w-full object-cover" src={recipe.imageUrl} alt={recipe.name} loading="lazy" /> : <div className="grid h-full place-items-center text-orange-300"><ImageOff size={34} /></div>}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-xl font-black">{recipe.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{recipe.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setForm(toForm(recipe))} className="rounded-xl bg-slate-100 p-2" aria-label="Sửa công thức">
                        <Edit3 size={17} />
                      </button>
                      <button type="button" onClick={() => remove(recipe)} className="rounded-xl bg-red-50 p-2 text-red-600" aria-label="Xóa công thức">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-orange-700"><Clock size={14} />{recipe.cookingTimeMinutes ?? 0} phút</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{recipe.difficulty}</span>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">{recipe.servingSize ?? 0} khẩu phần</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{recipe.sourceType || "Manual"}</span>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm text-slate-500">{recipe.instructionText}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-white px-4 py-3 text-sm font-bold text-slate-600">
            <span>Trang {pagination.pageIndex}/{pagination.totalPages} · {pagination.totalItems} công thức</span>
            <div className="flex gap-2">
              <button disabled={!pagination.hasPreviousPage || isLoading} onClick={() => load(pagination.pageIndex - 1)} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-40">Trước</button>
              <button disabled={!pagination.hasNextPage || isLoading} onClick={() => load(pagination.pageIndex + 1)} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-40">Sau</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
