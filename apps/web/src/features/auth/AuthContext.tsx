// src/features/auth/AuthContext.tsx
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import {
  getMe,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from "./api";

export type Me = {
  id: number;
  email: string;
  full_name: string;
  birthdate: string;
} | null;

type AuthContextValue = {
  me: Me;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    birthdate: string,
    password: string
  ) => Promise<void>;
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

  useEffect(() => {
    getMe()
      .then(setMe)
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

  async function register(
    fullName: string,
    email: string,
    birthdate: string,
    password: string
  ) {
    setError(null);
    try {
      await apiRegister(fullName, email, birthdate, password);
      const user = await getMe();
      setMe(user);
    } catch (err: any) {
      setError(err?.message || "Register failed");
      throw err;
    }
  }

  async function logout() {
    await apiLogout();
    setMe(null);
  }

  return (
    <AuthContext.Provider
      value={{
        me,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
