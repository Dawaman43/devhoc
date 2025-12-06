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
  emoji?: string | null,
) {
  const body: Record<string, any> = { targetType, targetId }
  if (emoji) body.emoji = emoji
  return apiFetch<LikeResponse>(`/likes`, {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  })
}

export async function getLikeCount(
  targetType: 'post' | 'comment',
  targetId: string,
) {
  return apiFetch<{ likes: number; breakdown?: Record<string, number> }>(
    `/likes/count?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
  )
}

export async function getMyLike(
  targetType: 'post' | 'comment',
  targetId: string,
  token?: string | null,
) {
  return apiFetch<{ liked: boolean; emoji?: string | null }>(
    `/likes/my-like?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
    { token },
  )
}
