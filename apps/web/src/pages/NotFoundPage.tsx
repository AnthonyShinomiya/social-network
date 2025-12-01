// src/pages/NotFoundPage.tsx
import { Link } from "wouter-preact";
import { PageContainer } from "../components/PageContainer";

export function NotFoundPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <p className="text-sm font-semibold text-cyan-300 tracking-wide">
          ERROR 404
        </p>

        <h1 className="text-3xl font-bold text-white">Esta página no existe</h1>

        <p className="text-gray-400 max-w-md">
          Puede que el enlace esté roto o que la página haya sido eliminada.
        </p>

        <Link
          href="/"
          className="
            mt-4 inline-flex items-center justify-center
            px-4 py-2.5 rounded-xl
            bg-cyan-500 text-white text-sm font-semibold
            shadow-[0_10px_25px_rgba(0,0,0,0.55)]
            hover:brightness-110
            transition
          "
        >
          Volver al inicio
        </Link>
      </div>
    </PageContainer>
  );
}
