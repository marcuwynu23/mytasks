import api from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/tasks", label: "Tasks" },
  { to: "/profile", label: "Profile" },
];

export default function AppLayout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await api.post("/auth/logout").catch(() => {});
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-noise px-4 sm:px-6 py-4 flex items-center justify-between">
        <span className="text-2xl font-bold tracking-tight">
          <span className="text-white">My</span>
          <span className="text-[#55e063]">Tasks</span>
        </span>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8">
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
          <Button size="default" onClick={() => setOpen(true)} className="bg-accent text-[#09453b] font-bold font-mono">
            Logout
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-white p-1"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-noise border-t border-white/10 px-4 py-3 flex flex-col gap-3">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `text-base font-medium transition-colors ${isActive ? "text-white" : "text-white/60"}`}
            >
              {label}
            </NavLink>
          ))}
          <Button size="sm" onClick={() => { setMenuOpen(false); setOpen(true); }} className="bg-accent text-[#09453b] font-bold font-mono w-fit">
            Logout
          </Button>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription>Are you sure you want to log out of Taskly?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleLogout} className="bg-primary text-primary-foreground">Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
