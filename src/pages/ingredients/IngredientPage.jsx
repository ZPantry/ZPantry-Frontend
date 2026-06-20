import { Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Field, PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { categories, ingredientService, storageLocations, units } from "../../services/ingredientService";
import { validateIngredientForm } from "../../utils/validation";

const shelfLifeOptions = [
  { value: "1", label: "1 ngày", days: 1 },
  { value: "2", label: "2 ngày", days: 2 },
  { value: "3", label: "3 ngày", days: 3 },
  { value: "4", label: "4 ngày", days: 4 },
  { value: "10", label: "Hơn một tuần", days: 10 }
];

const empty = {
  name: "",
  category: "Rau củ",
  quantity: "",
  unit: "gram",
  shelfLife: "",
  expirationDate: "",
  storage: "Tủ lạnh",
  note: ""
};

function addDays(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + Number(days));
  return date.toISOString().slice(0, 10);
}

function daysUntil(date) {
  if (!date) return null;
  const today = new Date();
  const target = new Date(`${date}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

function shelfLifeFromDate(date) {
  const diff = daysUntil(date);
  if (diff === null) return "";
  if ([1, 2, 3, 4].includes(diff)) return String(diff);
  if (diff > 7) return "10";
  return "";
}

function normalizeItemForEdit(item) {
  return {
    ...empty,
    ...item,
    shelfLife: item.shelfLife || shelfLifeFromDate(item.expirationDate)
  };
}

export function IngredientPage() {
  const auth = authService.current();
  const [items, setItems] = useState(ingredientService.all(auth.id));
  const [form, setForm] = useState(empty);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) &&
          (category === "all" || item.category === category)
      ),
    [items, query, category]
  );

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const updateShelfLife = (value) => {
    const option = shelfLifeOptions.find((item) => item.value === value);
    setForm((current) => ({
      ...current,
      shelfLife: value,
      expirationDate: option ? addDays(option.days) : ""
    }));
    setErrors((current) => ({ ...current, shelfLife: "" }));
  };

  const save = (event) => {
    event.preventDefault();
    const nextErrors = validateIngredientForm(form, {
      categories,
      units,
      storageLocations,
      shelfLifeValues: shelfLifeOptions.map((option) => option.value)
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      quantity: String(Number(form.quantity)),
      note: form.note.trim(),
      userId: auth.id
    };

    setItems(ingredientService.save(payload));
    setForm(empty);
    setErrors({});
    toast.show(form.id ? "Đã cập nhật nguyên liệu." : "Đã thêm nguyên liệu.");
  };

  const remove = (id) => {
    if (!confirm("Bạn muốn xóa nguyên liệu này?")) return;
    setItems(ingredientService.remove(id, auth.id));
    toast.show("Đã xóa nguyên liệu.");
  };

  const isNear = (date) => {
    const diff = daysUntil(date);
    return diff !== null && diff <= 3;
  };

  return (
    <>
      <PageHeader
        eyebrow="Tủ bếp"
        title="Quản lý nguyên liệu"
        description="Theo dõi nguyên liệu đang có, nơi lưu trữ và món nào cần dùng sớm."
      />
      <section className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <form onSubmit={save} className="grid gap-4 rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-2xl font-black">{form.id ? "Cập nhật nguyên liệu" : "Thêm nguyên liệu"}</h3>

          <Field label="Tên nguyên liệu" error={errors.name}>
            <input className={inputClass} value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Danh mục" error={errors.category}>
              <select className={inputClass} value={form.category} onChange={(event) => updateField("category", event.target.value)}>
                {categories.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>

            <Field label="Nơi lưu trữ" error={errors.storage}>
              <select className={inputClass} value={form.storage} onChange={(event) => updateField("storage", event.target.value)}>
                {storageLocations.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>

            <Field label="Số lượng" error={errors.quantity}>
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={form.quantity}
                onChange={(event) => updateField("quantity", event.target.value)}
              />
            </Field>

            <Field label="Đơn vị" error={errors.unit}>
              <select className={inputClass} value={form.unit} onChange={(event) => updateField("unit", event.target.value)}>
                {units.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Hạn dùng" error={errors.shelfLife}>
            <select className={inputClass} value={form.shelfLife} onChange={(event) => updateShelfLife(event.target.value)}>
              <option value="">Chọn hạn dùng</option>
              {shelfLifeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          {form.expirationDate ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              Ngày hết hạn dự kiến: {form.expirationDate}
            </p>
          ) : null}

          <Field label="Ghi chú" error={errors.note}>
            <textarea className={inputClass} value={form.note} onChange={(event) => updateField("note", event.target.value)} />
          </Field>

          <button className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-200">
            {form.id ? "Lưu cập nhật" : "Thêm nguyên liệu"}
          </button>
        </form>

        <div>
          <div className="mb-4 grid gap-3 rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className={`${inputClass} pl-11`}
                placeholder="Tìm nguyên liệu"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">Tất cả danh mục</option>
              {categories.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-3">
            {filtered.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-orange-200 bg-white p-8 text-center font-bold text-slate-500">
                Chưa có nguyên liệu. Hãy thêm món đầu tiên.
              </div>
            ) : null}

            {filtered.map((item) => (
              <article key={item.id} className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-xl font-black">{item.name}</h3>
                    <p className="text-sm text-slate-600">
                      {item.quantity} {item.unit} • {item.storage}
                    </p>
                  </div>
                  {isNear(item.expirationDate) ? (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">Sắp hết hạn</span>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    {item.category} • {item.expirationDate}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForm(normalizeItemForEdit(item));
                        setErrors({});
                      }}
                      className="rounded-xl bg-slate-100 p-2"
                      aria-label="Sửa nguyên liệu"
                    >
                      <Pencil size={18} />
                    </button>
                    <button type="button" onClick={() => remove(item.id)} className="rounded-xl bg-red-50 p-2 text-red-600" aria-label="Xóa nguyên liệu">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
