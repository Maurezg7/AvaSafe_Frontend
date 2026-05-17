export interface AuthUser {
  address: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  address?: string;
}

export interface WalletAuthPayload {
  address: string;
  signature: string;
}

export interface NonceResponse {
  message: string;
  nonce: string;
}
