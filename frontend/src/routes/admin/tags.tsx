import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/admin/tags')({
  component: TagsAdmin,
})

function TagsAdmin() {
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
