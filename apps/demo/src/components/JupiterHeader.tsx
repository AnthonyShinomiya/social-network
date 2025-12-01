// src/JupiterHeader.tsx
import { Bell } from "lucide-preact";

const USER = {
  name: "Anthony Shinomiya",
  role: "Jupiter Creator",
  avatarUrl: "/assets/profile/anthony-main.jpg", // ajusta la ruta real
};

export function JupiterHeader() {
  return (
    <header class="pointer-events-none fixed top-0 left-0 right-0 z-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-8 pt-4">
        <div class="flex items-center justify-between gap-4">
          {/* Título */}
          {/* <div class="flex items-center gap-3">
            <div class="h-8 w-[2px] rounded-full bg-gradient-to-b from-cyan-400/70 via-fuchsia-400/70 to-amber-300/80" />
            <h1 class="text-[clamp(1.5rem,4vw,2.6rem)] tracking-[0.12em] font-normal title-gradient drop-shadow-lg">
              Inteligencia Conectiva
            </h1>
          </div> */}

          {/* Perfil + notificaciones */}
          <div class="pointer-events-auto flex items-center gap-3">
            {/* Notificaciones */}
            <button
              type="button"
              class="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-lg shadow-md hover:bg-white/10 hover:border-white/30 transition"
              aria-label="Ver notificaciones"
            >
              <Bell class="h-5 w-5 text-cyan-100" />
              <span class="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
            </button>

            {/* Usuario */}
            <button
              type="button"
              class="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-2.5 pr-3 sm:px-3 sm:pr-4 py-1.5 backdrop-blur-lg shadow-md hover:bg-white/10 hover:border-white/30 transition"
            >
              <div class="relative">
                <img
                  src={USER.avatarUrl}
                  alt={USER.name}
                  class="h-9 w-9 rounded-full object-cover ring-2 ring-cyan-300/70 shadow-[0_0_18px_rgba(45,212,191,0.55)]"
                />
              </div>
              <div class="hidden sm:flex flex-col items-start">
                <span class="text-xs uppercase tracking-[0.16em] text-cyan-100/70">
                  Conectado
                </span>
                <span class="text-sm font-medium text-slate-50 leading-tight">
                  {USER.name}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
