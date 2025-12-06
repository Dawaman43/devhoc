import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { AuthUser, LoginResponse } from '@/lib/api/auth'
import { fetchSession } from '@/lib/api/auth'

type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

type AuthState = {
  user: AuthUser | null
  token: string | null
  status: AuthStatus
}

type AuthContextValue = AuthState & {
  isAuthenticated: boolean
  login: (payload: LoginResponse) => void
  logout: () => void
  setUser: (user: AuthUser | null) => void
  refresh: () => Promise<void>
}

const STORAGE_KEY = 'devhoc.auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    token: null,
    status: 'loading',
  }))

  // Hydrate auth state from localStorage on the client
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setState({ user: null, token: null, status: 'anonymous' })
      return
    }
    try {
      const parsed = JSON.parse(raw)
      const token: string | null = parsed?.token ?? null
      const user: AuthUser | null = parsed?.user ?? null
      if (token) {
        setState({ user, token, status: 'authenticated' })
      } else {
        setState({ user: null, token: null, status: 'anonymous' })
      }
    } catch {
      setState({ user: null, token: null, status: 'anonymous' })
    }
  }, [])

  // Persist changes back to storage
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (state.status === 'loading') return
    if (!state.token) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: state.token, user: state.user }),
      )
    } catch {
      // ignore storage quota errors
    }
  }, [state.token, state.user, state.status])

  const login = useCallback((payload: LoginResponse) => {
    setState({ user: payload.user, token: payload.token, status: 'authenticated' })
  }, [])

  const logout = useCallback(() => {
    setState({ user: null, token: null, status: 'anonymous' })
  }, [])

  const setUser = useCallback((user: AuthUser | null) => {
    setState((prev: AuthState) => ({ ...prev, user }))
  }, [])

  const refresh = useCallback(async () => {
    if (!state.token) return
    try {
      const res = await fetchSession(state.token)
      if (res?.ok) {
        setState((prev: AuthState) => ({
          ...prev,
          status: prev.token ? 'authenticated' : 'anonymous',
        }))
      }
    } catch {
      logout()
    }
  }, [state.token, logout])

  useEffect(() => {
    if (state.status !== 'authenticated' || !state.token) return
    refresh()
  }, [state.status, state.token, refresh])

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = state.status === 'authenticated' && !!state.token && !!state.user
    return {
      ...state,
      isAuthenticated,
      login,
      logout,
      setUser,
      refresh,
    }
  }, [state, login, logout, setUser, refresh])

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
