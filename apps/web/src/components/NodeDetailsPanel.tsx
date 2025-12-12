// src/components/NodeDetailsPanel.tsx
import { X } from "lucide-preact";
import { AnimatePresence, motion } from "framer-motion";
import type { GraphNode } from "../features/nodes/types";

type NodeDetailsPanelProps = {
  node: GraphNode | null;
  mode: "home" | "projectFocus";
  onClose: () => void; // cierra solo el panel
  onClearFocus: () => void; // quita foco y usuarios en el grafo
};

export function NodeDetailsPanel({
  node,
  mode,
  onClose,
  onClearFocus,
}: NodeDetailsPanelProps) {
  const isOpen = !!node;
  const meta = node?.meta || {};

  const stage =
    meta && typeof meta.stage === "string" ? (meta.stage as string) : null;
  const tags = meta && Array.isArray(meta.tags) ? (meta.tags as string[]) : [];
  const role =
    meta && typeof meta.role === "string" ? (meta.role as string) : null;

  const isProject = node?.kind === "project";
  const isUser = node?.kind === "user";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="node-panel" // panel único, no cambia con node.id
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="
            fixed right-0 top-0 bottom-0 w-80
            bg-white border-l border-blue-200 
            shadow-xl z-[80] p-6 overflow-y-auto
          "
        >
          {/* Botón cerrar panel */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-500 hover:text-slate-800"
          >
            <X size={20} />
          </button>

          {/* Transición entre nodos */}
          <AnimatePresence mode="wait">
            {node && (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <h2 className="text-xl font-semibold text-slate-900 mt-6">
                  {node.label}
                </h2>

                {isProject && stage && (
                  <p className="mt-2 text-xs text-slate-500">
                    Etapa:{" "}
                    <span className="font-medium capitalize">{stage}</span>
                  </p>
                )}

                {isUser && role && (
                  <p className="mt-2 text-xs text-slate-500">
                    Rol en este proyecto:{" "}
                    <span className="font-medium capitalize">{role}</span>
                  </p>
                )}

                {tags.length > 0 && isProject && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-600 mb-1">
                      Etiquetas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-[2px] rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {node.description && (
                  <p className="text-slate-700 mt-4 leading-relaxed text-sm">
                    {node.description}
                  </p>
                )}

                {mode === "projectFocus" && isProject && (
                  <button
                    type="button"
                    onClick={onClearFocus}
                    className="mt-6 inline-flex items-center justify-center w-full rounded-full bg-slate-100 text-slate-700 text-sm font-medium py-2.5 hover:bg-slate-200 transition"
                  >
                    Cerrar red de este proyecto
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
