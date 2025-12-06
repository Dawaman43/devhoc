import { apiFetch } from './client'

export type ApiPost = {
  id: string
  title: string
  content: string
  authorId: string
  authorName?: string | null
  createdAt?: string
  tags?: string[]
  views?: number
}

export async function listPosts() {
  const data = await apiFetch<{ items: ApiPost[] }>(`/posts`)
  if (!Array.isArray(data.items)) return []
  return data.items.map((item) => ({
    ...item,
    tags: item.tags ?? [],
  }))
}

export async function getPost(postId: string) {
  const post = await apiFetch<ApiPost>(`/posts/${postId}`)
  return {
    ...post,
    tags: post.tags ?? [],
  }
}

export async function createPost(
  payload: { title: string; content: string; tags?: string[] },
  token?: string | null,
) {
  const post = await apiFetch<ApiPost>(`/posts`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
  return {
    ...post,
    tags: post.tags ?? [],
  }
}

export async function updatePost(
  postId: string,
  payload: Partial<{ title: string; content: string; tags: string[] }>,
  token?: string | null,
) {
  const post = await apiFetch<ApiPost>(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  })
  return {
    ...post,
    tags: post.tags ?? [],
  }
}

export async function deletePost(postId: string, token?: string | null) {
  await apiFetch(`/posts/${postId}`, {
    method: 'DELETE',
    token,
  })
}
