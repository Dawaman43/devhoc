import Ask from '@/components/Ask'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ask')({
  component: Ask,
})
