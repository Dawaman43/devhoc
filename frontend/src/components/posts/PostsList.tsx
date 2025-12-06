import React from 'react'
import { Input } from '@/components/ui/input'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export type Post = {
  id: string
  title: string
  author: string
  tags?: string[]
  createdAt?: string
}

export function PostsList({ posts }: { posts: Post[] }) {
  const [query, setQuery] = React.useState('')
  const [sort, setSort] = React.useState<'new' | 'old' | 'title'>('new')
  const filtered = posts
    .filter((p) =>
      (p.title + p.author + (p.tags?.join(' ') ?? ''))
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      const da = new Date(a.createdAt ?? 0).getTime()
      const db = new Date(b.createdAt ?? 0).getTime()
      return sort === 'new' ? db - da : da - db
    })

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border bg-linear-to-b from-muted/30 to-background">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
              <p className="text-sm text-muted-foreground">
                Insights, guides, and announcements from Devhoc.
              </p>
            </div>
            <Link
              to="/posts/new"
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              New Post
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search posts by title, author, or tag"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
              />
            </div>
            <DropdownMenu
              label="Sort"
              items={[
                { label: 'Newest', onSelect: () => setSort('new') },
                { label: 'Oldest', onSelect: () => setSort('old') },
                { label: 'Title', onSelect: () => setSort('title') },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="group relative rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    to="/posts/$postId"
                    params={{ postId: p.id }}
                    className="text-base font-semibold tracking-tight hover:underline"
                  >
                    {p.title}
                  </Link>
                  <div className="mt-1 text-xs text-muted-foreground">
                    by {p.author}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {p.createdAt}
                </div>
              </div>
              {!!p.tags?.length && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.tags!.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-2">
                <Link
                  to="/posts/$postId"
                  params={{ postId: p.id }}
                  className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  Read
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/posts/${p.id}`,
                    )
                  }
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-border p-6 text-center text-sm text-muted-foreground">
            No posts found.
          </div>
        )}
      </div>
    </div>
  )
}
