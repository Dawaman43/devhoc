import Auth from '@/components/auth/Auth'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/$authType')({
  component: function AuthRoute() {
    const { authType } = useParams({ from: '/auth/$authType' }) as {
      authType: 'login' | 'register'
    }
    const raw = (authType || '').includes('=')
      ? authType.split('=')[1] || ''
      : authType
    const normalized = raw === 'login' || raw === 'register' ? raw : 'login'
    return <Auth authType={normalized as 'login' | 'register'} />
  },
})

export default Route
