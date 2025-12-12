// src/features/nodes/mock.ts
import type { NodeKind, GraphNode, GraphLink } from "./types";

export const mockNodes: GraphNode[] = [
    {
        id: "me",
        kind: "person",
        label: "Anthony",
        meta: "Creador",
        description: "Tu nodo principal. Desde aquí se expande tu universo interactivo.",
        x: 50,
        y: 50,
    },
    {
        id: "idea-educacion",
        kind: "idea",
        label: "Educación Climática",
        meta: "Idea",
        description: "Una propuesta para mejorar la educación ambiental en Chile.",
        x: 32,
        y: 28,
    },
    {
        id: "proj-bosque",
        kind: "project",
        label: "Bosques Urbanos RM",
        meta: "Proyecto",
        description: "Iniciativa colaborativa para aumentar áreas verdes.",
        x: 70,
        y: 32,
    },
    {
        id: "topic-energia",
        kind: "topic",
        label: "Energía verde",
        meta: "Tema",
        description: "Transición energética hacia fuentes renovables.",
        x: 18,
        y: 55,
    },
];

export const mockLinks: GraphLink[] = [
    { from: "me", to: "idea-educacion" },
    { from: "idea-educacion", to: "proj-bosque" },
    { from: "topic-energia", to: "proj-bosque" },
];