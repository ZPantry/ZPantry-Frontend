export function Field({ label, error, children }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-orange-500">{eyebrow}</p>
        <h2 className="font-heading text-3xl font-black text-slate-950 md:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, tone = "orange" }) {
  const tones = {
    orange: "bg-orange-50 text-orange-600",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
    slate: "bg-slate-100 text-slate-700"
  };
  return (
    <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
      <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon size={22} />
      </div>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <strong className="mt-1 block font-heading text-3xl font-black">{value}</strong>
    </div>
  );
}
