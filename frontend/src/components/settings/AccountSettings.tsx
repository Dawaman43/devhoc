import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { updateMyProfile } from '@/lib/api/users'

export default function AccountSettings() {
  const { user, token, logout, setUser } = useAuth()
  const [email, setEmail] = useState(user?.email ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const save = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!token) return setError('Not signed in')
    setLoading(true)
    try {
      const updated = await updateMyProfile(token, { email: email.trim() })
      setUser(updated)
      setSuccess('Email updated')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Account</h2>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Sign Out
          </button>
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}
      </form>
    </div>
  )
}
