import { Activity, CheckCircle2, CircleAlert, RefreshCw, Server, WifiOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminMonitoringService } from "../../services/adminMonitoringService";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "https://zpantry-java-backend.onrender.com";
const AI_URL = import.meta.env.VITE_AI_SERVICE_URL || "https://zpantry-aiservice.onrender.com";
const POLL_INTERVAL_MS = 5_000;

function endpoint(baseUrl, path) {
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${path}` : "";
}

async function probe(name, url) {
  const startedAt = performance.now();
  if (!url) return { name, url: "Chưa cấu hình", healthy: false, checkedAt: new Date(), error: "Thiếu URL dịch vụ trong cấu hình frontend." };
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, { method: "GET", cache: "no-store", signal: controller.signal });
    const payload = await response.json().catch(() => null);
    const healthy = response.ok && payload?.success === true && payload?.data?.status === "healthy";
    return { name, url, healthy, checkedAt: new Date(), latency: Math.round(performance.now() - startedAt), error: healthy ? null : response.ok ? "Phản hồi health không hợp lệ." : `HTTP ${response.status}` };
  } catch (error) {
    return { name, url, healthy: false, checkedAt: new Date(), error: error?.name === "AbortError" ? "Hết thời gian chờ (10 giây)." : error instanceof Error ? error.message : "Không thể kết nối." };
  } finally {
    window.clearTimeout(timeout);
  }
}

async function probeInternalServices() {
  const url = endpoint(BACKEND_URL, "/api/admin/monitoring/services");
  const checkedAt = new Date();
  try {
    const entries = await adminMonitoringService.services();
    return entries.map((entry) => ({
      name: entry.name === "DATABASE" ? "Database" : "AI từ Backend",
      url, healthy: entry.available, checkedAt: new Date(entry.checkedAt),
      latency: entry.latencyMs, error: entry.available ? null : entry.name === "DATABASE" ? "Database không phản hồi." : "Backend không kết nối được AI."
    }));
  } catch {
    return ["Database", "AI từ Backend"].map((name) => ({
      name, url, healthy: null, checkedAt, error: "Không kiểm tra được qua Backend."
    }));
  }
}

export function ServiceHealthPage({ compact = false }) {
  const [services, setServices] = useState([]);
  const [checking, setChecking] = useState(true);
  const inFlight = useRef(false);

  const checkHealth = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setChecking(true);
    try {
      const [backend, ai, internal] = await Promise.all([
        probe("Backend API", endpoint(BACKEND_URL, "/health")),
        probe("AI Service", endpoint(AI_URL, "/ai/health")),
        compact ? probeInternalServices() : Promise.resolve([])
      ]);
      setServices([backend, ai, ...internal]);
    } finally {
      setChecking(false);
      inFlight.current = false;
    }
  }, [compact]);

  useEffect(() => {
    checkHealth();
    const intervalId = window.setInterval(checkHealth, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [checkHealth]);

  const unhealthy = services.some((service) => service.healthy === false);
  const unknown = services.some((service) => service.healthy === null);
  const pending = services.length === 0;
  const lastChecked = services[0]?.checkedAt;

  return (
    <section className={`${compact ? "mt-6" : "mx-auto max-w-5xl"} space-y-6`} aria-label="Trạng thái các dịch vụ">
      <header className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Vận hành hệ thống</p>
            <h2 className="mt-2 font-heading text-3xl font-black text-slate-950">Trạng thái các dịch vụ</h2>
            <p className="mt-2 max-w-2xl text-slate-600">Tự kiểm tra mỗi 5 giây. Bạn có thể kiểm tra lại ngay bằng nút bên cạnh.</p>
          </div>
          <button onClick={checkHealth} disabled={checking} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
            <RefreshCw size={18} className={checking ? "animate-spin" : ""} />
            Kiểm tra lại
          </button>
        </div>
        <div className={`mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${pending ? "bg-slate-100 text-slate-600" : unhealthy ? "bg-rose-50 text-rose-700" : unknown ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
          {pending ? <RefreshCw size={20} className="animate-spin" /> : unhealthy || unknown ? <CircleAlert size={20} /> : <CheckCircle2 size={20} />}
          {pending ? "Đang kiểm tra dịch vụ…" : unhealthy ? "Có dịch vụ không hoạt động." : unknown ? "Có dịch vụ chưa xác định được trạng thái." : "Tất cả dịch vụ đang hoạt động."}
          {lastChecked && <span className="ml-auto text-xs font-medium">Lần cuối: {lastChecked.toLocaleTimeString("vi-VN")}</span>}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <article key={service.name} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Server size={23} /></div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${service.healthy === null ? "bg-amber-50 text-amber-700" : service.healthy ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{service.healthy === null ? "CHƯA XÁC ĐỊNH" : service.healthy ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}</span>
            </div>
            <h3 className="mt-5 text-xl font-black text-slate-950">{service.name}</h3>
            <p className="mt-1 break-all text-sm text-slate-500">{service.url}</p>
            <div className="mt-6 border-t border-slate-100 pt-4 text-sm">
              {service.healthy ? <p className="flex items-center gap-2 font-bold text-emerald-700"><Activity size={17} /> Phản hồi trong {service.latency} ms</p> : <p className={`flex items-center gap-2 font-bold ${service.healthy === null ? "text-amber-700" : "text-rose-700"}`}><WifiOff size={17} /> {service.error}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
