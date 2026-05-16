import { authAPI } from "../../api/auth.api";
import type { AuthResponse, RegisterPayload } from "../../src/interfaces/auth.interface";

export const registerAction = async (payload: RegisterPayload) => {
  const { data } = await authAPI.post<AuthResponse>("", payload);
  return data;
};
