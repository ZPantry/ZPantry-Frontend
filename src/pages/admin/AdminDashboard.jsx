import { BookOpen, Package, Users, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/ui/Fields";
import { adminApiService } from "../../services/adminApiService";
import { userService } from "../../services/userService";

const statusLabel = { active: "Đang hoạt động", disabled: "Đã khóa" };

export function AdminDashboard() {
  const stats = userService.stats();
  const users = userService.all().filter((user) => user.role === "user");
  const [apiStats, setApiStats] = useState({ ingredients: "—", recipes: "—" });
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      adminApiService.listIngredients({ pageIndex: 1, pageSize: 1 }),
      adminApiService.listRecipes({ pageIndex: 1, pageSize: 1 })
    ])
      .then(([ingredients, recipes]) => {
        if (!active) return;
        setApiStats({
          ingredients: ingredients.totalItems,
          recipes: recipes.totalItems
        });
      })
      .catch((error) => {
        if (active) setApiError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Bảng quản trị"
        title="Tổng quan vận hành"
        description="Theo dõi dữ liệu vận hành và truy cập nhanh các API quản trị nguyên liệu, công thức."
        action={<Link to="/admin/ingredients" className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white">Quản lý API</Link>}
      />
      {apiError ? <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 font-bold text-red-700">{apiError}</div> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Tổng người dùng" value={stats.totalUsers} />
        <StatCard icon={UserCheck} label="Đang hoạt động" value={stats.activeUsers} tone="green" />
        <StatCard icon={Package} label="Nguyên liệu API" value={apiStats.ingredients} tone="blue" />
        <StatCard icon={BookOpen} label="Công thức API" value={apiStats.recipes} tone="slate" />
      </section>
      <section className="mt-6 rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-heading text-2xl font-black">Người dùng gần đây</h3>
          <Link to="/admin/users" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black">Quản lý người dùng</Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-slate-500">
              <tr><th className="py-3">Tên</th><th>Email</th><th>Trạng thái</th><th>Ngày tham gia</th></tr>
            </thead>
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
