import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
import { Field, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { validateEmail } from "../../utils/validation";
import { AuthShell } from "./AuthShell";

export function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = (event) => {
    event.preventDefault();

    const next = {};

    if (!form.name.trim()) next.name = "Vui lòng nhập họ tên.";

    if (!form.email) next.email = "Vui lòng nhập email.";
    else if (!validateEmail(form.email)) next.email = "Email chưa đúng định dạng.";

    if (form.password.length < 6) next.password = "Mật khẩu cần ít nhất 6 ký tự.";

    if (form.confirm !== form.password) next.confirm = "Mật khẩu nhập lại chưa khớp.";

    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      authService.register(form);
      toast.show("Tạo tài khoản thành công. Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      toast.show(error.message, "error");
    }
  };

  return (
    <AuthShell
      title="Tạo hồ sơ tủ bếp"
      subtitle="Tạo tài khoản để lưu nguyên liệu, sở thích ăn uống và lịch bữa ăn của bạn."
    >
      <div className="grid gap-3">
        <GoogleSignInButton  label="Đăng ký với Google" googleText="signup_with" />

        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          Hoặc đăng ký bằng email
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <form onSubmit={submit} className="mt-3 grid gap-3">
        <Field label="Họ và tên" error={errors.name}>
          <input
            className={`${inputClass} h-10 rounded-xl text-sm`}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Nguyễn Văn A"
          />
        </Field>

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

        <Field label="Nhập lại mật khẩu" error={errors.confirm}>
          <input
            className={`${inputClass} h-10 rounded-xl text-sm`}
            type={show ? "text" : "password"}
            value={form.confirm}
            onChange={(event) => setForm({ ...form, confirm: event.target.value })}
            placeholder="Nhập lại mật khẩu"
          />
        </Field>

        <button className="h-11 rounded-xl bg-orange-500 px-5 text-sm font-black text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600">
          Đăng ký
        </button>
      </form>

      <p className="mt-3 text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link className="font-black text-orange-600" to="/login">
          Đăng nhập
        </Link>
      </p>
    </AuthShell>
  );
}
