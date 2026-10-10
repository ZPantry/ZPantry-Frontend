import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, LoaderCircle, RefreshCw, Smartphone, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient, authService } from "../services/authService.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://zpantry-java-backend.onrender.com";

function unwrapSubscription(response) {
  return response?.data?.data ?? response?.data;
}

export function PaymentReturnPage({ outcome }) {
  const isSuccess = outcome === "success";
  const [state, setState] = useState("loading");
  const [subscription, setSubscription] = useState(null);

  const refreshSubscription = useCallback(async () => {
    const session = authService.current();
    if (!session?.accessToken) {
      setState("sign-in-required");
      return;
    }

    setState("loading");
    try {
      const response = await apiClient.get("/api/me/subscription");
      setSubscription(unwrapSubscription(response));
      setState("ready");
    } catch {
      setState("unavailable");
    }
  }, []);

  useEffect(() => {
    void refreshSubscription();
  }, [refreshSubscription]);

  const activePlus = subscription?.planCode === "Z_PLUS" && subscription?.status === "ACTIVE";
  const title = !isSuccess
    ? "Bạn đã hủy thanh toán"
    : activePlus
      ? "Gói Z-Plus đã được kích hoạt"
      : "Thanh toán đang được xác nhận";
  const description = !isSuccess
    ? "Bạn chưa bị tính phí. Bạn có thể quay lại ứng dụng và thử đăng ký lại bất cứ lúc nào."
    : activePlus
      ? "Quyền lợi Z-Plus đã sẵn sàng trên tài khoản của bạn."
      : "Chúng tôi đang chờ backend xác nhận giao dịch từ PayOS. Hãy bấm cập nhật sau ít phút; không dựa vào thông tin trên URL để xác nhận thanh toán.";
  const deepLink = isSuccess ? "zpantry://payment/success" : "zpantry://payment/cancel";

  document.title = `${title} | Z-Pantry`;

  return (
    <main className="min-h-[calc(100vh-180px)] bg-[radial-gradient(circle_at_top,_#fff2df,_#fff_48%,_#f5fbf5)] px-5 py-32 sm:px-8">
      <section className="mx-auto max-w-xl rounded-[32px] border border-orange-100 bg-white p-7 text-center shadow-[0_24px_70px_rgba(88,52,23,0.14)] sm:p-10">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${!isSuccess ? "bg-orange-50 text-orange-500" : activePlus ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
          {!isSuccess ? <XCircle size={36} aria-hidden="true" /> : activePlus ? <CheckCircle2 size={36} aria-hidden="true" /> : <CircleAlert size={36} aria-hidden="true" />}
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-orange-500">Thanh toán Z-Pantry</p>
        <h1 className="mt-3 font-heading text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">{description}</p>

        <div className="mt-7 rounded-2xl border border-orange-100 bg-orange-50/70 p-4 text-left">
          {state === "loading" && <p className="flex items-center gap-2 text-sm font-semibold text-slate-700"><LoaderCircle className="animate-spin text-orange-500" size={18} /> Đang kiểm tra gói của bạn với backend...</p>}
          {state === "sign-in-required" && <p className="text-sm leading-6 text-slate-700">Trang web này chưa có phiên đăng nhập của bạn. Hãy mở Z-Pantry trên điện thoại để xem trạng thái gói chính xác.</p>}
          {state === "unavailable" && <p className="text-sm leading-6 text-slate-700">Chưa thể liên hệ backend để kiểm tra giao dịch. Bạn có thể thử lại sau ít phút hoặc mở ứng dụng Z-Pantry.</p>}
          {state === "ready" && <p className="text-sm leading-6 text-slate-700">Gói hiện tại: <strong>{activePlus ? "Z-Plus" : "Z-Free"}</strong>{subscription?.expiresAt ? ` · hết hạn ${new Date(subscription.expiresAt).toLocaleDateString("vi-VN")}` : ""}.</p>}
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a className="btn btn-primary inline-flex items-center justify-center gap-2" href={deepLink}><Smartphone size={18} /> Mở ứng dụng Z-Pantry</a>
          {isSuccess && <button type="button" className="btn btn-secondary inline-flex items-center justify-center gap-2" onClick={() => void refreshSubscription()}><RefreshCw size={18} /> Cập nhật trạng thái</button>}
          <Link className="btn btn-secondary inline-flex items-center justify-center" to="/">Về trang chủ</Link>
        </div>
        <p className="mt-6 text-xs leading-5 text-slate-500">Kiểm tra giao dịch được thực hiện qua API backend: {apiBaseUrl}.</p>
      </section>
    </main>
  );
}
