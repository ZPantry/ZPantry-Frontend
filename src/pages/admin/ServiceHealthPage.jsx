import { Activity, CheckCircle2, CircleAlert, RefreshCw, Server, WifiOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "https://zpantry-java-backend.onrender.com";
const AI_URL = import.meta.env.VITE_AI_SERVICE_URL || "";
const POLL_INTERVAL_MS = 5_000;

function endpoint(baseUrl, path) {
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${path}` : "";
}

async function probe(name, url) {
  const startedAt = performance.now();
  if (!url) return { name, url: "Chưa cấu hình", healthy: false, checkedAt: new Date(), error: "Thiếu URL dịch vụ trong cấu hình frontend." };
  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    const payload = await response.json().catch(() => null);
    const healthy = response.ok && payload?.success !== false && payload?.data?.status === "healthy";
    return { name, url, healthy, checkedAt: new Date(), latency: Math.round(performance.now() - startedAt), error: healthy ? null : `HTTP ${response.status}` };
  } catch (error) {
    return { name, url, healthy: false, checkedAt: new Date(), error: error instanceof Error ? error.message : "Không thể kết nối." };
  }
}

export function ServiceHealthPage() {
  const [services, setServices] = useState([]);
  const [checking, setChecking] = useState(true);
  const inFlight = useRef(false);

  const checkHealth = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setChecking(true);
    const results = await Promise.all([
      probe("Backend API", endpoint(BACKEND_URL, "/health")),
      probe("AI Service", endpoint(AI_URL, "/ai/health"))
    ]);
    setServices(results);
    setChecking(false);
    inFlight.current = false;
  }, []);

  useEffect(() => {
    checkHealth();
    const intervalId = window.setInterval(checkHealth, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [checkHealth]);

  const unhealthy = services.some((service) => !service.healthy);
  const lastChecked = services[0]?.checkedAt;

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Vận hành hệ thống</p>
            <h2 className="mt-2 font-heading text-3xl font-black text-slate-950">Trạng thái dịch vụ</h2>
            <p className="mt-2 max-w-2xl text-slate-600">Tự kiểm tra Backend và AI Service mỗi 5 giây. Nút bên cạnh sẽ gửi health request đến cả hai dịch vụ để đánh thức và kiểm tra lại.</p>
          </div>
          <button onClick={checkHealth} disabled={checking} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
            <RefreshCw size={18} className={checking ? "animate-spin" : ""} />
            Đánh thức & kiểm tra
          </button>
        </div>
        <div className={`mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${unhealthy ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
          {unhealthy ? <CircleAlert size={20} /> : <CheckCircle2 size={20} />}
          {services.length === 0 ? "Đang kiểm tra dịch vụ…" : unhealthy ? "Có dịch vụ chưa phản hồi healthy." : "Cả hai dịch vụ đang healthy."}
          {lastChecked && <span className="ml-auto text-xs font-medium">Lần cuối: {lastChecked.toLocaleTimeString("vi-VN")}</span>}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.name} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Server size={23} /></div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${service.healthy ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{service.healthy ? "HEALTHY" : "UNHEALTHY"}</span>
            </div>
            <h3 className="mt-5 text-xl font-black text-slate-950">{service.name}</h3>
            <p className="mt-1 break-all text-sm text-slate-500">{service.url}</p>
            <div className="mt-6 border-t border-slate-100 pt-4 text-sm">
              {service.healthy ? <p className="flex items-center gap-2 font-bold text-emerald-700"><Activity size={17} /> Phản hồi trong {service.latency} ms</p> : <p className="flex items-center gap-2 font-bold text-rose-700"><WifiOff size={17} /> {service.error}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
