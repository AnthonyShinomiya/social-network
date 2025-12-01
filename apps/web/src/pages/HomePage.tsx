import { PageContainer } from "../components/PageContainer";
import { useAuth } from "../features/auth/AuthContext";

export function HomePage() {
  const { me } = useAuth();

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-white">Hola, {me?.full_name}</h1>

      <p className="text-gray-400 mt-2">
        Bienvenido a tu panel central. Aquí irá el feed de nodos o tu contenido
        principal.
      </p>

      {/* Caja de ejemplo */}
      <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <p className="text-gray-300 text-sm">
          Este contenedor está centrado y limitado por{" "}
          <strong>max-w-4xl</strong>, como Instagram cuando visualizas el
          perfil.
        </p>
      </div>
    </PageContainer>
  );
}
