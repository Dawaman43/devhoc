import { apiFetch } from './client'

export type VoteResponse = {
  ok: boolean
  action?: 'created' | 'updated' | 'removed'
  id?: string
  value?: number
}

export type VoteCount = {
  upvotes: number
  downvotes: number
  score: number
}

export async function voteOnTarget(
  targetType: 'post' | 'comment',
  targetId: string,
  delta: 'up' | 'down',
  token?: string | null,
) {
  return apiFetch<VoteResponse>(`/votes`, {
    method: 'POST',
    token,
    body: JSON.stringify({ targetType, targetId, delta }),
  })
}

export async function getVoteCount(
  targetType: 'post' | 'comment',
  targetId: string,
) {
  return apiFetch<VoteCount>(
    `/votes/count?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
  )
}

export async function getMyVote(
  targetType: 'post' | 'comment',
  targetId: string,
  token?: string | null,
) {
  return apiFetch<{ value: number | null }>(
    `/votes/my-vote?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
    { token },
  )
}
