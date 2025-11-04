import { useEffect, useState } from "preact/hooks";
import { getMe, login, logout } from "./features/auth/api";

export function App() {
  const [me, setMe] = useState<{ id: number; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      const user = await getMe();
      setMe(user);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  }

  async function onLogout() {
    await logout();
    setMe(null);
  }

  if (me) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Hola, {me.email}</h1>
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onLogin} className="w-80 space-y-3 p-6 border rounded">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        <input
          className="input"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full py-2 bg-blue-600 text-white rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
