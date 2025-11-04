import { apiFetch } from '../../lib/api'

export async function login(email: string, password: string) {
    // Devise endpoint por defecto
    return apiFetch('/users/sign_in', {
        method: 'POST',
        body: JSON.stringify({ user: { email, password } }),
    })
}

export async function logout() {
    return apiFetch('/users/sign_out', { method: 'DELETE' })
}

export async function getMe() {
    return apiFetch<{ id: number; email: string }>('/api/me')
}