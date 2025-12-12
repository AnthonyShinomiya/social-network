// src/features/nodes/types.ts
export type NodeKind = "project" | "user" | "tag";

export type GraphNode = {
    id: string;
    kind: NodeKind;
    label: string;
    description?: string;
    meta?: {
        projectId?: number | string;
        role?: "owner" | "collaborator" | "follower";
        stage?: string;
        tags?: string[];
        ownerId?: number;
        focused?: boolean; // <- el proyecto enfocado
    };
    x: number; // 0–100 (posición relativa)
    y: number; // 0–100
};