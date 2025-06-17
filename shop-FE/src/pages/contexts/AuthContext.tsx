// src/contexts/AuthContext.tsx
import { createContext } from 'react';
import type { AuthContextType } from './auth.types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});