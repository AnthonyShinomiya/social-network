export const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        credentials: 'include', // <- cookies
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<T>
}