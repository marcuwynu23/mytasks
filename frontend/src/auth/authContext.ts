import { createContext } from "react";

export type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
