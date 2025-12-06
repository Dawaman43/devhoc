import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/context'
import CommentVote from '@/components/comments/CommentVote'
import {
  type ApiComment,
  fetchComments,
  createComment,
  createReply,
} from '@/lib/api/comments'

export type CommentThread = CommentNode

type CommentNode = {
  id: string
  authorName?: string | null
  text: string
  createdAt?: string
  parentReplyId?: string | null
  rootId: string
  replies: CommentNode[]
}

type ReplyInput = {
  commentId: string
  parentReplyId?: string | null
  text: string
}

type MessageState = { type: 'success' | 'error'; text: string } | null

export function PostComments({
  postId,
  initialComments = [],
}: {
  postId: string
  initialComments?: ApiComment[]
}) {
  const { isAuthenticated, token, user } = useAuth()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')
  const [message, setMessage] = useState<MessageState>(null)

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    initialData: initialComments,
  })

  const commentMutation = useMutation({
    mutationFn: (text: string) =>
      createComment(
        {
          postId,
          text,
        },
        token,
      ),
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Comment added.' })
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['comments', 'all'] })
    },
    onError: (err: any) => {
      setMessage({
        type: 'error',
        text: err?.message || 'Unable to add comment right now.',
      })
    },
  })

  const replyMutation = useMutation({
    mutationFn: (input: ReplyInput) =>
      createReply(
        {
          commentId: input.commentId,
          parentReplyId: input.parentReplyId ?? undefined,
          text: input.text,
        },
        token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['comments', 'all'] })
    },
    onError: (err: any) => {
      setMessage({
        type: 'error',
        text: err?.message || 'Unable to post reply right now.',
      })
    },
  })

  const threads = useMemo(
    () => buildCommentTree(commentsQuery.data ?? []),
    [commentsQuery.data],
  )

  const submitComment = async () => {
    setMessage(null)
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Sign in to join the discussion.' })
      return
    }
    if (!newComment.trim()) {
      setMessage({ type: 'error', text: 'Add a message before submitting.' })
      return
    }
    await commentMutation.mutateAsync(newComment.trim())
    setNewComment('')
  }

  const handleReply = async (input: ReplyInput) => {
    setMessage(null)
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Sign in to reply.' })
      throw new Error('unauthenticated')
    }
    if (!input.text.trim()) {
      throw new Error('Reply cannot be empty')
    }
    await replyMutation.mutateAsync({
      commentId: input.commentId,
      parentReplyId: input.parentReplyId,
      text: input.text.trim(),
    })
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Comments</h2>
        <span className="text-[10px] text-muted-foreground">
          {threads.length} total
        </span>
      </div>

      <div className="space-y-2">
        <textarea
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          rows={3}
          placeholder={
            isAuthenticated
              ? 'Share your thoughts'
              : 'Sign in to leave a comment'
          }
          value={newComment}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setNewComment(e.target.value)
          }
          disabled={!isAuthenticated || commentMutation.isPending}
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {user
              ? `Commenting as ${user.name}`
              : 'Sign in to enable commenting'}
          </div>
          <Button
            size="sm"
            disabled={!isAuthenticated || commentMutation.isPending}
            onClick={submitComment}
          >
            {commentMutation.isPending ? 'Posting…' : 'Post comment'}
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        {threads.length === 0 && (
          <div className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            No comments yet. Start the conversation!
          </div>
        )}
        {threads.map((node) => (
          <CommentItem
            key={node.id}
            node={node}
            depth={0}
            canReply={isAuthenticated}
            onReply={handleReply}
            isReplying={replyMutation.isPending}
          />
        ))}
      </div>
    </section>
  )
}

function CommentItem({
  node,
  depth,
  canReply,
  onReply,
  isReplying,
}: {
  node: CommentNode
  depth: number
  canReply: boolean
  onReply: (input: ReplyInput) => Promise<void>
  isReplying: boolean
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const submitReply = async () => {
    setLocalError(null)
    try {
      await onReply({
        commentId: node.rootId,
        parentReplyId: depth === 0 ? undefined : node.id,
        text: replyText,
      })
      setReplyText('')
      setShowReply(false)
    } catch (err: any) {
      setLocalError(err?.message || 'Unable to post reply.')
    }
  }

  return (
    <div
      className="rounded-md border border-border bg-background px-3 py-2"
      id={`comment-${node.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {node.authorName || 'Anonymous'}
        </div>
        {node.createdAt && (
          <div className="text-[10px] text-muted-foreground">
            {node.createdAt}
          </div>
        )}
      </div>
      <div className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
        {node.text}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <CommentVote commentId={node.id} rootId={node.rootId} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.href.split('#')[0]}#comment-${node.id}`,
            )
          }}
        >
          Share
        </Button>
        {canReply && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReply((v) => !v)}
          >
            {showReply ? 'Cancel' : 'Reply'}
          </Button>
        )}
      </div>

      {showReply && (
        <div className="mt-2 space-y-2">
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            rows={2}
            value={replyText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setReplyText(e.target.value)
            }
            placeholder="Write a reply"
            disabled={isReplying}
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Replying within this thread
            </div>
            <Button size="sm" disabled={isReplying} onClick={submitReply}>
              {isReplying ? 'Sending…' : 'Post reply'}
            </Button>
          </div>
          {localError && (
            <div className="text-xs text-red-600">{localError}</div>
          )}
        </div>
      )}

      {node.replies.length > 0 && (
        <div className="mt-3 space-y-3 border-l border-border pl-4">
          {node.replies.map((child) => (
            <CommentItem
              key={child.id}
              node={child}
              depth={depth + 1}
              canReply={canReply}
              onReply={onReply}
              isReplying={isReplying}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function buildCommentTree(items: ApiComment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>()
  for (const item of items) {
    nodes.set(item.id, {
      id: item.id,
      authorName: item.authorName ?? item.authorId,
      text: item.text,
      createdAt: item.createdAt,
      parentReplyId: item.parentReplyId ?? null,
      rootId: item.id,
      replies: [],
    })
  }

  const roots: CommentNode[] = []
  for (const item of items) {
    const node = nodes.get(item.id)!
    const parentId = item.parentReplyId
    if (parentId) {
      const parent = nodes.get(parentId)
      if (parent) {
        node.rootId = parent.rootId || parent.id
        parent.replies.push(node)
        continue
      }
    }
    node.rootId = node.id
    roots.push(node)
  }

  const sortNodes = (list: CommentNode[]) => {
    list.sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt))
    list.forEach((item) => sortNodes(item.replies))
    return list
  }

  return sortNodes(roots)
}

function dateValue(value?: string) {
  if (!value) return 0
  const time = Date.parse(value)
  return Number.isNaN(time) ? 0 : time
}
