import { useEffect } from "react";
import { AuthContext } from "./authContext";
import { useAuthStore } from "@/store/authStore";
import api from "@/axios/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    api.get("/auth/profile").then((r) => setUser(r.data)).catch(() => logout());
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
