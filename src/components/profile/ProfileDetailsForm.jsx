import { Check, Upload, UserRound } from "lucide-react";
import { useState } from "react";
import {
  allergyOptions,
  avatarLibrary,
  cookingSkillOptions,
  dietOptions,
  genderOptions,
  goalOptions
} from "../../data/profileOptions";
import { calculateAge, validateProfileForm } from "../../utils/validation";
import { Field, inputClass } from "../ui/Fields";

const defaultProfile = {
  fullName: "",
  birthDate: "",
  gender: "",
  cookingSkill: "Mới bắt đầu",
  dietaryPreference: "Bình thường",
  allergies: ["Không có"],
  mainGoal: "Giảm lãng phí thực phẩm",
  avatarUrl: ""
};

const todayIso = new Date().toISOString().slice(0, 10);
const oldestBirthDateIso = `${new Date().getFullYear() - 100}-01-01`;

function normalizeAllergies(value) {
  if (Array.isArray(value)) return value.length ? value : ["Không có"];
  if (!value || value === "Không có") return ["Không có"];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeGender(value) {
  const matchedOption = genderOptions.find((option) => option.value === value || option.label === value);
  return matchedOption?.value || "";
}

function buildInitialProfile(profile) {
  return {
    ...defaultProfile,
    ...profile,
    gender: normalizeGender(profile?.gender),
    allergies: normalizeAllergies(profile?.allergies)
  };
}

export function ProfileDetailsForm({ initialProfile, email, submitLabel, onSubmit }) {
  const [form, setForm] = useState(() => buildInitialProfile(initialProfile));
  const [errors, setErrors] = useState({});
  const [avatarError, setAvatarError] = useState("");

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const toggleAllergy = (allergy) => {
    setForm((current) => {
      if (allergy === "Không có") return { ...current, allergies: ["Không có"] };

      const withoutNone = normalizeAllergies(current.allergies).filter((item) => item !== "Không có");
      const exists = withoutNone.includes(allergy);
      const next = exists ? withoutNone.filter((item) => item !== allergy) : [...withoutNone, allergy];

      return { ...current, allergies: next.length ? next : ["Không có"] };
    });
  };

  const handleAvatarFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Vui lòng chọn file ảnh.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Ảnh đại diện nên nhỏ hơn 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("avatarUrl", reader.result);
      setAvatarError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateProfileForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    const normalized = {
      ...form,
      fullName: form.fullName.trim(),
      allergies: normalizeAllergies(form.allergies),
      age: calculateAge(form.birthDate)
    };

    onSubmit(normalized);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm md:grid-cols-2">
      <div className="rounded-[24px] border border-orange-100 bg-orange-50/50 p-4 md:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-white text-orange-600 shadow-sm">
            {form.avatarUrl ? <img src={form.avatarUrl} alt="" className="h-full w-full object-cover" /> : <UserRound size={44} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-xl font-black text-slate-950">Ảnh đại diện</p>
            <p className="mt-1 text-sm text-slate-600">Chọn từ thư viện hoặc tải ảnh của bạn lên.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white">
                <Upload size={16} />
                Chọn file
                <input className="sr-only" type="file" accept="image/*" onChange={handleAvatarFile} />
              </label>
              {form.avatarUrl ? (
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700"
                  onClick={() => updateField("avatarUrl", "")}
                >
                  Xóa ảnh
                </button>
              ) : null}
            </div>
            {avatarError ? <p className="mt-2 text-xs font-semibold text-red-600">{avatarError}</p> : null}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {avatarLibrary.map((avatar) => {
            const selected = form.avatarUrl === avatar.url;
            return (
              <button
                type="button"
                key={avatar.id}
                className={`relative overflow-hidden rounded-2xl border-2 bg-white p-1 transition ${
                  selected ? "border-orange-500 shadow-lg shadow-orange-100" : "border-white hover:border-orange-200"
                }`}
                onClick={() => updateField("avatarUrl", avatar.url)}
                aria-label={`Chọn avatar ${avatar.label}`}
              >
                <img src={avatar.url} alt="" className="aspect-square w-full rounded-xl object-cover" />
                {selected ? (
                  <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-orange-500 text-white">
                    <Check size={14} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Họ và tên" error={errors.fullName}>
        <input className={inputClass} value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
      </Field>

      {email ? (
        <Field label="Email">
          <input className={`${inputClass} bg-slate-50`} value={email} disabled />
        </Field>
      ) : null}

      <Field label="Ngày sinh" error={errors.birthDate}>
        <input
          className={inputClass}
          type="date"
          min={oldestBirthDateIso}
          max={todayIso}
          value={form.birthDate}
          onChange={(event) => updateField("birthDate", event.target.value)}
        />
      </Field>

      <Field label="Giới tính" error={errors.gender}>
        <select className={inputClass} value={form.gender} onChange={(event) => updateField("gender", event.target.value)}>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Chế độ ăn" error={errors.dietaryPreference}>
        <select className={inputClass} value={form.dietaryPreference} onChange={(event) => updateField("dietaryPreference", event.target.value)}>
          {dietOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>

      <Field label="Kỹ năng nấu ăn" error={errors.cookingSkill}>
        <select className={inputClass} value={form.cookingSkill} onChange={(event) => updateField("cookingSkill", event.target.value)}>
          {cookingSkillOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>

      <Field label="Mục tiêu chính" error={errors.mainGoal}>
        <select className={inputClass} value={form.mainGoal} onChange={(event) => updateField("mainGoal", event.target.value)}>
          {goalOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>

      <div className="grid gap-2 text-sm font-bold text-slate-700 md:col-span-2">
        <span>Dị ứng</span>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-orange-100 bg-white p-3">
          {allergyOptions.map((allergy) => {
            const selected = normalizeAllergies(form.allergies).includes(allergy);
            return (
              <button
                type="button"
                key={allergy}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  selected ? "bg-orange-500 text-white shadow-md shadow-orange-100" : "bg-slate-50 text-slate-700 hover:bg-orange-50"
                }`}
                onClick={() => toggleAllergy(allergy)}
              >
                {allergy}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-end md:col-span-2">
        <button className="w-full rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-200">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
