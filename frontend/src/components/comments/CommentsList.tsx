import { Link } from '@tanstack/react-router'
import type { ApiComment } from '@/lib/api/comments'
import CommentVote from './CommentVote'

export function CommentsList({ comments }: { comments: ApiComment[] }) {
  const grouped = comments.reduce<Record<string, ApiComment[]>>((acc, c) => {
    acc[c.postId] = acc[c.postId] || []
    acc[c.postId].push(c)
    return acc
  }, {})

  const postIds = Object.keys(grouped)

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border bg-linear-to-b from-muted/30 to-background">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold tracking-tight">Comments</h1>
          <p className="text-sm text-muted-foreground">
            Recent comments grouped by post.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {postIds.map((postId) => (
          <div key={postId} className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Post:</span>
                <Link
                  to="/posts/$postId"
                  params={{ postId }}
                  className="text-sm font-semibold hover:underline"
                >
                  {postId}
                </Link>
              </div>
              <Link
                to="/posts/$postId"
                params={{ postId }}
                className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
              >
                View Post
              </Link>
            </div>
            <div className="divide-y divide-border">
              {grouped[postId].map((c) => (
                <div key={c.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">
                      {c.authorName || c.authorId || 'Anonymous'}
                    </div>
                    {c.createdAt && (
                      <div className="text-[10px] text-muted-foreground">
                        {c.createdAt}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-[1fr_auto] gap-4">
                    <div className="text-sm text-muted-foreground">
                      {c.text}
                    </div>
                    <div className="flex items-start">
                      <CommentVote commentId={c.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {postIds.length === 0 && (
          <div className="rounded-xl border border-border p-6 text-center text-sm text-muted-foreground">
            No comments yet.
          </div>
        )}
      </div>
    </div>
  )
}
