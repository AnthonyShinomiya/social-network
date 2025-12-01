// src/pages/HomePage.tsx
import { useAuth } from "../features/auth/AuthContext";

export function HomePage() {
  const { me, logout } = useAuth();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Hola, {me?.email}</h1>
      <p className="text-gray-600 text-sm">
        Aquí iría tu dashboard, links a otras secciones, etc.
      </p>
      <button className="px-3 py-2 bg-gray-200 rounded" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}
