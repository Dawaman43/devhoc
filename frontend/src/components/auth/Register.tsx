import { useState } from 'react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password || !name) {
      setError('Please provide name, email and password.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText)
        throw new Error(text || 'Registration failed')
      }

      // After registration, backend may auto-login. Redirect home.
      window.location.href = '/'
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Create an account</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Join Devhoc to ask questions, share knowledge, and collaborate.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      </form>

      <div className="mt-6 space-y-3 border-t border-border pt-4">
        <p className="text-center text-xs uppercase tracking-wide text-muted-foreground">
          Or sign up with
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => (window.location.href = '/api/auth/oauth/google')}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.9 0 7.1 1.4 9.2 3.2l6.9-6.9C36.6 2.7 30.8 0 24 0 14.8 0 6.9 4.8 2.6 12l7.9 6.1C12.3 13.6 17.6 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8.1h12.8c-.6 3.4-2.6 6.2-5.6 8.1l8.6 6.7C44.9 38 46.5 31.6 46.5 24.5z"
              />
              <path
                fill="#4A90E2"
                d="M10.5 29.1A14.8 14.8 0 0110.2 24c0-1.5.3-2.9.8-4.2L2.6 13.7A24 24 0 000 24c0 3.9.9 7.6 2.6 10.9l7.9-5.8z"
              />
              <path
                fill="#FBBC05"
                d="M24 48c6.5 0 12-2.1 16-5.7l-8.6-6.7c-2.4 1.6-5.4 2.5-8.4 2.5-6.4 0-11.7-4.1-13.7-9.7L2.6 35.9C6.9 43.2 14.8 48 24 48z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = '/api/auth/oauth/github')}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.44-2.71 5.42-5.29 5.7.42.37.8 1.09.8 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.41 24 17.09 24 12 24 5.65 18.35.5 12 .5z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </div>
  )
}
