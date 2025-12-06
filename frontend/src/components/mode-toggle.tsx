import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('dark')

  const getSystemTheme = () =>
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

  // Keep `systemTheme` in sync with OS changes so icon updates when theme is 'system'.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setSystemTheme(mq.matches ? 'dark' : 'light')
    // Initialize in case of hydration mismatch
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => {
    const current = theme === 'system' ? getSystemTheme() : theme
    const next = current === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  const effectiveTheme = theme === 'system' ? systemTheme : theme

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggle}
        aria-label="Toggle theme"
        className="relative"
      >
        {effectiveTheme === 'dark' ? (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
