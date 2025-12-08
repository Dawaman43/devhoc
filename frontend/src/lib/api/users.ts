import { apiFetch } from './client'
import type { ApiPost } from './posts'

export type ApiUser = {
  id: string
  email: string
  name: string
  username?: string | null
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

export async function toggleFollow(userId: string, token?: string | null) {
  return apiFetch<{ ok: boolean; action: 'followed' | 'unfollowed' }>(
    `/users/${encodeURIComponent(userId)}/follow`,
    {
      method: 'POST',
      token,
    },
  )
}

export async function getFollowersCount(userId: string) {
  return apiFetch<{ count: number }>(
    `/users/${encodeURIComponent(userId)}/followers/count`,
  )
}

export async function getFollowingCount(userId: string) {
  return apiFetch<{ count: number }>(
    `/users/${encodeURIComponent(userId)}/following/count`,
  )
}

export async function isFollowingMe(userId: string, token?: string | null) {
  return apiFetch<{ following: boolean }>(
    `/users/${encodeURIComponent(userId)}/following/me`,
    { token },
  )
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
