// src/sections/NetworkPage.tsx
import JupiterNetwork from "../components/JupiterNetwork";

export default function NetworkPage() {
  return (
    <div class="relative w-screen h-screen overflow-hidden bg-[#0b0c10] text-white">
      <h1 class="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 text-center text-[clamp(1.8rem,6vw,3rem)] tracking-[0.12em] font-normal title-gradient drop-shadow-lg">
        Inteligencia Conectiva
      </h1>

      <JupiterNetwork />
    </div>
  );
}
