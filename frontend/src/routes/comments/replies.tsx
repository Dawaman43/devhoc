import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/comments/replies')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/comments/replies"!</div>
}
