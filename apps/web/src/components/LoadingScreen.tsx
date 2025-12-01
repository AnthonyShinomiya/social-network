// src/components/LoadingScreen.tsx
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Spinner */}
      <div className="mb-4">
        <div className="h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm text-slate-300 tracking-wide">
        Cargando aplicación…
      </p>
    </motion.div>
  );
}
