import { apiFetch } from './client'

export type VotePayload = {
  targetType: 'post' | 'comment'
  targetId: string
  delta: 'up' | 'down'
}

export type VoteCount = {
  upvotes: number
  downvotes: number
  score: number
}

export async function castVote(payload: VotePayload, token?: string | null) {
  return apiFetch<{ ok: boolean; action: string; id?: string; value: number }>(`/votes`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}

export async function getVoteCount(targetType: 'post' | 'comment', targetId: string) {
  return apiFetch<VoteCount>(`/votes/count?targetType=${targetType}&targetId=${targetId}`)
}

export async function getMyVote(
  targetType: 'post' | 'comment',
  targetId: string,
  token?: string | null,
) {
  return apiFetch<{ value: number | null }>(
    `/votes/my-vote?targetType=${targetType}&targetId=${targetId}`,
    { token },
  )
}
