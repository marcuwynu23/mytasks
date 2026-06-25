import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import api from "@/axios/axios";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/tasks", label: "Tasks" },
  { to: "/profile", label: "Profile" },
];

export default function AppLayout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    await api.post("/auth/logout").catch(() => {});
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <nav className="flex gap-4">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Button size="sm" variant="outline" onClick={handleLogout}>Logout</Button>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
