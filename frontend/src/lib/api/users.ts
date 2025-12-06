import { apiFetch } from './client'
import type { ApiPost } from './posts'

export type ApiUser = {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  role: string
  reputation: number
  createdAt: string
}

export type UserStats = {
  postCount: number
  commentCount: number
  totalScore: number
}

export async function getUser(userId: string) {
  return apiFetch<ApiUser>(`/users/${userId}`)
}

export async function getUserPosts(userId: string) {
  const data = await apiFetch<{ items: ApiPost[] }>(`/users/${userId}/posts`)
  return data.items ?? []
}

export async function getUserComments(userId: string) {
  return apiFetch<any[]>(`/users/${userId}/comments`)
}

export async function getUserStats(userId: string) {
  return apiFetch<UserStats>(`/users/${userId}/stats`)
}

export async function fetchMyProfile(token: string) {
  return apiFetch<ApiUser>(`/users/me`, { token })
}

export async function updateMyProfile(
  token: string,
  payload: { name?: string; email?: string; avatarUrl?: string },
) {
  return apiFetch<ApiUser>(`/users/me`, {
    token,
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
