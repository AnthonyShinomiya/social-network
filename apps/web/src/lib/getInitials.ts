export function getInitials(fullName: string | null | undefined): string {
    if (!fullName || typeof fullName !== "string") return "?";

    const parts = fullName
        .trim()
        .split(/\s+/) // separa por cualquier espacio
        .filter(Boolean);

    if (parts.length === 0) return "?";

    // Si solo tiene un nombre → primera letra
    if (parts.length === 1) return parts[0][0].toUpperCase();

    // Si tiene dos o más → primera letra del nombre y del apellido
    const first = parts[0][0]?.toUpperCase() ?? "";
    const last = parts[parts.length - 1][0]?.toUpperCase() ?? "";

    return `${first}${last}`;
}