import { createFileRoute, useParams, Link } from '@tanstack/react-router'

const demoCategories: Record<
  string,
  {
    title: string
    description?: string
    posts: { id: string; title: string; excerpt?: string }[]
  }
> = {
  frontend: {
    title: 'Frontend',
    description: 'Articles about UI, components and web UX improvements.',
    posts: [
      {
        id: 'introducing-devhoc',
        title: 'Introducing Devhoc',
        excerpt: 'Overview of the project and goals.',
      },
      {
        id: 'tanstack-router',
        title: 'Using TanStack Router',
        excerpt: 'File-based routing and patterns.',
      },
    ],
  },
  tooling: {
    title: 'Tooling',
    description: 'Build tools, linters, formatters and dev experience topics.',
    posts: [
      {
        id: 'query-best-practices',
        title: 'Query Best Practices',
        excerpt: 'Tips for caching and fetching.',
      },
    ],
  },
}

export const Route = createFileRoute('/categories/$categoriesId')({
  component: () => {
    const { categoriesId } = useParams({
      from: '/categories/$categoriesId',
    }) as { categoriesId: string }

    const cat = demoCategories[categoriesId]

    if (!cat) {
      return (
        <div className="prose">
          <h1>Category not found</h1>
          <p>
            No category matches <strong>{categoriesId}</strong>.
          </p>
          <Link to="/categories" className="text-primary hover:underline">
            Back to categories
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-linear-to-b from-muted/30 to-background px-6 py-6">
          <h1 className="text-2xl font-bold">{cat.title}</h1>
          {cat.description && (
            <p className="text-sm text-muted-foreground">{cat.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {cat.posts.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border p-4 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to="/posts/$postId"
                    params={{ postId: p.id }}
                    className="text-lg font-semibold hover:underline"
                  >
                    {p.title}
                  </Link>
                  {p.excerpt && (
                    <div className="text-sm text-muted-foreground">
                      {p.excerpt}
                    </div>
                  )}
                </div>
                <Link
                  to="/posts/$postId"
                  params={{ postId: p.id }}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Read
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
})

export default Route
