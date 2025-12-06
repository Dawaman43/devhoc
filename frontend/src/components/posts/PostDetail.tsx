import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export type PostDetailData = {
  title: string
  author: string
  content: string
  tags?: string[]
  createdAt?: string
}

export function PostDetail({ post }: { post: PostDetailData }) {
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

      <section className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
        <h2 className="text-sm font-semibold">Comments</h2>
        <div className="space-y-2">
          {[
            { author: 'Taylor', text: 'Great write-up!' },
            { author: 'Morgan', text: 'Would love more examples.' },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <div className="font-medium">{c.author}</div>
              <div className="text-muted-foreground">{c.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Leave a comment (mock)"
          />
          <Button size="sm" onClick={() => alert('Comment posted (mock)')}>
            Post
          </Button>
        </div>
      </section>
    </article>
  )
}
