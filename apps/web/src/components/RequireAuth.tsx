// src/components/RequireAuth.tsx
import { useAuth } from "../features/auth/AuthContext";
import { Redirect } from "wouter-preact";
import { LoadingScreen } from "./LoadingScreen";

export function RequireAuth({
  children,
}: {
  children: preact.ComponentChildren;
}) {
  const { me, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!me) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
