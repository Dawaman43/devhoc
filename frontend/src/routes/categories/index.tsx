import Categories from '@/components/categories/Categories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/')({
  component: Categories,
})
