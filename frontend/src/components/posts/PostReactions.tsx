import React, { useEffect, useRef, useState } from 'react'
import { getLikeCount, getMyLike, toggleLike } from '@/lib/api/likes'
import { useAuth } from '@/lib/auth/context'

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡']

export function PostReactions({ postId }: { postId: string }) {
  const { token } = useAuth()
  const [breakdown, setBreakdown] = useState<Record<string, number>>({})
  const [total, setTotal] = useState<number>(0)
  const [myEmoji, setMyEmoji] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const hoverTimeout = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  async function fetchCounts() {
    try {
      const res = await getLikeCount('post', postId)
      setTotal(res?.likes ?? 0)
      setBreakdown(res?.breakdown ?? {})
    } catch (e) {
      // ignore
    }
  }

  async function fetchMy() {
    try {
      const res = await getMyLike('post', postId, token ?? null)
      setMyEmoji(res?.emoji ?? null)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    fetchCounts()
    fetchMy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, token])

  async function onReact(emoji: string) {
    if (!token) {
      // Not authenticated — prompt to login so user knows why nothing happened
      console.warn('PostReactions: user not authenticated')
      try {
        // Try to open /auth route or show simple alert as fallback
        if (window?.location) window.location.href = '/auth/login'
      } catch {
        alert('Please log in to react to posts')
      }
      return
    }
    setLoading(true)
    try {
      await toggleLike('post', postId, token ?? null, emoji)
      await fetchCounts()
      await fetchMy()
    } catch (e) {
      console.error('PostReactions:onReact error', e)
      setError('Could not send reaction. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  function showPicker() {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current)
    setOpen(true)
  }

  function hidePicker() {
    // small delay to allow moving into picker
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current)
    hoverTimeout.current = window.setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!(e.target instanceof Node)) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const currentIcon = myEmoji ?? '👍'

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <button
          className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted/50 ${myEmoji ? 'ring-1 ring-offset-1 ring-primary' : ''}`}
          onMouseEnter={showPicker}
          onMouseLeave={hidePicker}
          onClick={() => setOpen((s) => !s)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="text-lg">{currentIcon}</span>
          <span className="text-xs text-muted-foreground">{total}</span>
        </button>
      </div>

      {open && (
        <div
          onMouseEnter={showPicker}
          onMouseLeave={hidePicker}
          className="absolute z-50 mt-2 flex gap-2 rounded-md border border-border bg-card p-2 shadow-lg"
          role="dialog"
          aria-label="Reactions"
        >
          {EMOJIS.map((e) => {
            const isActive = myEmoji === e
            return (
              <button
                key={e}
                onClick={() => onReact(e)}
                disabled={loading}
                className={`rounded-md px-2 py-1 text-lg transition-colors ${isActive ? 'ring-2 ring-offset-1 ring-primary' : 'hover:bg-muted/50'}`}
                aria-pressed={isActive}
              >
                {e}
                <div className="text-[10px] text-muted-foreground">
                  {breakdown[e] ?? ''}
                </div>
              </button>
            )
          })}
        </div>
      )}
      {error && (
        <div className="mt-1 text-[12px] text-destructive">{error}</div>
      )}
    </div>
  )
}

export default PostReactions
