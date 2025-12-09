import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
})

function AdminSettings() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <div className="text-sm text-muted-foreground">
        Global configuration controls coming soon (lite mode, SSR toggles,
        etc.).
      </div>
    </div>
  )
}
