import { Edit3, Loader2, Plus, RefreshCcw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Field, PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { adminApiService } from "../../services/adminApiService";

const defaultUserId = "39c76c73-7b0b-44dc-9341-6e959470a5ec";

const emptyForm = {
  id: "",
  ingredientId: "",
  quantity: "",
  unit: "g",
  expiredAt: "",
  storageLocation: "",
  note: ""
};

function toDateInput(value) {
  return value ? value.slice(0, 10) : "";
}

function toPayload(form) {
  return {
    ...form,
    expiredAt: form.expiredAt ? `${form.expiredAt}T00:00:00.000Z` : null
  };
}

function validate(form) {
  const errors = {};
  if (!form.ingredientId) errors.ingredientId = "Vui lòng chọn nguyên liệu.";
  if (!Number.isFinite(Number(form.quantity)) || Number(form.quantity) <= 0) errors.quantity = "Số lượng phải lớn hơn 0.";
  if (!form.unit.trim()) errors.unit = "Vui lòng nhập đơn vị.";
  if (!form.expiredAt) errors.expiredAt = "Vui lòng chọn hạn dùng.";
  if (!form.storageLocation.trim()) errors.storageLocation = "Vui lòng nhập nơi lưu trữ.";
  return errors;
}

export function AdminPantryPage() {
  const [userId, setUserId] = useState(defaultUserId);
  const [ingredients, setIngredients] = useState([]);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10, totalPages: 1, totalItems: 0 });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const toast = useToast();

  const load = async (pageIndex = pagination.pageIndex, nextUserId = userId) => {
    if (!nextUserId.trim()) {
      setLoadError("Vui lòng nhập userId.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");
    try {
      const [pantryPage, ingredientPage] = await Promise.all([
        adminApiService.listUserPantry(nextUserId.trim(), { pageIndex, pageSize: pagination.pageSize }),
        adminApiService.listIngredients({ pageIndex: 1, pageSize: 100 })
      ]);
      setItems(pantryPage.items);
      setPagination(pantryPage);
      setIngredients(ingredientPage.items);
      setForm((current) => ({ ...current, ingredientId: current.ingredientId || ingredientPage.items[0]?.id || "" }));
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(1, defaultUserId);
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
      if (form.id) await adminApiService.updatePantryItem(userId.trim(), form.id, toPayload(form));
      else await adminApiService.createPantryItem(userId.trim(), toPayload(form));
      toast.show(form.id ? "Đã cập nhật tủ bếp." : "Đã thêm vào tủ bếp.");
      setForm({ ...emptyForm, ingredientId: ingredients[0]?.id || "" });
      await load(form.id ? pagination.pageIndex : 1);
    } catch (error) {
      toast.show(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const edit = (item) => {
    setForm({
      id: item.id,
      ingredientId: item.ingredientId || "",
      quantity: item.quantity ?? "",
      unit: item.unit || "",
      expiredAt: toDateInput(item.expiredAt),
      storageLocation: item.storageLocation || "",
      note: item.note || ""
    });
    setErrors({});
  };

  const remove = async (item) => {
    if (!confirm("Xóa nguyên liệu này khỏi tủ bếp?")) return;
    try {
      await adminApiService.deletePantryItem(userId.trim(), item.id);
      toast.show("Đã xóa khỏi tủ bếp.");
      await load(pagination.pageIndex);
    } catch (error) {
      toast.show(error.message, "error");
    }
  };

  const ingredientName = (id) => ingredients.find((item) => item.id === id)?.name || id;

  return (
    <>
      <PageHeader
        eyebrow="API /api/users/{userId}/pantry"
        title="Quản lý tủ bếp người dùng"
        description="Admin kiểm tra, thêm, sửa, xóa pantry item theo userId."
        action={
          <button onClick={() => load(1)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700">
            <RefreshCcw size={18} /> Làm mới
          </button>
        }
      />

      <div className="mb-5 grid gap-3 rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
        <input className={inputClass} value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="Nhập userId" />
        <button onClick={() => load(1)} className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white">Tải tủ bếp</button>
      </div>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={save} className="grid content-start gap-4 rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-2xl font-black">{form.id ? "Cập nhật item" : "Thêm pantry item"}</h3>
            {form.id ? <button type="button" onClick={() => setForm({ ...emptyForm, ingredientId: ingredients[0]?.id || "" })} className="rounded-xl bg-slate-100 p-2" aria-label="Hủy sửa"><X size={18} /></button> : null}
          </div>
          <Field label="Nguyên liệu" error={errors.ingredientId}>
            <select className={inputClass} value={form.ingredientId} onChange={(event) => updateField("ingredientId", event.target.value)}>
              <option value="">Chọn nguyên liệu</option>
              {ingredients.map((ingredient) => <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>)}
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Số lượng" error={errors.quantity}>
              <input className={inputClass} type="number" min="0" step="0.1" value={form.quantity} onChange={(event) => updateField("quantity", event.target.value)} />
            </Field>
            <Field label="Đơn vị" error={errors.unit}>
              <input className={inputClass} value={form.unit} onChange={(event) => updateField("unit", event.target.value)} />
            </Field>
          </div>
          <Field label="Hạn dùng" error={errors.expiredAt}>
            <input className={inputClass} type="date" value={form.expiredAt} onChange={(event) => updateField("expiredAt", event.target.value)} />
          </Field>
          <Field label="Nơi lưu trữ" error={errors.storageLocation}>
            <input className={inputClass} value={form.storageLocation} onChange={(event) => updateField("storageLocation", event.target.value)} />
          </Field>
          <Field label="Ghi chú">
            <textarea className={inputClass} rows={3} value={form.note} onChange={(event) => updateField("note", event.target.value)} />
          </Field>
          <button disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white disabled:opacity-60">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            {form.id ? "Lưu cập nhật" : "Thêm vào tủ bếp"}
          </button>
        </form>

        <div className="grid content-start gap-3">
          {loadError ? <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 font-bold text-red-700">{loadError}</div> : null}
          {isLoading ? <div className="grid place-items-center rounded-[24px] border border-orange-100 bg-white p-10 text-slate-500"><Loader2 className="mb-3 animate-spin" /> Đang tải tủ bếp...</div> : null}
          {!isLoading && items.length === 0 ? <div className="rounded-[24px] border border-dashed border-orange-200 bg-white p-10 text-center font-bold text-slate-500">Tủ bếp chưa có item.</div> : null}
          {items.map((item) => (
            <article key={item.id} className="grid gap-3 rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="font-heading text-xl font-black">{ingredientName(item.ingredientId)}</h3>
                <p className="text-sm text-slate-600">{item.quantity} {item.unit} · {item.storageLocation}</p>
                <p className="mt-2 text-sm text-slate-500">Hạn dùng: {toDateInput(item.expiredAt)} · {item.note || "Không có ghi chú"}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => edit(item)} className="rounded-xl bg-slate-100 p-2" aria-label="Sửa pantry item"><Edit3 size={17} /></button>
                <button type="button" onClick={() => remove(item)} className="rounded-xl bg-red-50 p-2 text-red-600" aria-label="Xóa pantry item"><Trash2 size={17} /></button>
              </div>
            </article>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-white px-4 py-3 text-sm font-bold text-slate-600">
            <span>Trang {pagination.pageIndex}/{pagination.totalPages} · {pagination.totalItems} item</span>
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
