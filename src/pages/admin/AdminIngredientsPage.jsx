import { Edit3, ImageOff, Loader2, Plus, RefreshCcw, Search, Trash2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Field, PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { adminApiService } from "../../services/adminApiService";

const emptyForm = {
  id: "",
  name: "",
  category: "Vegetable",
  unit: "100g",
  caloriesPerUnit: "",
  proteinPerUnit: "",
  fatPerUnit: "",
  carbPerUnit: "",
  imageUrl: ""
};

const categories = ["Vegetable", "Fruit", "Meat", "Fish", "Grain", "Protein", "Dairy", "Spice", "Other"];

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Vui lòng nhập tên nguyên liệu.";
  if (!form.category.trim()) errors.category = "Vui lòng nhập danh mục.";
  if (!form.unit.trim()) errors.unit = "Vui lòng nhập đơn vị.";
  ["caloriesPerUnit", "proteinPerUnit", "fatPerUnit", "carbPerUnit"].forEach((field) => {
    const value = Number(form[field]);
    if (form[field] === "") errors[field] = "Vui lòng nhập giá trị.";
    else if (!Number.isFinite(value) || value < 0) errors[field] = "Giá trị phải là số không âm.";
  });
  if (form.imageUrl && !/^https?:\/\//i.test(form.imageUrl)) errors.imageUrl = "Ảnh nên là URL http/https.";
  return errors;
}

function toForm(item) {
  return {
    id: item.id || "",
    name: item.name || "",
    category: item.category || "Other",
    unit: item.unit || "100g",
    caloriesPerUnit: item.caloriesPerUnit ?? "",
    proteinPerUnit: item.proteinPerUnit ?? "",
    fatPerUnit: item.fatPerUnit ?? "",
    carbPerUnit: item.carbPerUnit ?? "",
    imageUrl: item.imageUrl || ""
  };
}

export function AdminIngredientsPage() {
  const [items, setItems] = useState([]);
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
    if (!keyword) return items;
    return items.filter((item) => `${item.name} ${item.category} ${item.unit}`.toLowerCase().includes(keyword));
  }, [items, query]);

  const load = async (pageIndex = pagination.pageIndex) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const result = await adminApiService.listIngredients({ pageIndex, pageSize: pagination.pageSize });
      setItems(result.items);
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

  const save = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSaving(true);
    try {
      if (form.id) await adminApiService.updateIngredient(form.id, form);
      else await adminApiService.createIngredient(form);
      toast.show(form.id ? "Đã cập nhật nguyên liệu." : "Đã thêm nguyên liệu.");
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

  const remove = async (item) => {
    if (!confirm(`Xóa nguyên liệu "${item.name}"?`)) return;
    try {
      await adminApiService.deleteIngredient(item.id);
      toast.show("Đã xóa nguyên liệu.");
      await load(pagination.pageIndex);
    } catch (error) {
      toast.show(error.message, "error");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="API /api/ingredients"
        title="Quản lý nguyên liệu"
        description="Thêm, sửa, xóa và kiểm tra dữ liệu dinh dưỡng từ API backend dành cho admin."
        action={
          <button onClick={() => load(pagination.pageIndex)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700">
            <RefreshCcw size={18} /> Làm mới
          </button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={save} className="grid gap-4 rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-2xl font-black">{form.id ? "Cập nhật nguyên liệu" : "Thêm nguyên liệu"}</h3>
            {form.id ? (
              <button type="button" onClick={() => setForm(emptyForm)} className="rounded-xl bg-slate-100 p-2" aria-label="Hủy sửa">
                <X size={18} />
              </button>
            ) : null}
          </div>

          <Field label="Tên nguyên liệu" error={errors.name}>
            <input className={inputClass} value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Danh mục" error={errors.category}>
              <input className={inputClass} list="ingredient-categories" value={form.category} onChange={(event) => updateField("category", event.target.value)} />
              <datalist id="ingredient-categories">
                {categories.map((category) => <option key={category} value={category} />)}
              </datalist>
            </Field>
            <Field label="Đơn vị" error={errors.unit}>
              <input className={inputClass} value={form.unit} onChange={(event) => updateField("unit", event.target.value)} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Calories / đơn vị" error={errors.caloriesPerUnit}>
              <input className={inputClass} type="number" min="0" step="0.1" value={form.caloriesPerUnit} onChange={(event) => updateField("caloriesPerUnit", event.target.value)} />
            </Field>
            <Field label="Protein" error={errors.proteinPerUnit}>
              <input className={inputClass} type="number" min="0" step="0.1" value={form.proteinPerUnit} onChange={(event) => updateField("proteinPerUnit", event.target.value)} />
            </Field>
            <Field label="Fat" error={errors.fatPerUnit}>
              <input className={inputClass} type="number" min="0" step="0.1" value={form.fatPerUnit} onChange={(event) => updateField("fatPerUnit", event.target.value)} />
            </Field>
            <Field label="Carb" error={errors.carbPerUnit}>
              <input className={inputClass} type="number" min="0" step="0.1" value={form.carbPerUnit} onChange={(event) => updateField("carbPerUnit", event.target.value)} />
            </Field>
          </div>

          <Field label="Image URL" error={errors.imageUrl}>
            <input className={inputClass} value={form.imageUrl} onChange={(event) => updateField("imageUrl", event.target.value)} />
          </Field>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-orange-200 px-4 py-3 text-sm font-black text-orange-700">
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {isUploading ? "Đang upload..." : "Upload ảnh nguyên liệu"}
            <input className="sr-only" type="file" accept="image/*" onChange={uploadImage} disabled={isUploading} />
          </label>

          <button disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-200 disabled:opacity-60">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            {form.id ? "Lưu cập nhật" : "Thêm nguyên liệu"}
          </button>
        </form>

        <div className="grid content-start gap-4">
          <div className="relative rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className={`${inputClass} pl-11`} placeholder="Tìm theo tên, danh mục, đơn vị" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>

          {loadError ? (
            <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 font-bold text-red-700">{loadError}</div>
          ) : null}

          {isLoading ? (
            <div className="grid place-items-center rounded-[24px] border border-orange-100 bg-white p-10 text-slate-500">
              <Loader2 className="mb-3 animate-spin" /> Đang tải nguyên liệu...
            </div>
          ) : null}

          {!isLoading && filtered.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-orange-200 bg-white p-10 text-center font-bold text-slate-500">
              Chưa có nguyên liệu phù hợp.
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-sm">
                <div className="aspect-[16/9] bg-orange-50">
                  {item.imageUrl ? <img className="h-full w-full object-cover" src={item.imageUrl} alt={item.name} loading="lazy" /> : <div className="grid h-full place-items-center text-orange-300"><ImageOff size={34} /></div>}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-xl font-black">{item.name}</h3>
                      <p className="text-sm font-bold text-orange-600">{item.category} · {item.unit}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setForm(toForm(item))} className="rounded-xl bg-slate-100 p-2" aria-label="Sửa nguyên liệu">
                        <Edit3 size={17} />
                      </button>
                      <button type="button" onClick={() => remove(item)} className="rounded-xl bg-red-50 p-2 text-red-600" aria-label="Xóa nguyên liệu">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-black">
                    <span className="rounded-xl bg-slate-50 p-2">{item.caloriesPerUnit ?? 0}<br />kcal</span>
                    <span className="rounded-xl bg-emerald-50 p-2">{item.proteinPerUnit ?? 0}<br />protein</span>
                    <span className="rounded-xl bg-sky-50 p-2">{item.fatPerUnit ?? 0}<br />fat</span>
                    <span className="rounded-xl bg-amber-50 p-2">{item.carbPerUnit ?? 0}<br />carb</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-white px-4 py-3 text-sm font-bold text-slate-600">
            <span>Trang {pagination.pageIndex}/{pagination.totalPages} · {pagination.totalItems} nguyên liệu</span>
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
