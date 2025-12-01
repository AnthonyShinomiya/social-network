// src/lib/getInitials.ts
import type { Me } from "../features/auth/AuthContext";

export function getInitialsFromMe(me: Me): string {
    if (!me) return "?";

    const base =
        `${me.name ?? ""} ${me.last_name ?? ""}`.trim() || me.email || "";

    if (!base) return "?";

    const parts = base
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}