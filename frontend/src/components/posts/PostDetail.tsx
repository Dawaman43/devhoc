import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PostComments, CommentThread } from './PostComments'

export type PostDetailData = {
  title: string
  author: string
  content: string
  tags?: string[]
  createdAt?: string
}

export function PostDetail({
  post,
  comments,
}: {
  post: PostDetailData
  comments?: CommentThread[]
}) {
  return (
    <article className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border bg-linear-to-b from-muted/30 to-background">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {post.title}
              </h1>
              <div className="mt-1 text-xs text-muted-foreground">
                by {post.author}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {!!post.tags?.length &&
                  post.tags!.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                {post.createdAt && (
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    {post.createdAt}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
              >
                Copy Link
              </Button>
              <Link
                to="/posts"
                className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none rounded-xl border border-border bg-card p-6">
        <p>{post.content}</p>
      </div>

      <PostComments initialComments={comments ?? []} />
    </article>
  )
}
