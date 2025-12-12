// src/features/projects/api.ts
import { apiFetch } from "../../lib/api";

export type Project = {
    id: number;
    title: string;
    description: string | null;
    stage: "idea" | "in_validation" | "in_execution" | "completed";
    tags: string[];
    owner: {
        id: number;
        email: string;
    };
};

export async function listProjects() {
    return apiFetch<Project[]>("/api/projects");
}