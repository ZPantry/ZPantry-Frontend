import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useToast } from "../ui/Toast";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const isConfigured = googleClientId && !googleClientId.includes("your-google-oauth-client-id");

function getGoogleButtonWidth() {
  if (typeof window === "undefined") return 400;
  if (window.matchMedia("(max-width: 380px)").matches) return 300;
  if (window.matchMedia("(max-width: 640px)").matches) return 320;
  return 400;
}

export function GoogleSignInButton({ label = "Tiếp tục với Google", googleText = "signin_with" }) {
  const [buttonWidth, setButtonWidth] = useState(getGoogleButtonWidth);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const updateWidth = () => setButtonWidth(getGoogleButtonWidth());
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleSuccess = async (response) => {
    try {
      const session = await authService.loginWithGoogle(response.credential);
      toast.show("Đăng nhập Google thành công.");
      navigate(session.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.show(error.message, "error");
    }
  };

  if (!isConfigured) {
    return (
      <button
        type="button"
        disabled
        className="flex h-10 w-full items-center justify-center rounded-full border border-orange-100 bg-slate-50 px-4 text-sm font-black text-slate-400"
        title="Cần cấu hình VITE_GOOGLE_CLIENT_ID trong .env"
      >
        {label}
      </button>
    );
  }

 return (
  <div className="flex w-full justify-center" aria-label={label}>
    <div className="flex h-10 items-center justify-center overflow-hidden rounded-full">
      <GoogleLogin
        key={`${buttonWidth}-${googleText}`}
        onSuccess={handleSuccess}
        onError={() => toast.show("Đăng nhập Google thất bại.", "error")}
        theme="outline"
        shape="pill"
        size="medium"
        text={googleText}
        locale="vi"
        width={String(buttonWidth)}
      />
    </div>
  </div>
);
}
