import { createFileRoute } from '@tanstack/react-router'
import { CommentsList } from '@/components/comments/CommentsList'
import { fetchComments } from '@/lib/api/comments'

export const Route = createFileRoute('/comments/')({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData({
      queryKey: ['comments', 'all'],
      queryFn: () => fetchComments(),
    })
  },
  component: CommentsPage,
})

function CommentsPage() {
  const comments = Route.useLoaderData()
  return <CommentsList comments={comments} />
}
