import { createFileRoute, redirect, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth/context'

export const Route = createFileRoute('/admin/reports')({
  beforeLoad: ({ context }) => {
    const user = context?.auth?.user
    if (!user || user.role !== 'ADMIN') {
      throw redirect({
        to: '/auth/login',
        search: { redirect: '/admin/reports' },
      })
    }
  },
  component: ReportsAdmin,
})

function ReportsAdmin() {
  const { user } = useAuth()
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/auth/login" search={{ redirect: '/admin/reports' }} />
  }
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Reports</h2>
      <div className="text-sm mb-2">Admin: {user?.email}</div>
      <p className="text-muted-foreground">Moderation queue coming soon.</p>
    </div>
  )
}
