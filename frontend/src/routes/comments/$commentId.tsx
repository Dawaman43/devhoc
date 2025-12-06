import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/comments/$commentId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/comments/$commentId"!</div>
}
