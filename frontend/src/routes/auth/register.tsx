import Auth from '@/components/auth/Auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: () => <Auth authType="register" />,
})

export default Route
