import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/admin/posts')({
  component: PostsAdmin,
})

function PostsAdmin() {
  const { data } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const res = await fetch('/api/search/posts?limit=200')
      const json = await res.json()
      return json.items || []
    },
  })
  return (
    <div className="container mx-auto p-4 space-y-3">
      <h2 className="text-xl font-bold">Posts</h2>
      <div className="text-sm text-muted-foreground">
        View and filter by language and difficulty.
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Author</th>
            <th align="left">Views</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((p: any) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.authorName}</td>
              <td>{p.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
