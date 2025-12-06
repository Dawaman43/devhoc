export type APIRawComment = {
  id: string
  postId?: string
  author: string
  text: string
  createdAt?: string
}

const demoComments: APIRawComment[] = [
  {
    id: 'c1',
    postId: 'introducing-devhoc',
    author: 'Taylor',
    text: 'Great write-up!',
    createdAt: '2025-11-01',
  },
  {
    id: 'c2',
    postId: 'tanstack-router',
    author: 'Morgan',
    text: 'Would love more examples.',
    createdAt: '2025-11-15',
  },
  {
    id: 'c3',
    postId: 'introducing-devhoc',
    author: 'Sam',
    text: 'Congrats on the launch!',
    createdAt: '2025-11-02',
  },
]

export async function fetchComments(): Promise<APIRawComment[]> {
  try {
    const res = await fetch('/api/comments')
    if (!res.ok) throw new Error('Network error')
    const data = await res.json()
    return data as APIRawComment[]
  } catch (err) {
    // fallback to demo data
    return demoComments
  }
}

export async function postComment(payload: {
  postId?: string
  author: string
  text: string
}) {
  try {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Network error')
    return (await res.json()) as APIRawComment
  } catch (err) {
    // local mock: return created item
    return {
      id: `c-${Date.now()}`,
      postId: payload.postId,
      author: payload.author,
      text: payload.text,
      createdAt: new Date().toISOString().slice(0, 10),
    }
  }
}

export async function postReply(payload: {
  commentId: string
  parentReplyId?: string
  author: string
  text: string
}) {
  try {
    const res = await fetch('/api/comments/reply', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Network error')
    return (await res.json()) as APIRawComment
  } catch (err) {
    return {
      id: `r-${Date.now()}`,
      author: payload.author,
      text: payload.text,
      createdAt: new Date().toISOString().slice(0, 10),
    }
  }
}
