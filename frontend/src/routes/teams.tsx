import Teams from '@/components/home/Teams'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teams')({
  component: Teams,
})
