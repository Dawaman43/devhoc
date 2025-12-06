import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'
import { toggleLike, getLikeCount, getMyLike } from '@/lib/api/likes'

export default function CommentVote({ commentId }: { commentId: string }) {
  const { token } = useAuth()
  const [likes, setLikes] = useState<number>(0)
  const [liked, setLiked] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    // likes
    getLikeCount('comment', commentId)
      .then((r) => {
        if (!mounted) return
        setLikes(r?.likes ?? 0)
      })
      .catch(() => {})
    if (token) {
      getMyLike('comment', commentId, token)
        .then((r) => {
          if (!mounted) return
          setLiked(!!r?.liked)
        })
        .catch(() => {})
    }
    return () => {
      mounted = false
    }
  }, [commentId, token])
  const sendLike = async () => {
    if (!token) return
    setLoading(true)
    try {
      await toggleLike('comment', commentId, token)
      const lc = await getLikeCount('comment', commentId)
      setLikes(lc?.likes ?? 0)
      const ml = await getMyLike('comment', commentId, token)
      setLiked(!!ml?.liked)
    } catch (err) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    try {
      const c = await getVoteCount('comment', commentId)
      setCounts(c ?? { upvotes: 0, downvotes: 0, score: 0 })
      if (token) {
        const my = await getMyVote('comment', commentId, token)
        setMyVote(my?.value ?? null)
      }
    } catch (err) {
      // ignore
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={sendLike}
        disabled={loading}
        className={`p-1 rounded ${liked ? 'bg-accent/20' : ''}`}
        title="Like"
      >
        <Heart size={14} />
      </button>
      <div className="w-8 text-center">{likes ?? 0}</div>
    </div>
  )
}
