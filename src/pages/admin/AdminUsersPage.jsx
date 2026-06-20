import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { userService } from "../../services/userService";

const roleLabel = { admin: "Quản trị", user: "Người dùng" };
const statusLabel = { active: "Đang hoạt động", disabled: "Đã khóa" };

export function AdminUsersPage() {
  const [users, setUsers] = useState(userService.all());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const toast = useToast();
  const filtered = useMemo(
    () => users.filter((user) => {
      const matchesText = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || user.status === status || user.role === status;
      return matchesText && matchesStatus;
    }),
    [users, query, status]
  );

  const remove = (id) => {
    if (!confirm("Bạn muốn xóa người dùng này khỏi dữ liệu mẫu?")) return;
    userService.remove(id);
    setUsers(userService.all());
    toast.show("Đã xóa người dùng.");
  };

  const toggle = (id) => {
    userService.toggleStatus(id);
    setUsers(userService.all());
    toast.show("Đã cập nhật trạng thái người dùng.");
  };

  return (
    <>
      <PageHeader eyebrow="Quản lý người dùng" title="Danh sách tài khoản" description="Tìm kiếm, lọc, khóa, mở khóa hoặc xóa người dùng trong dữ liệu mẫu." />
      <div className="mb-4 grid gap-3 rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className={`${inputClass} pl-11`} placeholder="Tìm theo tên hoặc email" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Tất cả vai trò/trạng thái</option><option value="user">Người dùng</option><option value="admin">Quản trị</option><option value="active">Đang hoạt động</option><option value="disabled">Đã khóa</option>
        </select>
      </div>
      <section className="grid gap-3">
        {filtered.map((user) => (
          <article key={user.id} className="grid gap-4 rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="font-heading text-xl font-black">{user.name}</h3>
              <p className="text-sm text-slate-600">{user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">{roleLabel[user.role] || user.role}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{statusLabel[user.status] || user.status}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Tham gia {user.createdAt}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggle(user.id)} disabled={user.role === "admin"} className="rounded-2xl border border-slate-200 px-4 py-2 font-bold disabled:opacity-40">{user.status === "disabled" ? "Mở khóa" : "Khóa"}</button>
              <button onClick={() => remove(user.id)} disabled={user.role === "admin"} className="rounded-2xl bg-red-50 px-4 py-2 font-bold text-red-600 disabled:opacity-40" aria-label="Xóa người dùng"><Trash2 size={18} /></button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
