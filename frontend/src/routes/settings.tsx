import { createFileRoute, Outlet, Link, redirect } from '@tanstack/react-router'
import { ModeToggle } from '@/components/mode-toggle'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/settings')({
  beforeLoad: () => {
    const win = typeof window !== 'undefined' ? window : undefined
    if (win) {
      const raw = win.localStorage.getItem('devhoc.auth')
      try {
        const parsed = raw ? JSON.parse(raw) : null
        if (!parsed?.token || !parsed?.user) {
          throw redirect({ to: '/auth/login' })
        }
      } catch {
        throw redirect({ to: '/auth/login' })
      }
    }
  },
  component: Settings,
})

function Settings() {
  const [font, setFont] = useState<string>(() => {
    if (typeof window === 'undefined') return 'system'
    return localStorage.getItem('devhoc.font') || 'system'
  })
  const [accent, setAccent] = useState<string>(() => {
    if (typeof window === 'undefined') return 'blue'
    return localStorage.getItem('devhoc.accent') || 'blue'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('devhoc.font', font)
    document.documentElement.setAttribute('data-font', font)
  }, [font])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('devhoc.accent', accent)
    document.documentElement.style.setProperty('--accent-color', accent)
  }, [accent])

  return (
    <div className="container mx-auto max-w-6xl py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="space-y-2">
          <Link
            to="/settings/profile"
            className="w-full block rounded-md px-3 py-2"
            activeProps={{ className: 'bg-accent/10' }}
          >
            Profile
          </Link>
          <Link
            to="/settings/account"
            className="w-full block rounded-md px-3 py-2"
            activeProps={{ className: 'bg-accent/10' }}
          >
            Account
          </Link>
          <Link
            to="/settings/security"
            className="w-full block rounded-md px-3 py-2"
            activeProps={{ className: 'bg-accent/10' }}
          >
            Security
          </Link>
          <Link
            to="/settings/notifications"
            className="w-full block rounded-md px-3 py-2"
            activeProps={{ className: 'bg-accent/10' }}
          >
            Notifications
          </Link>
          <Link
            to="/settings/integrations"
            className="w-full block rounded-md px-3 py-2"
            activeProps={{ className: 'bg-accent/10' }}
          >
            Integrations
          </Link>

          <div className="mt-6 p-4 rounded-md border bg-card">
            <h3 className="text-sm font-medium mb-2">Appearance</h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium">Theme</span>
              <ModeToggle />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Font</label>
              <select
                className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                value={font}
                onChange={(e) => setFont(e.target.value)}
              >
                <option value="system">System</option>
                <option value="serif">Serif</option>
                <option value="mono">Mono</option>
              </select>
            </div>
          </div>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
