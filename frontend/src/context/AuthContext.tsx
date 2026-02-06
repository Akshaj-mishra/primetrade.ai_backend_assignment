import { createContext, useState, useEffect, useCallback } from "react";
import { login as apiLogin } from "../services/api";

interface User {
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
   
      setUser({ email: "user", role: "user" });
    }
    setLoading(false);
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const token = await apiLogin(email, password);
      setToken(token);
      localStorage.setItem("token", token);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
