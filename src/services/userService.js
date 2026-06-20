import { keys, read, write } from "./storage";

export const userService = {
  all() {
    return read(keys.users, []);
  },
  get(id) {
    return this.all().find((user) => user.id === id);
  },
  stats() {
    const users = this.all();
    return {
      totalUsers: users.filter((user) => user.role === "user").length,
      activeUsers: users.filter((user) => user.status === "active").length
    };
  },
  update(id, patch) {
    const users = this.all().map((user) => (user.id === id ? { ...user, ...patch, profile: { ...user.profile, ...patch.profile } } : user));
    write(keys.users, users);
    const updated = users.find((user) => user.id === id);
    const auth = read(keys.auth, null);
    if (auth?.id === id) write(keys.auth, { ...auth, name: updated.name, email: updated.email });
    return updated;
  },
  remove(id) {
    write(keys.users, this.all().filter((user) => user.id !== id));
  },
  toggleStatus(id) {
    const user = this.get(id);
    return this.update(id, { status: user.status === "disabled" ? "active" : "disabled" });
  }
};
