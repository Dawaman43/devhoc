import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { updateMyProfile, fetchMyProfile } from '@/lib/api/users'
import AvatarSelectionModal from './AvatarSelectionModal'
import { Camera, User, Mail, Globe, FileText } from 'lucide-react'

export default function ProfileEditor() {
  const { user, token, setUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '')
  const [bio, setBio] = useState(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('devhoc.profile.bio') || ''
  })
  const [website, setWebsite] = useState(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('devhoc.profile.website') || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  useEffect(() => {
    if (!token) return
    let mounted = true
    fetchMyProfile(token)
      .then((data) => {
        if (!mounted) return
        setName(data.name ?? '')
        setUsername((data as any).username ?? '')
        setEmail(data.email ?? '')
        setAvatarUrl((data as any).avatarUrl ?? '')
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [token])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('devhoc.profile.bio', bio)
  }, [bio])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('devhoc.profile.website', website)
  }, [website])

  const save = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!token) return setError('You must be signed in')
    if (name.trim().length < 2)
      return setError('Full name must be at least 2 characters')
    const uname = username.trim()
    if (uname && !/^[a-z0-9._-]{2,30}$/.test(uname))
      return setError(
        'Username may contain letters, numbers, ., _, - and be 2-30 characters',
      )
    setLoading(true)
    try {
      const updated = await updateMyProfile(token, {
        name: name.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        username: uname || undefined,
      })
      setUser(updated)
      setSuccess('Profile updated successfully')
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your public profile and account settings.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Sidebar / Avatar Section */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-lg bg-muted">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={name || 'avatar'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground bg-muted">
                      {(name || 'U').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform hover:scale-105"
                  title="Change Avatar"
                >
                  <Camera size={18} />
                </button>
              </div>

              <h3 className="mt-4 text-xl font-semibold">{name || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        {/* Main Form Section */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <form onSubmit={save} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Public Profile</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText size={16} /> Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a little about yourself"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {bio.length}/500
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe size={16} /> Website
                  </label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-medium">Account Information</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User size={16} /> Username
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                    @
                  </span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex h-10 w-full rounded-r-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    placeholder="your-username"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose a unique username (letters, numbers, ., _, -)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setName(user?.name ?? '')
                  setEmail(user?.email ?? '')
                  setAvatarUrl((user as any)?.avatarUrl ?? '')
                  setBio(localStorage.getItem('devhoc.profile.bio') || '')
                  setWebsite(
                    localStorage.getItem('devhoc.profile.website') || '',
                  )
                  setSuccess(null)
                  setError(null)
                }}
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Reset Changes
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>

      <AvatarSelectionModal
        open={isAvatarModalOpen}
        onOpenChange={setIsAvatarModalOpen}
        currentAvatarUrl={avatarUrl}
        onSelect={setAvatarUrl}
      />
    </div>
  )
}
