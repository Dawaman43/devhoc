import React from 'react'
import { Button } from '@/components/ui/button'

export type Reply = {
  id: string
  author: string
  text: string
  createdAt?: string
  votes?: number
  liked?: boolean
  likesCount?: number
  replies?: Reply[]
}

export type CommentThread = {
  id: string
  author: string
  text: string
  createdAt?: string
  votes?: number
  liked?: boolean
  likesCount?: number
  replies?: Reply[]
}

// store per-user vote/like state in localStorage keys so each user (browser) has 1 vote/like per item
const voteKey = (id: string) => `vote:${id}`
const likeKey = (id: string) => `like:${id}`

function ReplyItem({
  reply,
  onVote,
  onLike,
  onShare,
  onReply,
}: {
  reply: Reply
  onVote: (delta: number) => void
  onLike: () => void
  onShare: () => void
  onReply: (parentReplyId: string, text: string) => void
}) {
  const [showReply, setShowReply] = React.useState(false)
  const [replyText, setReplyText] = React.useState('')

  return (
    <div
      id={`reply-${reply.id}`}
      className="ml-6 mt-2 rounded-md border border-border bg-background px-3 py-2"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{reply.author}</div>
        {reply.createdAt && (
          <div className="text-[10px] text-muted-foreground">
            {reply.createdAt}
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground">{reply.text}</div>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <Button variant="ghost" size="sm" onClick={() => onVote(1)}>
          ▲
        </Button>
        <div className="text-sm">{reply.votes ?? 0}</div>
        <Button variant="ghost" size="sm" onClick={() => onVote(-1)}>
          ▼
        </Button>
        <Button variant="ghost" size="sm" onClick={onLike}>
          {reply.liked ? '👍' : '👍'} {reply.likesCount ?? 0}
        </Button>
        <Button variant="ghost" size="sm" onClick={onShare}>
          Share
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReply((v) => !v)}
        >
          {showReply ? 'Cancel' : 'Reply'}
        </Button>
      </div>

      {showReply && (
        <div className="mt-2 flex items-center gap-2">
          <input
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Reply to this reply (mock)"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => {
              if (replyText.trim()) {
                onReply(reply.id, replyText.trim())
                setReplyText('')
                setShowReply(false)
              }
            }}
          >
            Post
          </Button>
        </div>
      )}

      {!!reply.replies?.length && (
        <div className="mt-2">
          {reply.replies!.map((r) => (
            <ReplyItem
              key={r.id}
              reply={r}
              onVote={(delta) => onVote(delta)}
              onLike={() => onLike()}
              onShare={() =>
                navigator.clipboard.writeText(
                  `${window.location.href}#reply-${r.id}`,
                )
              }
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CommentItem({
  comment,
  onReply,
  onVote,
  onLike,
  onReplyToReply,
  onReplyVote,
  onReplyLike,
  onShare,
}: {
  comment: CommentThread
  onReply: (commentId: string, text: string) => void
  onVote: (commentId: string, delta: number) => void
  onLike: (commentId: string) => void
  onReplyToReply: (
    commentId: string,
    parentReplyId: string,
    text: string,
  ) => void
  onReplyVote: (commentId: string, replyId: string, delta: number) => void
  onReplyLike: (commentId: string, replyId: string) => void
  onShare: (commentId: string) => void
}) {
  const [showReply, setShowReply] = React.useState(false)
  const [replyText, setReplyText] = React.useState('')

  return (
    <div
      id={`comment-${comment.id}`}
      className="rounded-md border border-border bg-background px-3 py-2"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{comment.author}</div>
        {comment.createdAt && (
          <div className="text-[10px] text-muted-foreground">
            {comment.createdAt}
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground">{comment.text}</div>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <Button variant="ghost" size="sm" onClick={() => onVote(comment.id, 1)}>
          ▲
        </Button>
        <div className="text-sm">{comment.votes ?? 0}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVote(comment.id, -1)}
        >
          ▼
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)}>
          {comment.liked ? '👍' : '👍'} {comment.likesCount ?? 0}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onShare(comment.id)}>
          Share
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReply((v) => !v)}
        >
          {showReply ? 'Cancel' : 'Reply'}
        </Button>
      </div>

      {showReply && (
        <div className="mt-2 flex items-center gap-2">
          <input
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Write a reply (mock)"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => {
              if (replyText.trim()) {
                onReply(comment.id, replyText.trim())
                setReplyText('')
                setShowReply(false)
              }
            }}
          >
            Post
          </Button>
        </div>
      )}

      {!!comment.replies?.length && (
        <div className="mt-2">
          {comment.replies!.map((r) => (
            <ReplyItem
              key={r.id}
              reply={r}
              onVote={(delta) => onReplyVote(comment.id, r.id, delta)}
              onLike={() => onReplyLike(comment.id, r.id)}
              onShare={() =>
                navigator.clipboard.writeText(
                  `${window.location.href}#reply-${r.id}`,
                )
              }
              onReply={(parentReplyId, text) =>
                onReplyToReply(comment.id, parentReplyId, text)
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function PostComments({
  initialComments,
}: {
  initialComments: CommentThread[]
}) {
  const [comments, setComments] =
    React.useState<CommentThread[]>(initialComments)
  const [newText, setNewText] = React.useState('')
  const [newAuthor, setNewAuthor] = React.useState('')

  // Helpers to manage localStorage per-user vote/like state
  const getStoredVote = (id: string) =>
    Number(localStorage.getItem(voteKey(id)) ?? 0)
  const setStoredVote = (id: string, v: number) =>
    localStorage.setItem(voteKey(id), String(v))
  const getStoredLike = (id: string) =>
    localStorage.getItem(likeKey(id)) === '1'
  const setStoredLike = (id: string, v: boolean) =>
    localStorage.setItem(likeKey(id), v ? '1' : '0')

  const addComment = () => {
    if (!newAuthor.trim() || !newText.trim()) {
      alert('Please add your name and a comment.')
      return
    }
    const c: CommentThread = {
      id: `c-${Date.now()}`,
      author: newAuthor.trim(),
      text: newText.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      replies: [],
      votes: 0,
      likesCount: 0,
    }
    setComments((prev) => [c, ...prev])
    setNewAuthor('')
    setNewText('')
  }

  const addReplyToComment = (commentId: string, text: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c
        const reply: Reply = {
          id: `r-${Date.now()}`,
          author: 'You',
          text,
          createdAt: new Date().toISOString().slice(0, 10),
          votes: 0,
          likesCount: 0,
          replies: [],
        }
        return { ...c, replies: [...(c.replies ?? []), reply] }
      }),
    )
  }

  // add reply to a reply (nested)
  const addReplyToReply = (
    commentId: string,
    parentReplyId: string,
    text: string,
  ) => {
    const addNested = (replies: Reply[] | undefined): Reply[] => {
      if (!replies) return []
      return replies.map((r) => {
        if (r.id === parentReplyId) {
          const nr: Reply = {
            id: `r-${Date.now()}`,
            author: 'You',
            text,
            createdAt: new Date().toISOString().slice(0, 10),
            votes: 0,
            likesCount: 0,
            replies: [],
          }
          return { ...r, replies: [...(r.replies ?? []), nr] }
        }
        return { ...r, replies: addNested(r.replies) }
      })
    }

    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c
        return { ...c, replies: addNested(c.replies) }
      }),
    )
  }

  const voteComment = (commentId: string, delta: number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c
        const currentVote = getStoredVote(commentId)
        let newVote = currentVote
        let change = 0
        if (delta === 1) {
          if (currentVote === 1) {
            newVote = 0
            change = -1
          } else if (currentVote === -1) {
            newVote = 1
            change = 2
          } else {
            newVote = 1
            change = 1
          }
        } else {
          if (currentVote === -1) {
            newVote = 0
            change = 1
          } else if (currentVote === 1) {
            newVote = -1
            change = -2
          } else {
            newVote = -1
            change = -1
          }
        }
        setStoredVote(commentId, newVote)
        return { ...c, votes: (c.votes ?? 0) + change }
      }),
    )
  }

  const likeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c
        const currentlyLiked = getStoredLike(commentId)
        const liked = !currentlyLiked
        setStoredLike(commentId, liked)
        const likesCount = (c.likesCount ?? 0) + (liked ? 1 : -1)
        return { ...c, liked, likesCount }
      }),
    )
  }

  const voteReply = (commentId: string, replyId: string, delta: number) => {
    const apply = (replies: Reply[] | undefined): Reply[] | undefined => {
      if (!replies) return replies
      return replies.map((r) => {
        if (r.id === replyId) {
          const key = `${commentId}:${replyId}`
          const currentVote = getStoredVote(key)
          let newVote = currentVote
          let change = 0
          if (delta === 1) {
            if (currentVote === 1) {
              newVote = 0
              change = -1
            } else if (currentVote === -1) {
              newVote = 1
              change = 2
            } else {
              newVote = 1
              change = 1
            }
          } else {
            if (currentVote === -1) {
              newVote = 0
              change = 1
            } else if (currentVote === 1) {
              newVote = -1
              change = -2
            } else {
              newVote = -1
              change = -1
            }
          }
          setStoredVote(key, newVote)
          return { ...r, votes: (r.votes ?? 0) + change }
        }
        return { ...r, replies: apply(r.replies) }
      })
    }

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replies: apply(c.replies) } : c,
      ),
    )
  }

  const likeReply = (commentId: string, replyId: string) => {
    const key = `${commentId}:${replyId}`
    const currently = getStoredLike(key)
    setStoredLike(key, !currently)
    const apply = (replies: Reply[] | undefined): Reply[] | undefined => {
      if (!replies) return replies
      return replies.map((r) => {
        if (r.id === replyId) {
          const likesCount = (r.likesCount ?? 0) + (!currently ? 1 : -1)
          return { ...r, liked: !currently, likesCount }
        }
        return { ...r, replies: apply(r.replies) }
      })
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replies: apply(c.replies) } : c,
      ),
    )
  }

  const shareComment = (commentId: string) => {
    navigator.clipboard.writeText(
      `${window.location.href}#comment-${commentId}`,
    )
    alert('Link copied to clipboard')
  }

  const shareReply = (replyId: string) => {
    navigator.clipboard.writeText(`${window.location.href}#reply-${replyId}`)
    alert('Link copied to clipboard')
  }

  return (
    <section className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
      <h2 className="text-sm font-semibold">Comments</h2>
      <div className="flex items-center gap-2">
        <input
          className="w-40 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Your name"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
        />
        <input
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Leave a comment (mock)"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <Button size="sm" onClick={addComment}>
          Post
        </Button>
      </div>
      <div className="space-y-2">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            onReply={addReplyToComment}
            onVote={voteComment}
            onLike={likeComment}
            onReplyToReply={addReplyToReply}
            onReplyVote={voteReply}
            onReplyLike={likeReply}
            onShare={shareComment}
          />
        ))}
        {comments.length === 0 && (
          <div className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </section>
  )
}
