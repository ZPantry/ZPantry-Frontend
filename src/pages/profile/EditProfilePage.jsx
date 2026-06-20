import { useNavigate } from "react-router-dom";
import { ProfileDetailsForm } from "../../components/profile/ProfileDetailsForm";
import { PageHeader } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";

export function EditProfilePage() {
  const auth = authService.current();
  const user = userService.get(auth.id);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = (form) => {
    userService.update(auth.id, {
      name: form.fullName,
      profile: { ...form, onboarded: true }
    });
    toast.show("Đã cập nhật hồ sơ.");
    navigate("/profile");
  };

  return (
    <>
      <PageHeader
        eyebrow="Cập nhật hồ sơ"
        title="Chỉnh sửa sở thích của bạn"
        description="Email được giữ chỉ đọc trong bản giao diện mẫu này."
      />
      <ProfileDetailsForm
        initialProfile={{
          ...user.profile,
          fullName: user.profile?.fullName || user.name
        }}
        email={user.email}
        submitLabel="Lưu hồ sơ"
        onSubmit={submit}
      />
    </>
  );
}
