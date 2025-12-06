import { createFileRoute } from '@tanstack/react-router'
import { PostsList, Post } from '@/components/posts/PostsList'

const demoPosts: Post[] = [
  {
    id: 'introducing-devhoc',
    title: 'Introducing Devhoc',
    author: 'Team',
    tags: ['announcement', 'devhoc'],
    createdAt: '2025-10-04',
  },
  {
    id: 'tanstack-router',
    title: 'Using TanStack Router',
    author: 'Alex',
    tags: ['router', 'tanstack'],
    createdAt: '2025-11-12',
  },
  {
    id: 'query-best-practices',
    title: 'Query Best Practices',
    author: 'Sam',
    tags: ['data', 'tanstack'],
    createdAt: '2025-09-28',
  },
]

export const Route = createFileRoute('/posts/')({
  component: () => {
    return <PostsList posts={demoPosts} />
  },
})

export default Route
