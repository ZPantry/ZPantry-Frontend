import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { adminCatalogService } from "../../services/adminCatalogService";

const allergens = ["PEANUT", "TREE_NUT", "MILK", "EGG", "SOY", "WHEAT", "GLUTEN", "FISH", "SHELLFISH", "MOLLUSCS", "SESAME"];
const emptyIngredient = {
  name: "", category: "Vegetable", unit: "g", caloriesPerUnit: 0, proteinPerUnit: 0,
  fatPerUnit: 0, carbPerUnit: 0, imageUrl: "", gradientFrom: "#F4A21C", gradientTo: "#39D98A", allergens: []
};
const emptyRecipe = {
  name: "", description: "", cookingTimeMinutes: 20, difficulty: "Easy", servingSize: 1,
  instructionText: "", imageUrl: "", sourceType: "Manual", gradientFrom: "#F4A21C",
  gradientTo: "#39D98A", allergens: [], ingredients: []
};

function Field({ label, children }) {
  return <label className="grid gap-1 text-sm font-bold text-slate-700">{label}{children}</label>;
}

export function AdminCatalogPage() {
  const [kind, setKind] = useState("ingredients");
  const [items, setItems] = useState({ ingredients: [], recipes: [] });
  const [form, setForm] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailAliases, setDetailAliases] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [aliases, setAliases] = useState([]);
  const [aliasDraft, setAliasDraft] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [ingredients, recipes] = await Promise.all([
        adminCatalogService.all("ingredients"), adminCatalogService.all("recipes")
      ]);
      setItems({ ingredients, recipes });
    } catch (cause) {
      setError(cause.response?.data?.message || cause.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const filtered = useMemo(() => items[kind].filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [items, kind, query]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const begin = (item) => {
    setDetail(null);
    const blank = kind === "ingredients" ? emptyIngredient : emptyRecipe;
    setForm(item ? { ...blank, ...item, allergens: item.allergens || [], ingredients: item.ingredients || [] } : { ...blank });
    setImageFile(null);
    setAliases([]);
    setAliasDraft("");
    if (kind === "ingredients" && item?.id) {
      adminCatalogService.aliases(item.id).then(setAliases).catch((cause) => setError(cause.response?.data?.message || cause.message));
    }
    setError("");
  };

  const viewIngredient = async (item) => {
    setDetailLoading(true);
    setDetail(null);
    setError("");
    try {
      const [ingredient, names] = await Promise.all([
        adminCatalogService.getIngredient(item.id), adminCatalogService.aliases(item.id)
      ]);
      setDetail(ingredient);
      setDetailAliases(names);
    } catch (cause) {
      setError(cause.response?.data?.message || cause.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return setError("Vui lòng nhập tên.");
    if (kind === "recipes" && form.ingredients.length === 0) return setError("Công thức cần ít nhất một nguyên liệu.");
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, name: form.name.trim() };
      delete payload.id;
      delete payload.normalizedName;
      if (imageFile) payload.imageUrl = await adminCatalogService.uploadImage(imageFile);
      const saved = await adminCatalogService.save(kind, form.id, payload);
      setItems((current) => ({ ...current, [kind]: form.id
        ? current[kind].map((item) => item.id === form.id ? saved : item)
        : [...current[kind], saved] }));
      setForm(null);
      toast.show("Đã lưu danh mục.");
    } catch (cause) {
      setError(cause.response?.data?.message || cause.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Xóa ${item.name}?`)) return;
    try {
      await adminCatalogService.remove(kind, item.id);
      setItems((current) => ({ ...current, [kind]: current[kind].filter((entry) => entry.id !== item.id) }));
      toast.show("Đã xóa khỏi danh mục.");
    } catch (cause) {
      setError(cause.response?.data?.message || cause.message);
    }
  };

  const toggleAllergen = (code) => update("allergens", form.allergens.includes(code)
    ? form.allergens.filter((item) => item !== code) : [...form.allergens, code]);

  const addRecipeIngredient = (id) => {
    const ingredient = items.ingredients.find((item) => item.id === id);
    if (!ingredient || form.ingredients.some((item) => item.ingredientId === id)) return;
    update("ingredients", [...form.ingredients, { ingredientId: id, ingredientName: ingredient.name,
      quantity: 1, unit: ingredient.unit || "g", isRequired: true, note: "" }]);
  };
  const editRecipeIngredient = (index, patch) => update("ingredients", form.ingredients.map((item, position) => position === index ? { ...item, ...patch } : item));

  const addAlias = async () => {
    if (!aliasDraft.trim() || !form.id) return;
    try {
      const created = await adminCatalogService.addAlias(form.id, aliasDraft.trim());
      setAliases((current) => [...current, created]);
      setAliasDraft("");
    } catch (cause) { setError(cause.response?.data?.message || cause.message); }
  };
  const removeAlias = async (aliasId) => {
    try {
      await adminCatalogService.removeAlias(form.id, aliasId);
      setAliases((current) => current.filter((item) => item.id !== aliasId));
    } catch (cause) { setError(cause.response?.data?.message || cause.message); }
  };

  return <>
    <PageHeader eyebrow="Quản trị danh mục" title="Nguyên liệu và công thức" description="Quản lý dữ liệu dùng chung qua Backend API." />
    <div className="mb-5 flex flex-wrap gap-2">
      {[{ id: "ingredients", label: "Nguyên liệu" }, { id: "recipes", label: "Công thức" }].map((tab) =>
        <button key={tab.id} type="button" onClick={() => { setKind(tab.id); setForm(null); setDetail(null); setError(""); }}
          className={`rounded-2xl px-5 py-3 font-bold ${kind === tab.id ? "bg-orange-500 text-white" : "bg-white text-slate-700"}`}>{tab.label} ({items[tab.id].length})</button>)}
    </div>
    {!loading && <p className="mb-4 text-sm font-bold text-slate-600">Tổng số {kind === "ingredients" ? "nguyên liệu" : "công thức"}: {items[kind].length}</p>}
    {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {detailLoading && <p>Đang tải chi tiết nguyên liệu...</p>}
    {detail && !form ? <section className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
      <h2 className="font-heading text-2xl font-black">{detail.name}</h2>
      <p className="mt-1 text-sm text-slate-500">{detail.category || "Khác"} · Đơn vị: {detail.unit || "Chưa có"}</p>
      {detail.imageUrl && <img src={detail.imageUrl} alt={detail.name} className="mt-4 h-40 w-full rounded-2xl object-contain" />}
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        {[["Năng lượng", detail.caloriesPerUnit, "kcal"], ["Protein", detail.proteinPerUnit, "g"],
          ["Chất béo", detail.fatPerUnit, "g"], ["Carb", detail.carbPerUnit, "g"]].map(([label, value, unit]) =>
          <div key={label} className="rounded-xl bg-orange-50 p-3"><dt className="text-slate-500">{label} / {detail.unit}</dt><dd className="font-black">{value ?? 0} {unit}</dd></div>)}
      </dl>
      <p className="mt-4 text-sm"><strong>Dị ứng:</strong> {detail.allergens?.length ? detail.allergens.join(", ") : "Không ghi nhận"}</p>
      <p className="mt-2 text-sm"><strong>Tên gọi khác:</strong> {detailAliases.length ? detailAliases.map((alias) => alias.aliasName).join(", ") : "Chưa có"}</p>
      <div className="mt-5 flex gap-2"><button type="button" onClick={() => begin(detail)} className="rounded-xl bg-slate-950 px-4 py-2 font-bold text-white">Sửa</button>
        <button type="button" onClick={() => setDetail(null)} className="rounded-xl border px-4 py-2 font-bold">Quay lại</button></div>
    </section> : form ? <form onSubmit={save} className="grid gap-4 rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-black">{form.id ? "Chỉnh sửa" : "Tạo mới"} {kind === "ingredients" ? "nguyên liệu" : "công thức"}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tên"><input required className={inputClass} value={form.name} onChange={(event) => update("name", event.target.value)} /></Field>
        <Field label="Ảnh (URL)"><input className={inputClass} type="url" value={form.imageUrl || ""} onChange={(event) => update("imageUrl", event.target.value)} /></Field>
        <Field label="Hoặc tải ảnh lên"><input className={inputClass} type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} /></Field>
        {kind === "ingredients" ? <>
          <Field label="Nhóm"><select className={inputClass} value={form.category} onChange={(event) => update("category", event.target.value)}>
            {["Vegetable", "Fruit", "Meat", "Seafood", "Dairy", "Grain", "Spice", "Other"].map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Đơn vị"><input required className={inputClass} value={form.unit} onChange={(event) => update("unit", event.target.value)} /></Field>
          {["caloriesPerUnit", "proteinPerUnit", "fatPerUnit", "carbPerUnit"].map((key) => <Field key={key} label={`${key} (mỗi đơn vị)`}>
            <input className={inputClass} type="number" min="0" step="any" value={form[key] ?? 0} onChange={(event) => update(key, Number(event.target.value))} /></Field>)}
        </> : <>
          <Field label="Thời gian nấu (phút)"><input className={inputClass} type="number" min="1" value={form.cookingTimeMinutes} onChange={(event) => update("cookingTimeMinutes", Number(event.target.value))} /></Field>
          <Field label="Khẩu phần"><input className={inputClass} type="number" min="1" value={form.servingSize} onChange={(event) => update("servingSize", Number(event.target.value))} /></Field>
          <Field label="Độ khó"><select className={inputClass} value={form.difficulty} onChange={(event) => update("difficulty", event.target.value)}>
            {["Easy", "Medium", "Hard"].map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Nguồn"><select className={inputClass} value={form.sourceType} onChange={(event) => update("sourceType", event.target.value)}>
            {["Manual", "AI", "Imported"].map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Mô tả"><textarea className={inputClass} value={form.description || ""} onChange={(event) => update("description", event.target.value)} /></Field>
          <Field label="Hướng dẫn"><textarea className={inputClass} value={form.instructionText || ""} onChange={(event) => update("instructionText", event.target.value)} /></Field>
        </>}
      </div>
      <fieldset><legend className="mb-2 text-sm font-bold">Dị ứng</legend><div className="flex flex-wrap gap-3">
        {allergens.map((code) => <label key={code} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={form.allergens.includes(code)} onChange={() => toggleAllergen(code)} />{code}</label>)}
      </div></fieldset>
      {kind === "ingredients" && form.id && <fieldset className="grid gap-2"><legend className="text-sm font-bold">Tên gọi khác</legend>
        <div className="flex flex-wrap gap-2"><input className={`${inputClass} max-w-sm`} value={aliasDraft} onChange={(event) => setAliasDraft(event.target.value)} placeholder="Nhập tên gọi khác" />
          <button type="button" onClick={addAlias} className="rounded-xl border px-4 py-2 font-bold">Thêm tên</button></div>
        <div className="flex flex-wrap gap-2">{aliases.map((alias) => <span key={alias.id} className="rounded-xl bg-orange-50 px-3 py-2 text-sm">{alias.aliasName} <button type="button" onClick={() => removeAlias(alias.id)} className="ml-2 font-bold text-red-600" aria-label={`Xóa tên ${alias.aliasName}`}>×</button></span>)}</div>
      </fieldset>}
      {kind === "recipes" && <fieldset className="grid gap-3"><legend className="text-sm font-bold">Nguyên liệu công thức</legend>
        <select className={inputClass} value="" onChange={(event) => addRecipeIngredient(event.target.value)}><option value="">Chọn nguyên liệu để thêm</option>
          {items.ingredients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        {form.ingredients.map((item, index) => <div key={item.ingredientId} className="grid items-center gap-2 rounded-xl bg-orange-50 p-3 md:grid-cols-[1fr_90px_90px_auto_auto]">
          <span className="font-bold">{items.ingredients.find((entry) => entry.id === item.ingredientId)?.name || item.ingredientName}</span>
          <input aria-label="Số lượng" className={inputClass} type="number" min="0.01" step="any" value={item.quantity} onChange={(event) => editRecipeIngredient(index, { quantity: Number(event.target.value) })} />
          <input aria-label="Đơn vị" className={inputClass} value={item.unit} onChange={(event) => editRecipeIngredient(index, { unit: event.target.value })} />
          <label className="text-sm"><input type="checkbox" checked={item.isRequired} onChange={(event) => editRecipeIngredient(index, { isRequired: event.target.checked })} /> Bắt buộc</label>
          <button type="button" className="font-bold text-red-600" onClick={() => update("ingredients", form.ingredients.filter((_, position) => position !== index))}>Bỏ</button>
        </div>)}
      </fieldset>}
      <div className="flex gap-2"><button disabled={saving} className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white disabled:opacity-50">{saving ? "Đang lưu..." : "Lưu"}</button>
        <button type="button" onClick={() => setForm(null)} className="rounded-xl border px-5 py-3 font-bold">Hủy</button></div>
    </form> : <>
      <div className="mb-4 flex flex-wrap gap-2"><input className={`${inputClass} max-w-md`} placeholder="Tìm theo tên" value={query} onChange={(event) => setQuery(event.target.value)} />
        <button onClick={() => begin(null)} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">Thêm mới</button></div>
      {loading ? <p>Đang tải danh mục...</p> : <div className="grid gap-3">
        {filtered.length === 0 && !error && <p>Chưa có dữ liệu.</p>}
        {filtered.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
          <div><h3 className="font-bold">{item.name}</h3><p className="text-sm text-slate-500">{kind === "ingredients" ? `${item.category || "Khác"} · ${item.unit || ""}` : `${item.cookingTimeMinutes || 0} phút · ${item.ingredients?.length || 0} nguyên liệu`}</p></div>
          <div className="flex gap-2">{kind === "ingredients" && <button onClick={() => viewIngredient(item)} className="rounded-xl border px-4 py-2 font-bold">Chi tiết</button>}
            <button onClick={() => begin(item)} className="rounded-xl border px-4 py-2 font-bold">Sửa</button>
            <button onClick={() => remove(item)} className="rounded-xl bg-red-50 px-4 py-2 font-bold text-red-600">Xóa</button></div>
        </article>)}
      </div>}
    </>}
  </>;
}
