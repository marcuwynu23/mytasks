import api from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

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
      <header className="bg-noise px-6 py-4 flex items-center justify-between">
        <span className="text-3xl font-bold tracking-tight">
          <span className="text-[#55e063]">Task</span>
          <span className="text-white">ly</span>
        </span>
        <nav className="flex items-center gap-8">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `text-base font-medium transition-colors ${isActive ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              {label}
            </NavLink>
          ))}
          <Button size="default" onClick={handleLogout} className="bg-accent text-[#09453b] font-bold font-mono">
            Logout
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
