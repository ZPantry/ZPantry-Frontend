import { LogOut, Pencil, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/ui/Fields";
import { genderOptions } from "../../data/profileOptions";
import { authService } from "../../services/authService";
import { ingredientService } from "../../services/ingredientService";
import { mealPlanService } from "../../services/mealPlanService";
import { userService } from "../../services/userService";
import { calculateAge } from "../../utils/validation";

const roleLabel = { admin: "Quản trị", user: "Người dùng" };

function genderLabel(value) {
  return genderOptions.find((option) => option.value === value)?.label || value || "Chưa thiết lập";
}

function allergyLabel(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "Không có";
}

export function ProfilePage() {
  const auth = authService.current();
  const user = userService.get(auth.id);
  const profile = user.profile || {};
  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    navigate("/");
  };

  const age = profile.birthDate ? calculateAge(profile.birthDate) : profile.age;

  return (
    <>
      <PageHeader
        eyebrow="Hồ sơ"
        title="Hồ sơ tủ bếp của bạn"
        description="Những thông tin cá nhân hóa trải nghiệm lập kế hoạch bữa ăn trong Z-Pantry."
      />
      <section className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <div className="rounded-[28px] border border-orange-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-orange-100 text-orange-600">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" /> : <UserRound size={52} />}
          </div>
          <h3 className="mt-5 font-heading text-2xl font-black">{profile.fullName || user.name}</h3>
          <p className="text-slate-600">{user.email}</p>
          <p className="mx-auto mt-3 w-fit rounded-full bg-orange-50 px-3 py-1 text-sm font-black text-orange-700">
            {roleLabel[user.role] || user.role}
          </p>
          <div className="mt-6 grid gap-3">
            <Link to="/profile/edit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white">
              <Pencil size={18} />
              Chỉnh sửa hồ sơ
            </Link>
            <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-black">
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard icon={UserRound} label="Nguyên liệu" value={ingredientService.all(auth.id).length} />
            <StatCard icon={UserRound} label="Món đã lên lịch" value={mealPlanService.all(auth.id).length} tone="green" />
          </div>
          <div className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm">
            <dl className="grid gap-4 md:grid-cols-2">
              {[
                ["Ngày sinh", profile.birthDate || "Chưa thiết lập"],
                ["Tuổi", age || "Chưa thiết lập"],
                ["Giới tính", genderLabel(profile.gender)],
                ["Chế độ ăn", profile.dietaryPreference || "Bình thường"],
                ["Dị ứng", allergyLabel(profile.allergies)],
                ["Kỹ năng nấu ăn", profile.cookingSkill || "Mới bắt đầu"],
                ["Mục tiêu chính", profile.mainGoal || "Giảm lãng phí thực phẩm"]
              ].map(([key, value]) => (
                <div key={key} className="rounded-2xl bg-slate-50 p-4">
                  <dt className="text-xs font-black uppercase text-slate-500">{key}</dt>
                  <dd className="mt-1 font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
