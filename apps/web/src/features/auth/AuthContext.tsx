// src/features/auth/AuthContext.tsx
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { getMe, login as apiLogin, logout as apiLogout } from "./api";

export type Me = { id: number; email: string } | null;

type AuthContextValue = {
  me: Me;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: preact.ComponentChildren;
}) {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar sesión al inicio
  useEffect(() => {
    getMe()
      .then((user) => setMe(user))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    try {
      await apiLogin(email, password);
      const user = await getMe();
      setMe(user);
    } catch (err: any) {
      setError(err?.message || "Login failed");
      throw err;
    }
  }

  async function logout() {
    await apiLogout();
    setMe(null);
  }

  const value: AuthContextValue = {
    me,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
