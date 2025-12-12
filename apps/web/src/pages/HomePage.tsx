import { useState } from "preact/hooks";
import { PageContainer } from "../components/PageContainer";
import { useAuth } from "../features/auth/AuthContext";
import { SocialGraph } from "../components/SocialGraph";
import { useHomeUniverse } from "../features/home/useHomeUniverse";
import { NodeDetailsPanel } from "../components/NodeDetailsPanel";

export function HomePage() {
  const { me } = useAuth();
  const fullName = me ? `${me.name} ${me.last_name}` : "";

  const {
    mode,
    nodes,
    selectedNode,
    currentProject,
    loadingInitial,
    loadingProject,
    onNodeClick,
    clearFocus,
    setSelectedNode,
  } = useHomeUniverse();

  const [graphFading, setGraphFading] = useState(false);

  async function clearFocusAnimated() {
    // Si no hay focus, igual limpia directo
    if (mode !== "projectFocus") {
      clearFocus();
      return;
    }

    setGraphFading(true);

    // espera corta para que se vea el fade
    await new Promise((r) => setTimeout(r, 220));

    clearFocus();

    // re-aparece suave
    requestAnimationFrame(() => {
      setGraphFading(false);
    });
  }

  return (
    <PageContainer>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Tu universo interactivo
            {fullName ? `, ${fullName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Explora tus proyectos; al seleccionar uno verás su red de
            colaboración sin salir de esta pantalla.
          </p>
        </div>

        {mode === "projectFocus" && currentProject && (
          <div className="hidden md:flex flex-col items-end text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Explorando proyecto
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {currentProject.title}
            </p>
          </div>
        )}
      </header>

      {loadingInitial ? (
        <p className="text-slate-500 text-sm">Cargando tu universo…</p>
      ) : (
        <div className="relative">
          {loadingProject && mode === "projectFocus" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm">
              <span className="text-sm text-slate-600">
                Cargando red del proyecto…
              </span>
            </div>
          )}

          {/* wrapper que hace el fade sin romper d3 */}
          <div className="relative">
            <div
              className={[
                "pointer-events-none absolute inset-0 z-10",
                "transition-opacity duration-300 ease-out",
                graphFading ? "opacity-100" : "opacity-0",
                // un velo suave (no negro duro)
                "bg-white/35 backdrop-blur-[1px]",
              ].join(" ")}
            />
            <div
              className={[
                "transition-opacity duration-300 ease-out",
                graphFading ? "opacity-40" : "opacity-100",
              ].join(" ")}
            >
              <SocialGraph nodes={nodes} onNodeClick={onNodeClick} />
            </div>
          </div>

          <NodeDetailsPanel
            node={selectedNode}
            mode={mode}
            onClose={() => setSelectedNode(null)}
            onClearFocus={clearFocusAnimated}
          />
        </div>
      )}
    </PageContainer>
  );
}
