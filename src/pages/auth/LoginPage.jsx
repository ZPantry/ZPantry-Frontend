import { Eye, EyeOff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
import { Field, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { validateLoginForm } from "../../utils/validation";
import { AuthShell } from "./AuthShell";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [legalDocument, setLegalDocument] = useState(null);
  const legalDialog = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (legalDocument) legalDialog.current?.showModal();
  }, [legalDocument]);

  const submit = async (event) => {
    event.preventDefault();

    const next = validateLoginForm(form);
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);

    try {
      const session = await authService.login(form.email, form.password, form.remember);
      toast.show("Đăng nhập thành công.");
      navigate(["admin", "super_admin"].includes(session.role) ? "/admin" : "/dashboard");
    } catch (error) {
      toast.show(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Đăng nhập vào căn bếp của bạn"
      subtitle="Quản lý nguyên liệu, gợi ý món ăn và lập kế hoạch bữa ăn trong một không gian gọn gàng."
    >
      <div className="grid gap-3">
        <GoogleSignInButton />

        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          Hoặc dùng email
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <form onSubmit={submit} className="mt-3 grid gap-3">
        <Field label="Email" error={errors.email}>
          <input
            className={`${inputClass} h-10 rounded-xl text-sm`}
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="ban@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Mật khẩu" error={errors.password}>
          <div className="relative">
            <input
              className={`${inputClass} h-10 rounded-xl pr-11 text-sm`}
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Tối thiểu 8 ký tự"
              autoComplete="current-password"
            />

            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500"
              onClick={() => setShow(!show)}
              aria-label="Ẩn hiện mật khẩu"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(event) => setForm({ ...form, remember: event.target.checked })}
            className="h-4 w-4 accent-orange-500"
          />
          Ghi nhớ đăng nhập
        </label>

        <button
          disabled={loading}
          className="h-11 rounded-xl bg-orange-500 px-5 text-sm font-black text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-3 text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link className="font-black text-orange-600" to="/register">
          Đăng ký ngay
        </Link>
      </p>
      <p className="mt-auto pt-5 text-center text-xs leading-5 text-slate-500">
        Khi nhấn &quot;Đăng nhập&quot;, bạn đồng ý với{" "}
        <button type="button" className="text-orange-700 underline underline-offset-2" onClick={() => setLegalDocument("terms")}>Terms of Service</button>
        {" "}của Z-Pantry và xác nhận{" "}
        <a className="text-orange-700 underline underline-offset-2" href="/chinh_sach_quyen_rieng_tu_z_pantry.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        {" "}của Z-Pantry áp dụng cho bạn.
      </p>
      <dialog ref={legalDialog} onClose={() => setLegalDocument(null)} aria-label="Terms of Service" className="w-[min(94vw,820px)] max-w-none rounded-2xl border-0 bg-white p-0 text-black shadow-2xl backdrop:bg-slate-950/60" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="text-base font-bold text-black">Terms of Service</h3>
          <button type="button" aria-label="Đóng" className="rounded-lg p-2 text-black hover:bg-slate-100" onClick={() => legalDialog.current?.close()}><X size={20} /></button>
        </div>
        {legalDocument && <iframe title="Terms of Service" src="/terms.html" className="h-[min(75vh,680px)] w-full border-0" />}
      </dialog>
    </AuthShell>
  );
}
