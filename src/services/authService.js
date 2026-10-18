import axios from "axios";
import { ensureSeedData, keys, read, write } from "./storage";

ensureSeedData();

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://zpantry-java-backend.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

function getAuthSession() {
  return read(keys.auth, null);
}

function getApiMessage(error, fallback = "Có lỗi xảy ra. Vui lòng thử lại.") {
  return error?.response?.data?.message || error?.response?.data?.title || error?.message || fallback;
}

function normalizeSession(data, remember = true) {
  return {
    id: data.userId,
    userId: data.userId,
    name: data.fullName,
    fullName: data.fullName,
    email: data.email,
    role: data.role || "user",
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: data.expiresAt,
    remember
  };
}

apiClient.interceptors.request.use((config) => {
  const session = getAuthSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

function decodeGoogleCredential(credential) {
  const payload = credential?.split(".")?.[1];
  if (!payload) throw new Error("Google credential không hợp lệ.");
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(normalized)
      .split("")
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
  return JSON.parse(json);
}

export const authService = {
  current() {
    return getAuthSession();
  },
  async login(email, password, remember = false) {
    try {
      const response = await apiClient.post("/api/Auth/login", {
        email: email.trim(),
        password
      });
      if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message || "Đăng nhập thất bại.");
      }
      const session = normalizeSession(response.data.data, remember);
      return write(keys.auth, session);
    } catch (error) {
      throw new Error(getApiMessage(error, "Email hoặc mật khẩu không đúng."));
    }
  },
  async loginWithGoogle(credential) {
    const profile = decodeGoogleCredential(credential);
    if (!profile.email) throw new Error("Không thể đọc email từ tài khoản Google.");

    const users = read(keys.users, []);
    const existing = users.find((user) => user.email.toLowerCase() === profile.email.toLowerCase());
    const user =
      existing ||
      {
        id: `google-${profile.sub || Date.now()}`,
        name: profile.name || profile.email,
        email: profile.email,
        password: "",
        role: "user",
        status: "active",
        provider: "google",
        createdAt: new Date().toISOString().slice(0, 10),
        profile: {
          fullName: profile.name || profile.email,
          avatarUrl: profile.picture,
          onboarded: false
        }
      };

    if (existing) {
      write(
        keys.users,
        users.map((item) =>
          item.id === existing.id
            ? { ...item, provider: item.provider || "google", profile: { ...item.profile, avatarUrl: item.profile?.avatarUrl || profile.picture } }
            : item
        )
      );
    } else {
      write(keys.users, [...users, user]);
    }

    const session = { id: user.id, name: user.name, email: user.email, role: user.role, provider: "google", remember: true };
    return write(keys.auth, session);
  },
  async register({ fullName, email, password }) {
    try {
      const response = await apiClient.post("/api/Auth/register", {
        fullName: fullName.trim(),
        email: email.trim(),
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiMessage(error, "Không thể đăng ký tài khoản."));
    }
  },
  async verifyOtp({ email, otpCode }) {
    try {
      const response = await apiClient.post("/api/Auth/verify-otp", {
        email: email.trim(),
        otpCode: otpCode.trim()
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiMessage(error, "Mã OTP không hợp lệ hoặc đã hết hạn."));
    }
  },
  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post("/api/Auth/refresh-token", { refreshToken });
      const current = getAuthSession();
      const session = normalizeSession(response.data, current?.remember ?? true);
      return write(keys.auth, session);
    } catch (error) {
      localStorage.removeItem(keys.auth);
      throw new Error(getApiMessage(error, "Phiên đăng nhập đã hết hạn."));
    }
  },
  logout() {
    const session = getAuthSession();
    localStorage.removeItem(keys.auth);
    if (session?.accessToken) {
      apiClient.post("/api/Auth/logout").catch(() => {});
    }
  }
};
