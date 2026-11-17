import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protege una ruta: si no hay nadie logueado, manda al login.
// Se usa así en App: <ProtectedRoute><Profile /></ProtectedRoute>
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // replace: reemplaza la página en el historial, así "Atrás" no vuelve a la ruta protegida
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
