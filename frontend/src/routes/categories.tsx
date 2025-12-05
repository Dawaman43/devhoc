import Categories from '@/components/Categories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/categories')({
  component: Categories,
})
