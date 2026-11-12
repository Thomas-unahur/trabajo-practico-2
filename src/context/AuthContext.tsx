import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

// Lo que el contexto comparte con toda la app
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// Clave con la que guardamos el usuario en localStorage
const CLAVE_USUARIO = "user";

// Valores por defecto (se usan solo si algún componente queda afuera del AuthProvider)
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Lee el usuario que quedó guardado en el navegador. Si no hay ninguno devuelve null.
function leerUsuarioGuardado(): User | null {
  const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);
  if (usuarioGuardado) {
    // localStorage guarda texto: JSON.parse lo vuelve a convertir en objeto
    return JSON.parse(usuarioGuardado);
  }
  return null;
}

// Envuelve a la app para que cualquier componente pueda saber quién está logueado
export function AuthProvider({ children }: { children: ReactNode }) {
  // Arranca con el usuario guardado, así la sesión no se pierde al recargar la página
  const [user, setUser] = useState<User | null>(leerUsuarioGuardado());

  function login(userData: User) {
    setUser(userData);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(CLAVE_USUARIO);
  }

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Atajo para usar el contexto en los componentes: const { user, login } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
