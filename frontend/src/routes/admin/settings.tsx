import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth/context'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
})

function AdminSettings() {
  const { user } = useAuth()
  if (!user || user.role !== 'ADMIN') {
    return (
      <Navigate to="/admin/login" search={{ redirect: '/admin/settings' }} />
    )
  }
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <div className="text-sm">Admin: {user?.email}</div>
      <div className="text-sm text-muted-foreground">
        Global configuration controls coming soon (lite mode, SSR toggles,
        etc.).
      </div>
    </div>
  )
}
