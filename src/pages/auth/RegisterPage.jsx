import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
import { Field, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { validateOtpForm, validateRegisterForm } from "../../utils/validation";
import { AuthShell } from "./AuthShell";

export function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [otpForm, setOtpForm] = useState({ otpCode: "" });
  const [errors, setErrors] = useState({});
  const [otpErrors, setOtpErrors] = useState({});
  const [show, setShow] = useState(false);
  const [step, setStep] = useState("register");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const submitRegister = async (event) => {
    event.preventDefault();

    const next = validateRegisterForm(form);
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);

    try {
      const result = await authService.register(form);
      const successMessage = result?.message || "Đăng ký thành công! Vui lòng kiểm tra Gmail để nhận mã OTP xác thực.";
      setMessage(successMessage);
      setStep("verify");
      toast.show(successMessage);
    } catch (error) {
      toast.show(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (event) => {
    event.preventDefault();

    const next = validateOtpForm(otpForm);
    setOtpErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);

    try {
      const result = await authService.verifyOtp({
        email: form.email,
        otpCode: otpForm.otpCode
      });
      toast.show(result?.message || "Xác thực tài khoản thành công! Bạn hiện đã có thể đăng nhập.");
      navigate("/login");
    } catch (error) {
      toast.show(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={step === "register" ? "Tạo hồ sơ tủ bếp" : "Xác thực email"}
      subtitle={
        step === "register"
          ? "Tạo tài khoản để lưu nguyên liệu, sở thích ăn uống và lịch bữa ăn của bạn."
          : `Nhập mã OTP 6 chữ số đã gửi đến ${form.email}.`
      }
    >
      {step === "register" ? (
        <>
          <div className="grid gap-3">
            <GoogleSignInButton label="Đăng ký với Google" googleText="signup_with" />

            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              Hoặc đăng ký bằng email
              <span className="h-px flex-1 bg-slate-200" />
            </div>
          </div>

          <form onSubmit={submitRegister} className="mt-3 grid gap-3">
            <Field label="Họ và tên" error={errors.fullName}>
              <input
                className={`${inputClass} h-10 rounded-xl text-sm`}
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </Field>

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
                  autoComplete="new-password"
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
                autoComplete="new-password"
              />
            </Field>

            <button
              disabled={loading}
              className="h-11 rounded-xl bg-orange-500 px-5 text-sm font-black text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="mt-3 text-sm text-slate-600">
            Đã có tài khoản?{" "}
            <Link className="font-black text-orange-600" to="/login">
              Đăng nhập
            </Link>
          </p>
        </>
      ) : (
        <>
          {message ? <p className="rounded-xl bg-orange-50 p-3 text-sm font-semibold text-slate-700">{message}</p> : null}

          <form onSubmit={submitOtp} className="mt-3 grid gap-3">
            <Field label="Mã OTP" error={otpErrors.otpCode}>
              <input
                className={`${inputClass} h-12 rounded-xl text-center text-lg font-black tracking-[0.35em]`}
                value={otpForm.otpCode}
                onChange={(event) => setOtpForm({ otpCode: event.target.value.replace(/\D/g, "").slice(0, 6) })}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </Field>

            <button
              disabled={loading}
              className="h-11 rounded-xl bg-orange-500 px-5 text-sm font-black text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Đang xác thực..." : "Xác thực tài khoản"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setStep("register")}
              className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Sửa thông tin đăng ký
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
