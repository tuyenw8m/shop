// src/contexts/auth.types.ts
export interface User {
  id: string; // UUID from the new response
  name: string;
  email: string;
  phone?: string; // Optional based on response
  address?: string; // Optional based on response
  avatar_url?: string; // Optional based on response
}

export interface AuthContextType {
  user: { token: string; user: User } | null;
  setUser: (user: { token: string; user: User } | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}