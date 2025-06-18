// src/pages/contexts/AuthContext.tsx
import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { User } from './auth.types';

export interface AuthContextType {
  user: { token: string; user: User } | null;
  setUser: Dispatch<SetStateAction<{ token: string; user: User } | null>>;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Optional (rất nên dùng để tránh lỗi undefined)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
