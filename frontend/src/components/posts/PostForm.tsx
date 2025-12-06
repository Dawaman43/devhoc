import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/lib/api/posts'
import { useAuth } from '@/lib/auth/context'

type PostMessage = { type: 'success' | 'error'; text: string }

export function PostForm() {
  const [title, setTitle] = React.useState(
    typeof window === 'undefined'
      ? ''
      : window.localStorage.getItem('post:title') ?? '',
  )
  const [tags, setTags] = React.useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem('post:tags')
    return raw ? JSON.parse(raw) : []
  })
  const [content, setContent] = React.useState(
    typeof window === 'undefined'
      ? ''
      : window.localStorage.getItem('post:content') ?? '',
  )
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<PostMessage | null>(null)
  const navigate = useNavigate()
  const { isAuthenticated, token, user } = useAuth()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('post:title', title)
  }, [title])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('post:tags', JSON.stringify(tags))
  }, [tags])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('post:content', content)
  }, [content])

  const addTag = (t: string) => {
    const v = t.trim().toLowerCase()
    if (!v) return
    setTags((prev) => (prev.includes(v) ? prev : [...prev, v]))
  }

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t))
  }

  const clearDraft = () => {
    setTitle('')
    setTags([])
    setContent('')
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('post:title')
      window.localStorage.removeItem('post:tags')
      window.localStorage.removeItem('post:content')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!isAuthenticated) {
      setMessage({
        type: 'error',
        text: 'Please sign in to publish a post.',
      })
      return
    }

    if (!title.trim() || !content.trim()) {
      setMessage({
        type: 'error',
        text: 'Title and content are required.',
      })
      return
    }

    setLoading(true)
    try {
      const post = await createPost(
        {
          title: title.trim(),
          content: content.trim(),
          tags,
        },
        token,
      )
      setMessage({ type: 'success', text: 'Post published successfully.' })
      clearDraft()
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      if (post?.id) {
        navigate({ to: '/posts/$postId', params: { postId: post.id } })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to publish post.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Post</h1>
        <Link
          to="/posts"
          className="text-xs text-muted-foreground hover:underline"
        >
          Back to list
        </Link>
      </div>
      {!isAuthenticated && (
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          Sign in to publish. Your draft is stored locally until you submit.
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="title">
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Post title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="tags">
              Tags
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="tags"
                placeholder="Add a tag and press Enter"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag((e.target as HTMLInputElement).value)
                    ;(e.target as HTMLInputElement).value = ''
                  }
                }}
              />
            </div>
            {!!tags.length && (
              <div className="flex flex-wrap gap-1">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-accent"
                    onClick={() => removeTag(t)}
                  >
                    #{t} ×
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              className="min-h-60 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Write your post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" variant="default" size="sm" disabled={loading || !isAuthenticated}>
              {loading ? 'Publishing…' : 'Publish'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearDraft}>
              Clear
            </Button>
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
        </form>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Live Preview</h2>
            <span className="text-[10px] text-muted-foreground">
              Autosaved locally
            </span>
          </div>
          <div className="mt-3">
            <div className="text-base font-semibold">
              {title || 'Untitled post'}
            </div>
            <div className="text-xs text-muted-foreground">
              by {user?.name || user?.email || 'Anonymous'}
            </div>
            {!!tags.length && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
            <div className="prose dark:prose-invert mt-4 max-w-none">
              <p>{content || 'Start writing your post to see the preview.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
