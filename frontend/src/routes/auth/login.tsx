import Auth from '@/components/auth/Auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: () => <Auth authType="login" />,
})

export default Route
