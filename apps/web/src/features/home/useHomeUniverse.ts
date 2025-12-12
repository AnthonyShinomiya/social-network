import { useEffect, useState } from "preact/hooks";
import { apiFetch } from "../../lib/api";
import type { GraphNode } from "../nodes/types";

type ProjectHomeItem = {
    id: number;
    title: string;
    description: string | null;
    stage: string;
    tags: string[];
    role: "owner" | "collaborator" | "follower";
    owner: { id: number; email: string };
};

type HomeApiResponse = {
    owned_or_collaborating: ProjectHomeItem[];
    following: ProjectHomeItem[];
};

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

type Mode = "home" | "projectFocus";

export function useHomeUniverse() {
    const [mode, setMode] = useState<Mode>("home");
    const [homeNodes, setHomeNodes] = useState<GraphNode[]>([]);
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [currentProject, setCurrentProject] =
        useState<ProjectDetailResponse["project"] | null>(null);
    const [focusedProjectId, setFocusedProjectId] = useState<number | null>(null);

    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingProject, setLoadingProject] = useState(false);

    // 1) Universo inicial: solo proyectos
    useEffect(() => {
        apiFetch<HomeApiResponse>("/api/home")
            .then((data) => {
                const all = [...data.owned_or_collaborating, ...data.following];

                const baseNodes: GraphNode[] = all.map((p, index) => ({
                    id: `project-${p.id}`,
                    kind: "project",
                    label: p.title,
                    description: p.description || "",
                    x: 20 + (index * 17) % 60,
                    y: 30 + (index * 23) % 40,
                    meta: {
                        stage: p.stage,
                        tags: p.tags,
                        role: p.role,
                        ownerId: p.owner.id,
                        focused: false,
                        dimmed: false,
                    },
                }));

                setHomeNodes(baseNodes);
                setNodes(baseNodes);
            })
            .catch((err) => {
                console.error("Error loading home universe:", err);
            })
            .finally(() => setLoadingInitial(false));
    }, []);

    // Limpia el foco: solo proyectos, sin users
    function clearFocus() {
        setMode("home");
        setFocusedProjectId(null);
        setCurrentProject(null);
        setSelectedNode(null);

        const cleaned = homeNodes.map((n) => ({
            ...n,
            meta: { ...(n.meta || {}), focused: false, dimmed: false },
        }));

        setNodes(cleaned);
    }

    // 2) Foco en un proyecto (manteniendo los demás atenuados)
    async function focusProject(projectNode: GraphNode) {
        let raw = String(projectNode.id);
        if (raw.startsWith("project-")) raw = raw.slice("project-".length);
        const numericId = Number(raw);

        setMode("projectFocus");
        setSelectedNode(projectNode);
        setLoadingProject(true);

        try {
            const data = await apiFetch<ProjectDetailResponse>(
                `/api/projects/${numericId}`
            );

            setCurrentProject(data.project);
            setFocusedProjectId(numericId);

            // proyectos: foco / dimming
            const updatedProjects = homeNodes.map((n) => {
                const isThis =
                    n.id === `project-${data.project.id}` ||
                    n.id === projectNode.id;
                return {
                    ...n,
                    meta: {
                        ...(n.meta || {}),
                        focused: isThis,
                        dimmed: !isThis,
                    },
                };
            });

            // usuarios alrededor del proyecto
            const people: GraphNode[] = data.memberships.map((m, index) => ({
                id: `user-${m.user.id}`,
                kind: "user",
                label: m.user.name || m.user.email,
                description: "",
                x: 20 + ((index * 33) % 60),
                y: 25 + ((index * 47) % 50),
                meta: {
                    role: m.role,
                    projectId: `project-${numericId}`, // <- CLAVE para el grafo
                },
            }));

            setNodes([...updatedProjects, ...people]);
        } catch (err) {
            console.error("Error focusing project:", err);
            clearFocus();
        } finally {
            setLoadingProject(false);
        }
    }

    // 3) Manejo de clicks en nodos
    function handleNodeClick(node: GraphNode) {
        if (node.kind === "project") {
            let raw = String(node.id);
            if (raw.startsWith("project-")) raw = raw.slice("project-".length);
            const numericId = Number(raw);

            if (focusedProjectId === numericId) {
                clearFocus();
            } else {
                focusProject(node);
            }
        } else if (node.kind === "user") {
            setSelectedNode(node);
        }
    }

    return {
        mode,
        nodes,
        selectedNode,
        currentProject,
        loadingInitial,
        loadingProject,
        onNodeClick: handleNodeClick,
        clearFocus,
        setSelectedNode,
    };
}