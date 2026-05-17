import type { AuthUser } from "../interfaces/auth.interface";

const TOKEN_KEY = "avasafe_token";
const USER_KEY = "avasafe_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Dirección del comprador: sesión guardada o payload del JWT. */
export function getBuyerAddress(): string | null {
  const user = getStoredUser();
  if (user?.address) return user.address;

  const token = getToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  const fromJwt = payload?.address;
  return typeof fromJwt === "string" ? fromJwt : null;
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const json = atob(segment.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function persistSession(data: {
  token: string;
  username?: string;
  email?: string;
  address?: string;
}) {
  localStorage.setItem(TOKEN_KEY, data.token);

  const payload = decodeJwtPayload(data.token);
  const user: AuthUser = {
    username: data.username,
    email: data.email ?? (payload?.email as string | undefined),
    address:
      data.address ??
      (payload?.address as string | undefined) ??
      getStoredUser()?.address,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("avasafe_wallet_address");
}
