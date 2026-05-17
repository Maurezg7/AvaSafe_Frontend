import { authAPI } from "../../api/auth.api";
import type { AuthResponse, NonceResponse, WalletAuthPayload } from "../../src/interfaces/auth.interface";

export const getNonce = async (address: string) => {
  const { data } = await authAPI.get<NonceResponse>(`/usuarios/nonce/${address}`);
  return data;
};

export const walletAuthAction = async (payload: WalletAuthPayload) => {
  const { data } = await authAPI.post<AuthResponse>("/usuarios/wallet-auth", payload);
  return data;
};
