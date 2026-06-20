import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
import { Field, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { validateEmail } from "../../utils/validation";
import { AuthShell } from "./AuthShell";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = (event) => {
    event.preventDefault();

    const next = {};

    if (!form.email) next.email = "Vui lòng nhập email.";
    else if (!validateEmail(form.email)) next.email = "Email chưa đúng định dạng.";

    if (!form.password) next.password = "Vui lòng nhập mật khẩu.";
    else if (form.password.length < 6) next.password = "Mật khẩu cần ít nhất 6 ký tự.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);

    try {
      const session = authService.login(form.email, form.password, form.remember);
      toast.show("Đăng nhập thành công.");
      navigate(session.role === "admin" ? "/admin" : "/dashboard");
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
          />
        </Field>

        <Field label="Mật khẩu" error={errors.password}>
          <div className="relative">
            <input
              className={`${inputClass} h-10 rounded-xl pr-11 text-sm`}
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Tối thiểu 6 ký tự"
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

      <div className="auth-demo-accounts mt-3 rounded-xl bg-orange-50/90 p-3 text-xs leading-5 text-slate-700">
        <p>
          <strong>Admin:</strong> admin@zpantry.com / 123456
        </p>
        <p>
          <strong>Người dùng:</strong> user@zpantry.com / 123456
        </p>
      </div>
    </AuthShell>
  );
}
