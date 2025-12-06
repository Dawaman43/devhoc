import { apiFetch } from './client'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
}

export type LoginResponse = {
  token: string
  user: AuthUser
}

export async function login(payload: { email: string; password: string }) {
  return apiFetch<LoginResponse>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function register(payload: {
  name: string
  email: string
  password: string
}) {
  return apiFetch<{ id: string; email: string; name: string }>(
    `/auth/register`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

export async function fetchSession(token: string) {
  return apiFetch<{ ok: boolean; payload?: { sub?: string; role?: string } }>(
    `/auth/me`,
    {
      token,
    },
  )
}

export async function changePassword(
  token: string,
  payload: { oldPassword: string; newPassword: string },
) {
  return apiFetch<{ ok: boolean }>(`/auth/change-password`, {
    token,
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
