import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/reports')({
  component: ReportsAdmin,
})

function ReportsAdmin() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Reports</h2>
      <p className="text-muted-foreground">Moderation queue coming soon.</p>
    </div>
  )
}
