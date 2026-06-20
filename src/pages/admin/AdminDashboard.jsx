import { CalendarCheck, Package, Users, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/ui/Fields";
import { ingredientService } from "../../services/ingredientService";
import { mealPlanService } from "../../services/mealPlanService";
import { userService } from "../../services/userService";

const statusLabel = { active: "Đang hoạt động", disabled: "Đã khóa" };

export function AdminDashboard() {
  const stats = userService.stats();
  const users = userService.all().filter((user) => user.role === "user");
  const ingredientCount = users.reduce((sum, user) => sum + ingredientService.all(user.id).length, 0);
  const mealCount = users.reduce((sum, user) => sum + mealPlanService.all(user.id).length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Bảng quản trị"
        title="Tổng quan vận hành"
        description="Theo dõi người dùng, nguyên liệu đã thêm và số lịch bữa ăn được tạo từ dữ liệu mẫu."
        action={<Link to="/admin/users" className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white">Quản lý người dùng</Link>}
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Tổng người dùng" value={stats.totalUsers} />
        <StatCard icon={UserCheck} label="Đang hoạt động" value={stats.activeUsers} tone="green" />
        <StatCard icon={Package} label="Nguyên liệu đã thêm" value={ingredientCount} tone="blue" />
        <StatCard icon={CalendarCheck} label="Lịch bữa ăn đã tạo" value={mealCount} tone="slate" />
      </section>
      <section className="mt-6 rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
        <h3 className="font-heading text-2xl font-black">Người dùng gần đây</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-3">Tên</th><th>Email</th><th>Trạng thái</th><th>Ngày tham gia</th></tr></thead>
            <tbody>
              {users.slice(0, 6).map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="py-4 font-bold">{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={`rounded-full px-3 py-1 text-xs font-black ${user.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{statusLabel[user.status] || user.status}</span></td>
                  <td>{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
