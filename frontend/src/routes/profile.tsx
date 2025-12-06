import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { fetchMyProfile, updateMyProfile } from '@/lib/api/users'
import { createFileRoute } from '@tanstack/react-router'

function ProfileComponent() {
  const { user, token, setUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let mounted = true
    fetchMyProfile(token)
      .then((data) => {
        if (!mounted) return
        setName(data.name ?? '')
        setEmail(data.email ?? '')
        setAvatarUrl((data as any).avatarUrl ?? '')
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [token])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!token) return setError('You must be signed in')
    if (name.trim().length < 2)
      return setError('Full name must be at least 2 characters')
    setLoading(true)
    try {
      const updated = await updateMyProfile(token, {
        name: name.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      })
      setUser(updated)
      setSuccess('Profile updated')
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-md border border-border bg-card p-6">
      <h2 className="text-2xl font-semibold">Your profile</h2>
      <form onSubmit={save} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Avatar URL</label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Save profile'}
          </button>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}
        </div>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
})

export default ProfileComponent
