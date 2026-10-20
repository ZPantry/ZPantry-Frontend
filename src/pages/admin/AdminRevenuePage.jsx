import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/Fields";
import { adminMonitoringService } from "../../services/adminMonitoringService";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export function AdminRevenuePage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReport(await adminMonitoringService.revenue());
    } catch (cause) {
      setError(cause.response?.data?.message || cause.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return <>
    <PageHeader eyebrow="Quản trị thanh toán" title="Doanh thu" description="Chỉ tính giao dịch PayOS đã được xác nhận PAID; đơn đang chờ hoặc thất bại không được cộng." />
    <button type="button" onClick={reload} disabled={loading} className="mb-5 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">Kiểm tra lại</button>
    {loading && <p>Đang tải doanh thu...</p>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">Không tải được doanh thu: {error}</p>}
    {!loading && report && <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Hôm nay", money.format(report.todayVnd)],
          ["Tháng này", money.format(report.monthVnd)],
          ["Toàn thời gian", money.format(report.allTimeVnd)],
          ["Giao dịch đã thanh toán", report.paidTransactions]
        ].map(([label, value]) => <article key={label} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </article>)}
      </section>
      <section className="mt-6 rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-black">Giao dịch gần đây</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm">
          <thead className="text-slate-500"><tr><th className="py-3">Mã đơn</th><th>Số tiền</th><th>Thanh toán lúc</th></tr></thead>
          <tbody>{report.recentPayments.map((payment) => <tr key={payment.id} className="border-t border-slate-100">
            <td className="py-4 font-bold">{payment.orderId}</td><td>{money.format(payment.amountVnd)}</td>
            <td>{new Date(payment.paidAt).toLocaleString("vi-VN")}</td>
          </tr>)}</tbody>
        </table></div>
        {report.recentPayments.length === 0 && <p className="mt-3 text-slate-500">Chưa có giao dịch đã thanh toán.</p>}
      </section>
    </>}
  </>;
}
