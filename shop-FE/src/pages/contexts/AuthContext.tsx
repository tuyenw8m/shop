import { createContext } from 'react';
import type { AuthContextType, User } from './auth.types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});
