import { createFileRoute, useParams } from '@tanstack/react-router'
import { PostDetail } from '@/components/posts/PostDetail'
import type { CommentThread } from '@/components/posts/PostComments'

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

    const demoCommentsByPost: Record<string, CommentThread[]> = {
      'introducing-devhoc': [
        {
          id: 'c1',
          author: 'Taylor',
          text: 'Great write-up!',
          createdAt: '2025-11-01',
          replies: [
            {
              id: 'r1',
              author: 'Alex',
              text: 'Appreciate it!',
              createdAt: '2025-11-02',
            },
          ],
        },
        {
          id: 'c2',
          author: 'Sam',
          text: 'Congrats on the launch!',
          createdAt: '2025-11-02',
        },
      ],
      'tanstack-router': [
        {
          id: 'c3',
          author: 'Morgan',
          text: 'Would love more examples.',
          createdAt: '2025-11-15',
        },
      ],
    }
    const initialComments = demoCommentsByPost[postId] ?? []

    return <PostDetail post={post} comments={initialComments} />
  },
})

export default Route
