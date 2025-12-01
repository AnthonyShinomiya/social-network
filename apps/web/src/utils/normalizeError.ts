// src/utils/normalizeError.ts
export function normalizeError(
  error: unknown,
  fallbackMessage: string
): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    // Intentar parsear JSON con { error: "..." }
    try {
      const obj = JSON.parse(error);
      if (
        obj &&
        typeof obj === "object" &&
        "error" in obj &&
        typeof (obj as any).error === "string"
      ) {
        return (obj as any).error;
      }
    } catch {
      // no es JSON, usamos el string tal cual
    }
    return error;
  }

  if (error instanceof Error) return error.message;

  return fallbackMessage;
}