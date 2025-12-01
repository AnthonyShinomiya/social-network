// src/components/RequireAuth.tsx
import { type ComponentChildren } from "preact";
import { useAuth } from "../features/auth/AuthContext";
import { LoadingScreen } from "./LoadingScreen";
import { LoginPage } from "../pages/LoginPage";

export function RequireAuth({ children }: { children: ComponentChildren }) {
  const { me, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // 🟡 No redirige — simplemente muestra login en la misma ruta
  if (!me) {
    return <LoginPage />;
  }

  // Todo OK → muestra la ruta protegida
  return <>{children}</>;
}
