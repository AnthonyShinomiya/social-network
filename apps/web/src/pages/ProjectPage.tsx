// src/pages/ProjectPage.tsx
import { useRoute } from "wouter-preact";
import { PageContainer } from "../components/PageContainer";
import { SocialGraph } from "../components/SocialGraph";
import { useProjectGraph } from "../features/projects/useProjectGraph";

export function ProjectPage() {
  const [match, params] = useRoute("/projects/:id");
  const projectId = params?.id;

  const { nodes, loading, project } = useProjectGraph(projectId!);

  if (!match) return null;

  return (
    <PageContainer>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Proyecto
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          {project?.title ?? "Cargando proyecto…"}
        </h1>
        {project?.description && (
          <p className="mt-2 text-sm text-slate-600">{project.description}</p>
        )}
      </header>

      {loading ? (
        <p className="text-slate-500 text-sm">Cargando red del proyecto…</p>
      ) : (
        <SocialGraph nodes={nodes} />
      )}
    </PageContainer>
  );
}
