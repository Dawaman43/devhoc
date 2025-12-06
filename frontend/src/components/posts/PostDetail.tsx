import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { PostComments } from './PostComments'
import PostReactions from './PostReactions'
import type { ApiComment } from '@/lib/api/comments'
import type { ApiPost } from '@/lib/api/posts'
export type PostDetailData = ApiPost

export function PostDetail({
  post,
  comments,
}: {
  post: PostDetailData
  comments?: ApiComment[]
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
                by {post.authorName || 'Anonymous'}
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
              <PostReactions postId={post.id} />
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const url =
                    typeof window !== 'undefined' ? window.location.href : ''
                  try {
                    if (
                      typeof navigator !== 'undefined' &&
                      (navigator as any).share
                    ) {
                      await (navigator as any).share({ title: post.title, url })
                    } else {
                      await navigator.clipboard.writeText(url)
                      // small feedback — use alert as simple fallback
                      // you can replace with your toast later
                      // eslint-disable-next-line no-alert
                      alert('Link copied to clipboard')
                    }
                  } catch (e) {
                    // ignore share errors (user cancel, etc.)
                  }
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
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
        <p>{post.content || 'This post does not contain any content yet.'}</p>
      </div>

      <PostComments postId={post.id} initialComments={comments ?? []} />
    </article>
  )
}
