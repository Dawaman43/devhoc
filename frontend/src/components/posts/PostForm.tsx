import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export type PostFormData = {
  title: string
  author: string
  content: string
  tags: string[]
}

export function PostForm() {
  const [title, setTitle] = React.useState(
    localStorage.getItem('post:title') ?? '',
  )
  const [author, setAuthor] = React.useState(
    localStorage.getItem('post:author') ?? '',
  )
  const [tags, setTags] = React.useState<string[]>(() => {
    const raw = localStorage.getItem('post:tags')
    return raw ? JSON.parse(raw) : []
  })
  const [content, setContent] = React.useState(
    localStorage.getItem('post:content') ?? '',
  )

  React.useEffect(() => {
    localStorage.setItem('post:title', title)
  }, [title])
  React.useEffect(() => {
    localStorage.setItem('post:author', author)
  }, [author])
  React.useEffect(() => {
    localStorage.setItem('post:tags', JSON.stringify(tags))
  }, [tags])
  React.useEffect(() => {
    localStorage.setItem('post:content', content)
  }, [content])

  const addTag = (t: string) => {
    const v = t.trim().toLowerCase()
    if (!v) return
    if (!tags.includes(v)) setTags([...tags, v])
  }
  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !author || !content) {
      alert('Please fill out title, author, and content.')
      return
    }
    const payload: PostFormData = { title, author, content, tags }
    console.log('Create post (mock):', payload)
    alert('Post created (mock)!')
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
            <label className="text-sm" htmlFor="author">
              Author
            </label>
            <Input
              id="author"
              name="author"
              placeholder="Your name"
              value={author}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAuthor(e.target.value)
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
            <Button type="submit" variant="default" size="sm">
              Publish
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setTitle('')
                setAuthor('')
                setTags([])
                setContent('')
                localStorage.removeItem('post:title')
                localStorage.removeItem('post:author')
                localStorage.removeItem('post:tags')
                localStorage.removeItem('post:content')
              }}
            >
              Clear
            </Button>
          </div>
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
              by {author || 'Anonymous'}
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
