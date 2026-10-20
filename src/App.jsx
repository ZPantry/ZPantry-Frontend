import { Navigate, Route, Routes } from "react-router-dom";
import { ScrollToHash } from "./components/layout/ScrollToHash.jsx";
import { SiteLayout } from "./components/layout/SiteLayout.jsx";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { ScrollProgress } from "./components/ui/ScrollProgress.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage.jsx";
import { AdminCatalogPage } from "./pages/admin/AdminCatalogPage.jsx";
import { AdminRevenuePage } from "./pages/admin/AdminRevenuePage.jsx";
import { ServiceHealthPage } from "./pages/admin/ServiceHealthPage.jsx";
import { LoginPage } from "./pages/auth/LoginPage.jsx";
import { RegisterPage } from "./pages/auth/RegisterPage.jsx";
import { UserDashboard } from "./pages/user/UserDashboard.jsx";
import { OnboardingPage } from "./pages/user/OnboardingPage.jsx";
import { IngredientPage } from "./pages/ingredients/IngredientPage.jsx";
import { MealPlanPage } from "./pages/meals/MealPlanPage.jsx";
import { MealSuggestionsPage } from "./pages/meals/MealSuggestionsPage.jsx";
import { MealDetailPage } from "./pages/meals/MealDetailPage.jsx";
import { ProfilePage } from "./pages/profile/ProfilePage.jsx";
import { EditProfilePage } from "./pages/profile/EditProfilePage.jsx";
import { DownloadPage } from "./pages/DownloadPage.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { PaymentReturnPage } from "./pages/PaymentReturnPage.jsx";

export default function App() {
  return (
    <ToastProvider>
      <ScrollProgress />
      <ScrollToHash />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/download.html" element={<DownloadPage />} />
          <Route path="/payment/success" element={<PaymentReturnPage outcome="success" />} />
          <Route path="/payment/cancel" element={<PaymentReturnPage outcome="cancel" />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/service-health" element={<ServiceHealthPage />} />

        <Route element={<ProtectedRoute roles={["admin", "super_admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/catalog" element={<AdminCatalogPage />} />
            <Route path="/admin/revenue" element={<AdminRevenuePage />} />
            <Route path="/admin/service-health" element={<ServiceHealthPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["user"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/ingredients" element={<IngredientPage />} />
            <Route path="/meal-plan" element={<MealPlanPage />} />
            <Route path="/suggestions" element={<MealSuggestionsPage />} />
            <Route path="/suggestions/:id" element={<MealDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
