import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Initialize theme with defaultTheme on the server to avoid accessing
  // browser-only APIs (localStorage/window) during SSR. We will read
  // persisted value on mount and update state accordingly.
  const [theme, setTheme] = useState<Theme>(() => defaultTheme)

  // On mount, read stored preference (if any) and update state.
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored) {
        setTheme(stored)
        return
      }
    } catch (e) {
      // ignore localStorage errors
    }

    // If no stored value, keep defaultTheme (which may be 'system')
  }, [storageKey])

  // Update the document class when `theme` changes (client-only).
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, theme)
        } catch (e) {
          // ignore
        }
      }
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
