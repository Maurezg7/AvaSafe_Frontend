import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../../actions/authActions/login.action";
import { registerAction } from "../../actions/authActions/register.action";
import { authAPI } from "../../api/auth.api";
import { clearSession, getStoredUser, getToken, persistSession } from "../lib/session";

export interface User {
  address: string;
  username: string;
  email: string;
  role: string[];
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { address: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser({
        address: stored.address ?? "",
        username: stored.username ?? stored.name ?? "Usuario",
        email: stored.email ?? "",
        role: [],
        created_at: "",
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginAction({ email, password });
    const jwt = data.token;
    if (!jwt) throw new Error("No se recibió token del servidor");
    persistSession({
      token: jwt,
      username: data.usuario ?? data.username,
      email: data.email,
    });
    const stored = getStoredUser();
    setToken(jwt);
    setUser(
      stored
        ? {
            address: stored.address ?? "",
            username: stored.username ?? "Usuario",
            email: stored.email ?? "",
            role: [],
            created_at: "",
          }
        : null,
    );
  };

  const register = async (data: { address: string; username: string; email: string; password: string }) => {
    await registerAction(data);
    await login(data.email, data.password);
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
    authAPI.post("/usuarios/logout").catch(() => {});
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!token && !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
