import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { usuariosService } from "../api/usuarios.service";

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
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await usuariosService.login({ email, password });
    const { usuario, token: jwt } = res.data;
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(usuario));
    setToken(jwt);
    setUser(usuario);
  };

  const register = async (data: { address: string; username: string; email: string; password: string }) => {
    await usuariosService.create(data);
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    usuariosService.logout().catch(() => {});
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
