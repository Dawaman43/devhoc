import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { isFollowingMe, toggleFollow, getFollowersCount } from '@/lib/api/users'
import { Button } from '@/components/ui/button'

export function FollowButton({ userId }: { userId: string }) {
  const { token, isAuthenticated } = useAuth()
  const [following, setFollowing] = useState<boolean>(false)
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await getFollowersCount(userId)
        if (!mounted) return
        setCount(res?.count ?? 0)
      } catch (e) {
        // ignore
      }
      try {
        const me = await isFollowingMe(userId, token ?? null)
        if (!mounted) return
        setFollowing(me?.following ?? false)
      } catch (e) {
        // ignore
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [userId, token])

  async function onToggle() {
    if (!isAuthenticated || !token) {
      // redirect to login
      try {
        if (typeof window !== 'undefined') window.location.href = '/auth/login'
      } catch {
        // noop
      }
      return
    }
    setLoading(true)
    try {
      const res = await toggleFollow(userId, token ?? null)
      if (res?.action === 'followed') {
        setFollowing(true)
        setCount((c) => (c ?? 0) + 1)
      } else if (res?.action === 'unfollowed') {
        setFollowing(false)
        setCount((c) => Math.max(0, (c ?? 1) - 1))
      }
    } catch (e) {
      console.error('follow toggle error', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={following ? 'secondary' : 'default'}
        onClick={onToggle}
        disabled={loading}
      >
        {following ? 'Following' : 'Follow'}
      </Button>
      {count !== null && (
        <div className="text-xs text-muted-foreground">
          {count} follower{count === 1 ? '' : 's'}
        </div>
      )}
    </div>
  )
}

export default FollowButton
