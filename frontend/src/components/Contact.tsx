import { useState } from 'react'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
  subscribe: boolean
}

const initial: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  subscribe: false,
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((s) => ({ ...s, [k]: v }))
  }

  function validate() {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return 'Please enter a valid email.'
    if (!form.message.trim()) return 'Please enter a message.'
    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) return setError(v)

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.text()) || 'Server error')
      setSent(true)
      setForm(initial)
    } catch (err: any) {
      setError(err?.message || 'Failed to send message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold">Contact us</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Have a question, report a bug, or want to contribute? Send us a
            message and we'll get back to you.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {sent && (
              <div className="rounded-md bg-green-50 border border-green-100 p-3 text-sm text-green-800">
                Thanks — your message has been sent.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="text-sm font-medium">Your name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  required
                />
              </label>
            </div>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Subject</span>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => update('subject', e.target.value)}
                className="mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground"
                placeholder="Short summary (optional)"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Message</span>
              <textarea
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                rows={6}
                className="mt-1 px-3 py-2 rounded-md border border-border bg-background text-foreground"
                required
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.subscribe}
                onChange={(e) => update('subscribe', e.target.checked)}
                className="h-4 w-4 rounded border border-border bg-background text-primary"
              />
              <span className="text-sm text-muted-foreground">
                Subscribe to newsletter
              </span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send message'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(initial)
                  setError(null)
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
