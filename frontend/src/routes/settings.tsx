import { createFileRoute, redirect } from '@tanstack/react-router'
import { ModeToggle } from '@/components/mode-toggle'
import { useEffect, useState } from 'react'
import ProfileEditor from '@/components/profile/ProfileEditor'
import AccountSettings from '@/components/settings/AccountSettings'
import SecuritySettings from '@/components/settings/SecuritySettings'
import NotificationsSettings from '@/components/settings/NotificationsSettings'
import IntegrationsSettings from '@/components/settings/IntegrationsSettings'

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
  const [active, setActive] = useState<
    'profile' | 'account' | 'security' | 'notifications' | 'integrations'
  >('profile')
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
          <button
            onClick={() => setActive('profile')}
            className={`w-full text-left rounded-md px-3 py-2 ${active === 'profile' ? 'bg-accent/10' : ''}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActive('account')}
            className={`w-full text-left rounded-md px-3 py-2 ${active === 'account' ? 'bg-accent/10' : ''}`}
          >
            Account
          </button>
          <button
            onClick={() => setActive('security')}
            className={`w-full text-left rounded-md px-3 py-2 ${active === 'security' ? 'bg-accent/10' : ''}`}
          >
            Security
          </button>
          <button
            onClick={() => setActive('notifications')}
            className={`w-full text-left rounded-md px-3 py-2 ${active === 'notifications' ? 'bg-accent/10' : ''}`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActive('integrations')}
            className={`w-full text-left rounded-md px-3 py-2 ${active === 'integrations' ? 'bg-accent/10' : ''}`}
          >
            Integrations
          </button>

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
          {active === 'profile' && <ProfileEditor />}
          {active === 'account' && <AccountSettings />}
          {active === 'security' && <SecuritySettings />}
          {active === 'notifications' && <NotificationsSettings />}
          {active === 'integrations' && <IntegrationsSettings />}
        </main>
      </div>
    </div>
  )
}
