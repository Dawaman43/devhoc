import { apiFetch } from './client'

export type VotePayload = {
  targetType: 'post' | 'comment'
  targetId: string
  delta: 'up' | 'down'
}

export async function castVote(payload: VotePayload, token?: string | null) {
  return apiFetch<{ ok: boolean; id: string; value: number }>(`/votes`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}
