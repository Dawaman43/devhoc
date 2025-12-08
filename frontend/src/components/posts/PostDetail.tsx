import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { PostComments } from './PostComments'
import PostReactions from './PostReactions'
import FollowButton from '@/components/profile/FollowButton'
import { Avatar } from '@/components/ui/avatar'
import type { ApiComment } from '@/lib/api/comments'
import type { ApiPost } from '@/lib/api/posts'
export type PostDetailData = ApiPost

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleString()
  } catch {
    return dateStr
  }
}

export function PostDetail({
  post,
  comments,
}: {
  post: PostDetailData
  comments?: ApiComment[]
}) {
  // lightweight translation helper — if `react-i18next` is installed it will initialize
  // via `src/i18n.ts`, but keep a local fallback to avoid hard dependency at compile time.
  const t = (k: string) => k

  // `ApiPost` may not include `authorAvatar`/`authorName` in its type — coerce safely.
  const authorName = (post as any).authorName ?? undefined
  const authorAvatar = (post as any).authorAvatar ?? undefined
  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        await (navigator as any).share({ title: post.title, url })
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(url)
        // small feedback — replace with toast when available
        // eslint-disable-next-line no-alert
        alert('Link copied to clipboard')
      }
    } catch (e) {
      // ignore share errors (user cancel, etc.)
    }
  }

  return (
    <article className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-border bg-linear-to-b from-muted/30 to-background">
        <div className="px-6 py-6">
          <div className="md:flex md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <Avatar
                className="h-12 w-12"
                src={authorAvatar}
                alt={authorName}
                name={authorName}
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {post.title}
                </h1>
                <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
                  <Link
                    to="/users/$userId"
                    params={{ userId: post.authorId ?? '' }}
                    className="font-medium hover:underline"
                  >
                    {post.authorName || t('anonymous')}
                  </Link>
                  {post.authorId && <FollowButton userId={post.authorId} />}
                  {post.createdAt && (
                    <time
                      className="text-xs text-muted-foreground"
                      dateTime={post.createdAt}
                    >
                      {formatDate(post.createdAt)}
                    </time>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {!!post.tags?.length &&
                    post.tags!.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-muted/40 px-3 py-1 text-[11px] text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 md:mt-0">
              <PostReactions postId={post.id} />
              <Button variant="ghost" size="sm" onClick={share}>
                <Share2 className="mr-2 h-4 w-4" />
                {t('share')}
              </Button>
              <Link
                to="/posts"
                className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
              >
                {t('back')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none rounded-xl border border-border bg-card p-6">
        <p className="whitespace-pre-wrap">
          {post.content || 'This post does not contain any content yet.'}
        </p>
      </div>

      <PostComments postId={post.id} initialComments={comments ?? []} />
    </article>
  )
}
