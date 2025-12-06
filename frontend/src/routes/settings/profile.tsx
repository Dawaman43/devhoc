import { createFileRoute } from '@tanstack/react-router'
import ProfileEditor from '@/components/profile/ProfileEditor'

export const Route = createFileRoute('/settings/profile')({
  component: ProfileEditor,
})

export default Route
