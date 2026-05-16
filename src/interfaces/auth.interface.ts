export interface AuthUser {
  id?: string;
  address?: string;
  username?: string;
  name?: string;
  email?: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  access_token?: string;
  user?: AuthUser;
  usuario?: string;
  username?: string;
  email?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  address: string;
  username: string;
  email: string;
  password: string;
}
