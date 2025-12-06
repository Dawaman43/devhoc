import { createFileRoute } from '@tanstack/react-router'
import { PostForm } from '@/components/posts/PostForm'

export const Route = createFileRoute('/posts/new')({
  component: () => <PostForm />,
})

export default Route
