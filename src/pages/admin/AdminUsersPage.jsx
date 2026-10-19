import { Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, inputClass } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { adminUserService } from "../../services/adminUserService";
import { authService } from "../../services/authService";

const roleLabel = { admin: "Quản trị", super_admin: "Quản trị cấp cao", manager: "Quản lý", user: "Người dùng" };

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();
  const currentUser = authService.current();
  const currentId = currentUser?.id;

  useEffect(() => {
    let active = true;
    adminUserService.all()
      .then((data) => { if (active) setUsers(data); })
      .catch((cause) => { if (active) setError(cause.response?.data?.message || cause.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => users.filter((user) => {
    const matchesText = `${user.fullName || ""} ${user.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (role === "all" || user.role?.toLowerCase() === role);
  }), [users, query, role]);

  const remove = async (user) => {
    if (!window.confirm(`Xóa tài khoản ${user.email}?`)) return;
    setDeleting(user.id);
    try {
      await adminUserService.remove(user.id);
      setUsers((items) => items.filter((item) => item.id !== user.id));
      toast.show("Đã xóa tài khoản.");
    } catch (cause) {
      toast.show(cause.response?.data?.message || cause.message, "error");
    } finally {
      setDeleting(null);
    }
  };

  const changeRole = async (user, nextRole) => {
    if (!window.confirm(`Đổi vai trò của ${user.email} thành ${roleLabel[nextRole.toLowerCase()]}?`)) return;
    try {
      await adminUserService.changeRole(user.id, nextRole);
      setUsers((items) => items.map((item) => item.id === user.id ? { ...item, role: nextRole } : item));
      toast.show("Đã cập nhật vai trò.");
    } catch (cause) {
      toast.show(cause.response?.data?.message || cause.message, "error");
    }
  };

  return (
    <>
      <PageHeader eyebrow="Quản lý người dùng" title="Danh sách tài khoản" description="Dữ liệu tài khoản được tải từ Backend API." />
      <div className="mb-4 grid gap-3 rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className={`${inputClass} pl-11`} placeholder="Tìm theo tên hoặc email" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <select className={inputClass} value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="all">Tất cả vai trò</option><option value="user">Người dùng</option><option value="manager">Quản lý</option><option value="admin">Quản trị</option><option value="super_admin">Quản trị cấp cao</option>
        </select>
      </div>
      {loading && <p>Đang tải danh sách...</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">Không tải được dữ liệu: {error}</p>}
      {!loading && !error && <section className="grid gap-3">
        {filtered.length === 0 && <p>Không tìm thấy tài khoản.</p>}
        {filtered.map((user) => {
          const isAdmin = ["admin", "super_admin"].includes(user.role?.toLowerCase());
          const canChangeRole = user.id !== currentId && (currentUser?.role === "super_admin" || (currentUser?.role === "admin" && !isAdmin));
          const roleOptions = currentUser?.role === "super_admin" ? ["USER", "MANAGER", "ADMIN", "SUPER_ADMIN"] : ["USER", "MANAGER"];
          return <article key={user.id} className="grid gap-4 rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div><h3 className="font-heading text-xl font-black">{user.fullName || "Chưa cập nhật"}</h3>
              <p className="text-sm text-slate-600">{user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">{roleLabel[user.role?.toLowerCase()] || user.role}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{user.isActive ? "Đang hoạt động" : "Đã khóa"}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Tham gia {new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
            {canChangeRole && <select aria-label={`Vai trò của ${user.email}`} className={inputClass} value={user.role?.toUpperCase()} onChange={(event) => changeRole(user, event.target.value)}>
              {roleOptions.map((option) => <option key={option} value={option}>{roleLabel[option.toLowerCase()]}</option>)}
            </select>}
            <button onClick={() => remove(user)} disabled={isAdmin || user.id === currentId || deleting === user.id}
              className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2 font-bold text-red-600 disabled:opacity-40" aria-label={`Xóa ${user.email}`} title={isAdmin ? "Không xóa tài khoản quản trị" : undefined}>
              <Trash2 size={18} /> Xóa
            </button>
            </div>
          </article>;
        })}
      </section>}
    </>
  );
}
