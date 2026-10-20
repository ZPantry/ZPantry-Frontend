import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, UserCheck, Users, MailCheck } from "lucide-react";
import { PageHeader, StatCard } from "../../components/ui/Fields";
import { adminUserService } from "../../services/adminUserService";
import { adminMonitoringService } from "../../services/adminMonitoringService";
import { ServiceHealthPage } from "./ServiceHealthPage";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [monthRevenue, setMonthRevenue] = useState(null);
  const [ingredientCount, setIngredientCount] = useState(null);

  useEffect(() => {
    let active = true;
    adminUserService.all()
      .then((data) => { if (active) setUsers(data); })
      .catch((cause) => { if (active) setError(cause.response?.data?.message || cause.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    adminMonitoringService.revenue().then((report) => { if (active) setMonthRevenue(report.monthVnd); }).catch(() => { if (active) setMonthRevenue("unavailable"); });
    adminMonitoringService.ingredientCount().then((count) => { if (active) setIngredientCount(count); }).catch(() => { if (active) setIngredientCount("unavailable"); });
    return () => { active = false; };
  }, []);

  const people = users.filter((user) => user.role?.toLowerCase() === "user");
  const recent = [...users].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 6);

  return (
    <>
      <PageHeader eyebrow="Bảng quản trị" title="Tổng quan vận hành" description="Theo dõi dịch vụ, doanh thu, tài khoản và danh mục từ Java Backend."
        action={<Link to="/admin/users" className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white">Quản lý người dùng</Link>} />
      <ServiceHealthPage compact />
      <section className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Chỉ số doanh thu và nguyên liệu">
        <Link to="/admin/revenue" className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm hover:border-orange-300">
          <p className="text-sm text-slate-500">Doanh thu đã thanh toán tháng này</p>
          <p className="mt-2 text-2xl font-black">{monthRevenue === null ? "Đang tải..." : monthRevenue === "unavailable" ? "Không tải được" : money.format(monthRevenue)}</p>
          <span className="mt-2 inline-block text-sm font-bold text-orange-600">Xem doanh thu →</span>
        </Link>
        <Link to="/admin/catalog" className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm hover:border-orange-300">
          <p className="text-sm text-slate-500">Tổng nguyên liệu trong danh mục</p>
          <p className="mt-2 text-2xl font-black">{ingredientCount === null ? "Đang tải..." : ingredientCount === "unavailable" ? "Không tải được" : ingredientCount}</p>
          <span className="mt-2 inline-block text-sm font-bold text-orange-600">Xem và quản lý nguyên liệu →</span>
        </Link>
      </section>
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">Không tải được dữ liệu: {error}</p>}
      {loading ? <p className="mt-6">Đang tải dữ liệu...</p> : !error && <>
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Tổng tài khoản" value={users.length} />
          <StatCard icon={UserCheck} label="Người dùng" value={people.length} tone="green" />
          <StatCard icon={MailCheck} label="Email đã xác thực" value={users.filter((user) => user.isEmailConfirmed).length} tone="blue" />
          <StatCard icon={ShieldCheck} label="Quản trị viên" value={users.filter((user) => ["admin", "super_admin"].includes(user.role?.toLowerCase())).length} tone="slate" />
        </section>
        <section className="mt-6 rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-2xl font-black">Tài khoản gần đây</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-3">Tên</th><th>Email</th><th>Vai trò</th><th>Ngày tham gia</th></tr></thead>
              <tbody>{recent.map((user) => <tr key={user.id} className="border-t border-slate-100">
                <td className="py-4 font-bold">{user.fullName || "Chưa cập nhật"}</td><td>{user.email}</td>
                <td>{user.role}</td><td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
      </>}
    </>
  );
}
