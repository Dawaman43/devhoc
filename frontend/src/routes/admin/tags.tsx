import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth/context'

export const Route = createFileRoute('/admin/tags')({
  component: TagsAdmin,
})

function TagsAdmin() {
  const { user } = useAuth()
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" search={{ redirect: '/admin/tags' }} />
  }
  const { data } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const res = await fetch('/api/search/tags')
      const json = await res.json()
      return json.items || []
    },
  })
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Tags</h2>
      <div className="text-sm mb-2">Admin: {user?.email}</div>
      <ul className="space-y-2">
        {data?.map((t: any) => (
          <li key={t.id}>
            <span className="inline-flex items-center gap-2">
              <span className="font-medium">{t.name}</span>
              <span className="text-muted-foreground">({t.count})</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
