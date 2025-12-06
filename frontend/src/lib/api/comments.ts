import { apiFetch } from './client'

export type ApiComment = {
  id: string
  postId: string
  authorId: string
  authorName?: string | null
  text: string
  parentReplyId?: string | null
  createdAt?: string
}

export async function fetchComments(postId?: string) {
  const search = postId ? `?postId=${encodeURIComponent(postId)}` : ''
  return apiFetch<ApiComment[]>(`/comments${search}`)
}

export async function createComment(
  payload: { postId: string; text: string },
  token?: string | null,
) {
  return apiFetch<ApiComment>(`/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}

export async function createReply(
  payload: { commentId: string; parentReplyId?: string; text: string },
  token?: string | null,
) {
  return apiFetch<ApiComment>(`/comments/reply`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })
}

export type PostReplyPayload = {
  commentId: string
  parentReplyId?: string
  text: string
  author?: string
}

export async function postReply(
  payload: PostReplyPayload,
  token?: string | null,
) {
  const { author, ...rest } = payload
  return createReply(rest, token)
}
