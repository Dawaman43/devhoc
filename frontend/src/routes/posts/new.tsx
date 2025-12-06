import { createFileRoute, redirect } from '@tanstack/react-router'
import { PostForm } from '@/components/posts/PostForm'

export const Route = createFileRoute('/posts/new')({
  beforeLoad: () => {
    const win = typeof window !== 'undefined' ? window : undefined
    if (win) {
      const raw = win.localStorage.getItem('devhoc.auth')
      try {
        const parsed = raw ? JSON.parse(raw) : null
        if (!parsed?.token || !parsed?.user) {
          throw redirect({ to: '/auth/login' })
        }
      } catch {
        throw redirect({ to: '/auth/login' })
      }
    }
  },
  component: () => <PostForm />,
})

export default Route
