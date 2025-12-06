import { createFileRoute } from '@tanstack/react-router'
import { PostsList } from '@/components/posts/PostsList'
import { listPosts } from '@/lib/api/posts'

export const Route = createFileRoute('/posts/')({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData({
      queryKey: ['posts'],
      queryFn: listPosts,
    })
  },
  component: PostsPage,
})

function PostsPage() {
  const posts = Route.useLoaderData()
  return <PostsList posts={posts} />
}

export default Route
