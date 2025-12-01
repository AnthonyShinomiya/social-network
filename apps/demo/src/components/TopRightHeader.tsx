import { motion } from "framer-motion";

export default function TopRightHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      class="fixed top-3 right-4 z-30 flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl shadow-xl"
    >
      {/* Indicadores */}
      <div class="flex items-center gap-6 pr-5 border-r border-white/10">
        {/* Conexiones */}
        <div class="text-right leading-tight">
          <p class="text-[0.65rem] uppercase tracking-wide text-teal-300/80">
            Conexiones
          </p>
          <p class="text-sm font-semibold text-white">248</p>
        </div>

        {/* Proyectos seguidos */}
        <div class="text-right leading-tight">
          <p class="text-[0.65rem] uppercase tracking-wide text-teal-300/80">
            Proyectos
          </p>
          <p class="text-sm font-semibold text-white">36</p>
        </div>

        {/* Ideas seguidas */}
        <div class="text-right leading-tight hidden sm:block">
          <p class="text-[0.65rem] uppercase tracking-wide text-teal-300/80">
            Ideas
          </p>
          <p class="text-sm font-semibold text-white">112</p>
        </div>
      </div>

      {/* Avatar + nombre */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        class="flex items-center gap-2 cursor-pointer group"
      >
        <img
          src="https://i.pravatar.cc/40?img=5" // reemplaza por tu imagen real
          class="w-9 h-9 rounded-full border border-white/20 shadow-[0_0_10px_rgba(45,212,191,0.35)] group-hover:shadow-[0_0_16px_rgba(94,234,212,0.55)] transition"
        />
        <span class="text-sm font-medium text-white hidden sm:inline">
          Maria
        </span>
      </motion.div>
    </motion.header>
  );
}
