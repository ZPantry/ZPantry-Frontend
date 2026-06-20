import { useNavigate } from "react-router-dom";
import { ProfileDetailsForm } from "../../components/profile/ProfileDetailsForm";
import { PageHeader } from "../../components/ui/Fields";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";

export function OnboardingPage() {
  const auth = authService.current();
  const user = userService.get(auth.id);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = (form) => {
    userService.update(auth.id, {
      name: form.fullName,
      profile: { ...form, onboarded: true }
    });
    toast.show("Đã hoàn tất hồ sơ.");
    navigate("/dashboard");
  };

  return (
    <>
      <PageHeader
        eyebrow="Thiết lập lần đầu"
        title="Cho Z-Pantry biết cách bạn nấu ăn"
        description="Thông tin này giúp gợi ý món ăn hợp kỹ năng, khẩu vị, dị ứng và mục tiêu của bạn."
      />
      <ProfileDetailsForm
        initialProfile={{
          ...user?.profile,
          fullName: user?.profile?.fullName || user?.name || ""
        }}
        submitLabel="Lưu và tiếp tục"
        onSubmit={submit}
      />
    </>
  );
}
