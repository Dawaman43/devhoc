import { createFileRoute } from '@tanstack/react-router'
import NotificationsSettings from '@/components/settings/NotificationsSettings'

export const Route = createFileRoute('/settings/notifications')({
  component: NotificationsSettings,
})

export default Route
