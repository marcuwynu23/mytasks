import { useEffect } from "react";
import { AuthContext } from "./authContext";
import { useAuthStore } from "@/store/authStore";
import api from "@/axios/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, setUser, logout, setLoading } = useAuthStore();

  useEffect(() => {
    api.get("/auth/profile")
      .then((r) => setUser(r.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
