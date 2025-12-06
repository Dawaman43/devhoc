import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createPost } from '@/lib/api/posts'
import { useAuth } from '@/lib/auth/context'

export default function Ask() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [preview, setPreview] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, token } = useAuth()
  const queryClient = useQueryClient()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Please sign in to submit a question.' })
      return
    }

    if (!title.trim() || !content.trim()) {
      setMessage({
        type: 'error',
        text: 'Please provide both a title and a question body.',
      })
      return
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    setLoading(true)
    try {
      const post = await createPost(payload, token)
      setMessage({ type: 'success', text: 'Question submitted successfully.' })
      setTitle('')
      setContent('')
      setTags('')
      setPreview(false)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      if (post?.id) {
        navigate({ to: '/posts/$postId', params: { postId: post.id } })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Submission failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold">Ask a question</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Share a clear, focused question so the community can help. Provide
            code, context and expected outcome where relevant.
          </p>

          {!isAuthenticated && (
            <div className="mt-4 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Please sign in to publish a question. You can draft your content
              below and submit once logged in.
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Summarize your question in one sentence"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium">
                Details
              </label>
              <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm font-mono"
                placeholder={`Explain what you tried, include relevant code or error output.`}
                required
              />
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <div>{content.length} characters</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreview((p) => !p)}
                    className="rounded px-2 py-1 text-sm hover:underline"
                  >
                    {preview ? 'Hide preview' : 'Toggle preview'}
                  </button>
                </div>
              </div>
            </div>

            {preview && (
              <div className="rounded border bg-muted p-4 text-sm">
                <h3 className="font-semibold">Preview</h3>
                <div className="mt-2 whitespace-pre-wrap">
                  {content || (
                    <em className="text-muted-foreground">
                      Nothing to preview
                    </em>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="tags" className="block text-sm font-medium">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                name="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                placeholder="e.g. javascript, react, tailwind"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !isAuthenticated}
                className={`inline-flex items-center rounded bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60`}
              >
                {loading ? 'Submitting…' : 'Post question'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle('')
                  setContent('')
                  setTags('')
                  setMessage(null)
                  setPreview(false)
                }}
                className="text-sm text-muted-foreground hover:underline"
              >
                Reset
              </button>
            </div>

            <div role="status" aria-live="polite">
              {message && (
                <div
                  className={`mt-2 rounded px-3 py-2 text-sm ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
