import { apiFetch } from './client'

export type LikeResponse = {
  ok: boolean
  action: 'created' | 'removed'
  id?: string
}

export async function toggleLike(
  targetType: 'post' | 'comment',
  targetId: string,
  token?: string | null,
) {
  return apiFetch<LikeResponse>(`/likes`, {
    method: 'POST',
    token,
    body: JSON.stringify({ targetType, targetId }),
  })
}

export async function getLikeCount(
  targetType: 'post' | 'comment',
  targetId: string,
) {
  return apiFetch<{ likes: number }>(
    `/likes/count?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
  )
}

export async function getMyLike(
  targetType: 'post' | 'comment',
  targetId: string,
  token?: string | null,
) {
  return apiFetch<{ liked: boolean }>(
    `/likes/my-like?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
    { token },
  )
}
