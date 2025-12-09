import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth/context'
import { login } from '@/lib/api/auth'
import React from 'react'

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
})

function AdminLogin() {
  const { isAuthenticated, user, login: setAuth } = useAuth()
  const [email, setEmail] = React.useState('admin@gmail.com')
  const [password, setPassword] = React.useState('12345678')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  if (isAuthenticated && user?.role === 'ADMIN') {
    return <Navigate to="/admin" />
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await login({ email, password })
      if (res?.token && res?.user?.role === 'ADMIN') {
        setAuth(res)
      } else {
        setError('Not an admin account')
      }
    } catch (err: any) {
      setError(String(err?.message ?? 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm border rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="mt-3 text-xs text-muted-foreground">
          Need a regular account? <Link to="/auth/login">User login</Link>
        </div>
      </div>
    </div>
  )
}
