import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth.api";
import { clearSession, getStoredUser, getToken, persistSession } from "../lib/session";
import { walletAuthAction } from "../../actions/authActions/walletAuth.action";
import { signMessage } from "@wagmi/core";
import { wagmiAdapter } from "../lib/appkit";
import { getNonce } from "../../actions/authActions/walletAuth.action";

export interface User {
  address: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  authenticateWithWallet: (address: string) => Promise<void>;
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
    if (stored?.address) {
      setUser({ address: stored.address });
    }
    setLoading(false);
  }, []);

  const authenticateWithWallet = useCallback(async (address: string) => {
    const { message } = await getNonce(address);

    const signature = await signMessage(wagmiAdapter.wagmiConfig, {
      message,
    });

    const result = await walletAuthAction({ address, signature });
    const jwt = result.token;
    if (!jwt) throw new Error("No se recibió token del servidor");

    persistSession({ token: jwt, address });
    setToken(jwt);
    setUser({ address });
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    authAPI.post("/usuarios/logout").catch(() => {});
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!token && !!user, loading, authenticateWithWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
