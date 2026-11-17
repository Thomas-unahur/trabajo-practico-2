
import { createContext, useContext, ReactNode } from 'react';
import type { User } from '../types';

const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean;
  login: (u: User) => void;
  logout: () => void;
}>({ user: null, isAuthenticated: false, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={{ user: null, isAuthenticated: false, login: () => {}, logout: () => {} }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);