import Terms from '@/components/Terms'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: Terms,
})
