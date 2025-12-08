import { apiFetch } from './client'

export type ApiTeam = {
  id: string
  name: string
  slug?: string
  description?: string
  ownerId?: string
  createdAt?: string
  members?: number
}

export async function getTeams(limit = 50) {
  const data = await apiFetch<{ items: ApiTeam[] }>(`/teams?limit=${limit}`)
  return data.items ?? []
}

export async function createTeam(payload: {
  name: string
  description?: string
}) {
  return apiFetch<{ ok?: boolean; id?: string }>(`/teams`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function joinTeam(teamId: string, token?: string | null) {
  return apiFetch<{ ok?: boolean }>(
    `/teams/${encodeURIComponent(teamId)}/join`,
    {
      method: 'POST',
      token,
    },
  )
}
