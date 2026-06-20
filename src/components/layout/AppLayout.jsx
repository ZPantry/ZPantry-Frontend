import { BarChart3, CalendarDays, ChefHat, Home, LogOut, Menu, Package, Sparkles, User, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const userLinks = [
  { to: "/dashboard", label: "Tổng quan", icon: Home },
  { to: "/ingredients", label: "Nguyên liệu", icon: Package },
  { to: "/meal-plan", label: "Lịch bữa ăn", icon: CalendarDays },
  { to: "/suggestions", label: "Gợi ý món", icon: Sparkles },
  { to: "/profile", label: "Hồ sơ", icon: User }
];

const adminLinks = [
  { to: "/admin", label: "Tổng quan", icon: BarChart3 },
  { to: "/admin/users", label: "Người dùng", icon: Users }
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = authService.current();
  const links = auth?.role === "admin" ? adminLinks : userLinks;

  useEffect(() => setOpen(false), [location.pathname]);

  const logout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#fffaf2] text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-orange-100 bg-white/95 p-5 shadow-xl backdrop-blur transition lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between">
          <Link to={auth?.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-3 font-heading text-xl font-black">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-white"><ChefHat size={22} /></span>
            Z-Pantry
          </Link>
          <button className="rounded-xl p-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Đóng menu"><X size={20} /></button>
        </div>
        <nav className="grid gap-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-slate-600 hover:bg-orange-50 hover:text-slate-950"}`
              }
            >
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-bold text-slate-600 hover:bg-slate-50">
          <LogOut size={18} /> Đăng xuất
        </button>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-orange-100 bg-[#fffaf2]/85 px-4 backdrop-blur lg:px-8">
          <button className="rounded-2xl bg-white p-3 shadow lg:hidden" onClick={() => setOpen(true)} aria-label="Mở menu"><Menu size={22} /></button>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">{auth?.role === "admin" ? "Khu vực quản trị" : "Không gian bữa ăn"}</p>
            <h1 className="font-heading text-xl font-black text-slate-900 sm:text-2xl">Xin chào, {auth?.name}</h1>
          </div>
          <Link to="/profile" className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold shadow sm:block">{auth?.email}</Link>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
