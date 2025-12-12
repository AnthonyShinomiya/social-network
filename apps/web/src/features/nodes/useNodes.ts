// src/features/nodes/useNodes.ts
import { useEffect, useState } from "preact/hooks";
import type { GraphNode } from "./types";
import { listProjects } from "../projects/api";

export function useNodes() {
    const [nodes, setNodes] = useState<GraphNode[]>([]);

    useEffect(() => {
        listProjects()
            .then((projects) => {
                const mapped: GraphNode[] = projects.map((p, idx) => ({
                    id: `project-${p.id}`,
                    kind: "project",
                    label: p.title,
                    description: p.description ?? "",
                    x: 20 + (idx * 15) % 60, // algo simple por ahora
                    y: 30 + ((idx * 27) % 40),
                    meta: {
                        stage: p.stage,
                        tags: p.tags,
                        ownerId: p.owner.id,
                    },
                }));

                setNodes(mapped);
            })
            .catch((err) => {
                console.error("Error loading projects:", err);
            });
    }, []);

    return { nodes };
}