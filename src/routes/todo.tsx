import { createFileRoute } from '@tanstack/react-router'
import { TodoList } from '../components/list'

export const Route = createFileRoute('/todo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <TodoList />
    </div>
  )
}
