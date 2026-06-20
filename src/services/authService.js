import { ensureSeedData, keys, read, write } from "./storage";

ensureSeedData();

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
    return read(keys.auth, null);
  },
  login(email, password, remember = false) {
    const users = read(keys.users, []);
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!user) throw new Error("Email hoặc mật khẩu không đúng.");
    if (user.status === "disabled") throw new Error("Tài khoản này đang bị vô hiệu hóa.");
    const session = { id: user.id, name: user.name, email: user.email, role: user.role, remember };
    return write(keys.auth, session);
  },
  loginWithGoogle(credential) {
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
  register({ name, email, password }) {
    const users = read(keys.users, []);
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email này đã được đăng ký.");
    }
    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: "user",
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
      profile: { fullName: name, onboarded: false }
    };
    write(keys.users, [...users, user]);
    return user;
  },
  logout() {
    localStorage.removeItem(keys.auth);
  }
};
