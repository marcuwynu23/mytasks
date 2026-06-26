import api from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    await api.post("/auth/logout").catch(() => {});
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10  px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight leading-none">
            <span className="text-dark">My</span>
            <span className="text-[#55e063]">Tasks</span>
          </span>
          <span className="text-xs text-dark/20 tracking-wide mt-0.5">Stay organized, stay ahead</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `text-base font-medium transition-colors ${isActive ? "text-dark" : "text-dark/60 hover:text-dark"}`}
            >
              {label}
            </NavLink>
          ))}
          <Button size="default" onClick={() => setLogoutOpen(true)} className="bg-primary text-white">
            Logout
          </Button>
        </nav>

        {/* Mobile drawer trigger */}
        <button className="sm:hidden text-dark p-1" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
        <DrawerContent className="p-0 before:inset-0 before:rounded-none data-[vaul-drawer-direction=right]:w-full">
          <div className="flex flex-col h-full p-6">
            <DrawerHeader className="px-6 py-5 -mx-6 -mt-6 mb-6">
              <DrawerTitle className="text-center text-lg font-bold text-dark">Menu</DrawerTitle>
            </DrawerHeader>
            <nav className="flex flex-col gap-1.5 px-2">
              {links.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-center rounded-4xl px-4 py-3 text-base font-medium transition-all ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto border-t pt-4 px-2">
              <Button
                className="w-full bg-primary shadow-sm text-white font-bold"
                onClick={() => {
                  setDrawerOpen(false);
                  setLogoutOpen(true);
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <main className="flex-1">
        <Outlet />
      </main>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription>Are you sure you want to log out of Taskly?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogout} className="bg-primary text-primary-foreground">
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
