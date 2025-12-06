import { apiFetch } from './client'
import type { ApiPost } from './posts'

export type TagWithCount = {
  id: string
  name: string
  count: number
}

export async function searchPosts(params: {
  q?: string
  tag?: string
  sort?: 'newest' | 'oldest' | 'views' | 'title'
  limit?: number
}) {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.tag) searchParams.set('tag', params.tag)
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.limit) searchParams.set('limit', String(params.limit))

  const data = await apiFetch<{
    items: ApiPost[]
    query: string
    tag?: string
    sort: string
  }>(`/search/posts?${searchParams.toString()}`)
  return data.items ?? []
}

export async function searchComments(q: string, opts?: { limit?: number }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (opts?.limit) params.set('limit', String(opts.limit))
  return apiFetch<{ items: any[] }>(`/search/comments?${params.toString()}`)
}

export async function searchUsers(q: string, opts?: { limit?: number }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (opts?.limit) params.set('limit', String(opts.limit))
  return apiFetch<{ items: any[] }>(`/search/users?${params.toString()}`)
}

export async function suggest(q: string) {
  const params = new URLSearchParams()
  params.set('q', q)
  return apiFetch<{
    posts: Array<{ id: string; title: string }>
    users: Array<{ id: string; name: string }>
  }>(`/search/suggest?${params.toString()}`)
}

export async function getTags() {
  const data = await apiFetch<{ items: TagWithCount[] }>(`/search/tags`)
  return data.items ?? []
}

export async function getTrendingPosts(limit = 10) {
  const data = await apiFetch<{ items: ApiPost[] }>(
    `/search/trending?limit=${limit}`,
  )
  return data.items ?? []
}
