// src/features/auth/api.ts
import { apiFetch } from "../../lib/api";

export async function login(email: string, password: string) {
    return apiFetch("/users/sign_in", {
        method: "POST",
        body: JSON.stringify({ user: { email, password } }),
    });
}

export async function register(fullName: string, email: string, birthdate: string, password: string) {
    return apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({
            user: {
                full_name: fullName,
                email,
                birthdate,
                password,
            },
        }),
    });
}

export async function logout() {
    return apiFetch("/users/sign_out", {
        method: "DELETE",
    });
}

export async function getMe() {
    return apiFetch<{ id: number; email: string; full_name: string; birthdate: string }>("/api/me");
}