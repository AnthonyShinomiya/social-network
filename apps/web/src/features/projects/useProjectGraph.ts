// src/features/projects/useProjectGraph.ts
import { useState, useEffect } from "preact/hooks";
import { apiFetch } from "../../lib/api";
import type { GraphNode } from "../nodes/types";

type ProjectDetailResponse = {
    project: {
        id: number;
        title: string;
        description: string | null;
        stage: string;
        tags: string[];
        owner: { id: number; email: string };
    };
    memberships: {
        role: "owner" | "collaborator" | "follower";
        user: {
            id: number;
            email: string;
            name?: string;
            last_name?: string;
        };
    }[];
};

export function useProjectGraph(projectId: string | number) {
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [project, setProject] = useState<ProjectDetailResponse["project"] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        apiFetch<ProjectDetailResponse>(`/api/projects/${projectId}`)
            .then((data) => {
                setProject(data.project);

                const center: GraphNode = {
                    id: `project-${data.project.id}`,
                    kind: "project",
                    label: data.project.title,
                    description: data.project.description || "",
                    x: 50,
                    y: 50,
                    meta: {
                        stage: data.project.stage,
                        tags: data.project.tags,
                    },
                };

                const userNodes: GraphNode[] = data.memberships.map((m, index) => ({
                    id: `user-${m.user.id}`,
                    kind: "person",
                    label: m.user.name || m.user.email,
                    description: "",
                    x: 20 + ((index * 33) % 60),
                    y: 25 + ((index * 47) % 50),
                    meta: { role: m.role },
                }));

                setNodes([center, ...userNodes]);
            })
            .catch((err) => {
                console.error("Error loading project graph:", err);
            })
            .finally(() => setLoading(false));
    }, [projectId]);

    return { nodes, project, loading };
}