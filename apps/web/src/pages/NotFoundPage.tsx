// src/pages/NotFoundPage.tsx
import { Link } from "wouter-preact";
import { SearchX } from "lucide-preact";
import { PageContainer } from "../components/PageContainer";

export function NotFoundPage() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Icono */}
          <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
            <SearchX className="w-6 h-6 text-slate-400" />
          </div>

          {/* Código pequeño arriba */}
          <span className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Error 404
          </span>

          {/* Título */}
          <h1 className="text-2xl font-semibold text-slate-900">
            No encontramos esta página
          </h1>

          {/* Texto secundario */}
          <p className="text-sm text-slate-500 max-w-md">
            Puede que el enlace esté roto, haya expirado o que la página haya
            sido eliminada.
          </p>

          {/* Botón volver */}
          <Link
            href="/"
            className="
              mt-4 inline-flex items-center justify-center
              px-5 py-2.5 rounded-full
              bg-gradient-to-r from-sky-400 via-cyan-400 to-fuchsia-500
              text-white text-sm font-semibold
              shadow-[0_10px_25px_rgba(15,23,42,0.18)]
              hover:brightness-[1.05]
              active:translate-y-[1px]
              transition
            "
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
