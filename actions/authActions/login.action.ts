import { authAPI } from "../../api/auth.api";
import type { AuthResponse, LoginPayload } from "../../src/interfaces/auth.interface";

export const loginAction = async (payload: LoginPayload) => {
  const { data } = await authAPI.post<AuthResponse>("/usuarios/login", payload);
  return data;
};
