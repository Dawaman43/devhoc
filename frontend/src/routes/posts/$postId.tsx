import { createFileRoute, useParams } from '@tanstack/react-router'
import { PostDetail } from '@/components/posts/PostDetail'

const demoContent: Record<
  string,
  {
    title: string
    author: string
    content: string
    tags?: string[]
    createdAt?: string
  }
> = {
  'introducing-devhoc': {
    title: 'Introducing Devhoc',
    author: 'Team',
    createdAt: '2025-10-04',
    tags: ['announcement', 'devhoc'],
    content:
      'Welcome to Devhoc! This is a demo post showcasing the routing system and UI patterns used across the app.',
  },
  'tanstack-router': {
    title: 'Using TanStack Router',
    author: 'Alex',
    createdAt: '2025-11-12',
    tags: ['router', 'tanstack'],
    content:
      'TanStack Router provides file-based routing with great type-safety and ergonomics. This page is rendered via a dynamic route.',
  },
  'query-best-practices': {
    title: 'Query Best Practices',
    author: 'Sam',
    createdAt: '2025-09-28',
    tags: ['data', 'tanstack'],
    content:
      'Caching, background refetching, and sensible query keys help scale your data fetching strategy. Keep your components lean!',
  },
}

export const Route = createFileRoute('/posts/$postId')({
  component: () => {
    const { postId } = useParams({ from: '/posts/$postId' })
    const post = demoContent[postId] ?? {
      title: `Post: ${postId}`,
      author: 'Unknown',
      content: 'This is a placeholder for an unknown post id.',
    }

    return <PostDetail post={post} />
  },
})

export default Route
