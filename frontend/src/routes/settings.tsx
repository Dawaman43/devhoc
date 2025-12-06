import { createFileRoute, redirect } from '@tanstack/react-router'
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
    <div className="container mx-auto max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <p className="text-muted-foreground mb-4">
            Customize the app to your preferences.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Accent</label>
              <select
                className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
              >
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
