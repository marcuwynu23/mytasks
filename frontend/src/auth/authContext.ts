import { createContext } from "react";

import type { IUser } from "@/types/user";

export type AuthContextType = {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
