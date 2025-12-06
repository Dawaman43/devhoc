import { createFileRoute } from '@tanstack/react-router'
import SearchPage from '@/components/search/SearchPage'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})
