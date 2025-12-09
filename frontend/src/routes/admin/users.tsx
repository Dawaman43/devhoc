import { createFileRoute, redirect, Navigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth/context'

export const Route = createFileRoute('/admin/users')({
  beforeLoad: ({ context }) => {
    const user = context?.auth?.user
    if (!user || user.role !== 'ADMIN') {
      throw redirect({
        to: '/auth/login',
        search: { redirect: '/admin/users' },
      })
    }
  },
  component: UsersAdmin,
})

function UsersAdmin() {
  const { user } = useAuth()
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/auth/login" search={{ redirect: '/admin/users' }} />
  }
  const { data } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/search/users?limit=200')
      const json = await res.json()
      return json.items || []
    },
  })
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Users</h2>
      <div className="text-sm mb-2">Admin: {user?.email}</div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Username</th>
            <th align="left">Role</th>
            <th align="left">Reputation</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((u: any) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.reputation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
