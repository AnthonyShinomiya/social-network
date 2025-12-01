import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-preact";

export type SelectedNode = {
  id: string;
  type: string;
  role: string;
};

type Props = {
  open: boolean;
  node: SelectedNode | null;
  onClose: () => void;
};

// 🎥 VIDEOS DISPONIBLES (se elige 1 aleatorio cada apertura)
const VIDEO_OPTIONS = [
  "https://media.istockphoto.com/id/2170610123/video/social-media-icon-connection-and-network-communication-concept.mp4?s=mp4-640x640-is&k=20&c=TJnljQLYduCI4aI8C7Ncym2TukPO515PkPwXoxQGFdw=",
  "https://player.vimeo.com/external/4384889.sd.mp4?s=b4b33a2a6c7e12e08a3b04fcdeec95bf05a1f210&profile_id=164",
];

export function IdeaSidePanel({ open, node, onClose }: Props) {
  const videoSrc =
    VIDEO_OPTIONS[Math.floor(Math.random() * VIDEO_OPTIONS.length)];

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -420, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          class="fixed top-0 left-0 w-[420px] h-full bg-white shadow-2xl border-r border-gray-200 z-40 flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div>
              <p class="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Idea Conectiva
              </p>
              <p class="mt-1 text-xl font-bold text-gray-900">
                {node?.id ?? "Idea"}
              </p>
            </div>

            <button
              onClick={onClose}
              class="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X class="text-gray-800" size={20} />
            </button>
          </div>

          {/* CONTENIDO */}
          <div class="p-6 space-y-12">
            {/* === VIDEO REAL ALEATORIO === */}
            <section>
              <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Video destacado
              </h3>

              <div class="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
                <video
                  src={videoSrc}
                  autoplay
                  muted
                  loop
                  playsinline
                  class="w-full h-full object-cover"
                />
              </div>
            </section>

            {/* === DESCRIPCIÓN === */}
            <section>
              <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Descripción conectiva
              </h3>
              <p class="text-sm leading-relaxed text-gray-700">
                Esta idea representa un nodo dentro del ecosistema de
                inteligencia conectiva. Podría agrupar conceptos, contenido
                audiovisual, líneas de investigación o relaciones entre
                distintos usuarios, creadores o temáticas globales.
              </p>
            </section>

            {/* === INTERACCIONES === */}
            <section>
              <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Interacciones
              </h3>

              <div class="flex flex-wrap gap-3">
                <button class="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg shadow hover:bg-teal-700">
                  Seguir nodo
                </button>

                <button class="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg shadow hover:bg-gray-300">
                  Guardar para luego
                </button>

                <button class="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg shadow hover:bg-purple-700">
                  Ver conexiones
                </button>
              </div>
            </section>

            {/* === COMENTARIOS === */}
            <section>
              <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Comentarios
              </h3>

              <div class="space-y-4">
                <div class="p-3 bg-gray-100 rounded-lg">
                  <p class="text-sm">
                    <span class="font-semibold text-gray-800">
                      Usuario A —{" "}
                    </span>
                    Esta idea podría enlazar con un módulo de experiencias
                    inmersivas.
                  </p>
                </div>

                <div class="p-3 bg-gray-100 rounded-lg">
                  <p class="text-sm">
                    <span class="font-semibold text-gray-800">
                      Usuario B —{" "}
                    </span>
                    Podría añadirse un mapa de dependencias visual para mejorar
                    claridad.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
