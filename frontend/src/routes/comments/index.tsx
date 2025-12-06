import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { CommentsList, Comment } from '@/components/comments/CommentsList'
import { fetchComments } from '@/lib/api/comments'

function CommentsPage() {
  const [comments, setComments] = React.useState<Comment[]>([])

  React.useEffect(() => {
    let mounted = true
    fetchComments().then((data) => {
      if (!mounted) return
      // map to Comment type (postId default empty)
      const mapped: Comment[] = data.map((c) => ({
        id: c.id,
        postId: c.postId ?? '',
        author: c.author,
        text: c.text,
        createdAt: c.createdAt,
      }))
      setComments(mapped)
    })
    return () => {
      mounted = false
    }
  }, [])

  return <CommentsList comments={comments} />
}

export const Route = createFileRoute('/comments/')({
  component: CommentsPage,
})
