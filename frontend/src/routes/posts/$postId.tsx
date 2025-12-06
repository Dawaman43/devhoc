import { createFileRoute } from '@tanstack/react-router'
import { PostDetail } from '@/components/posts/PostDetail'
import { getPost } from '@/lib/api/posts'
import { fetchComments } from '@/lib/api/comments'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context: { queryClient } }) => {
    const { postId } = params
    const post = await queryClient.ensureQueryData({
      queryKey: ['post', postId],
      queryFn: () => getPost(postId),
    })
    const comments = await queryClient.ensureQueryData({
      queryKey: ['comments', postId],
      queryFn: () => fetchComments(postId),
    })
    return { post, comments }
  },
  component: PostDetailRoute,
})

function PostDetailRoute() {
  const { post, comments } = Route.useLoaderData()
  return <PostDetail post={post} comments={comments} />
}

export default Route
