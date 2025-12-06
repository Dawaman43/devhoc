import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { changePassword } from '@/lib/api/auth'

export default function SecuritySettings() {
  const { token, logout } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!token) return setError('Not signed in')
    if (newPassword.length < 8)
      return setError('New password must be at least 8 characters')
    if (newPassword !== confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      await changePassword(token, { oldPassword, newPassword })
      setSuccess('Password changed successfully')
      setOldPassword('')
      setNewPassword('')
      setConfirm('')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Security</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Current Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Confirm New Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Change Password'}
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
