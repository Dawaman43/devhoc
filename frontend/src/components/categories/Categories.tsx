import { useState } from 'react'
import { Link } from '@tanstack/react-router'

const SAMPLE_CATEGORIES = [
  {
    slug: 'react',
    name: 'React',
    count: 1245,
    desc: 'Components, hooks, SSR, and hydration.',
  },
  {
    slug: 'nodejs',
    name: 'Node.js',
    count: 832,
    desc: 'Servers, streams, and performance.',
  },
  {
    slug: 'sql',
    name: 'Databases',
    count: 641,
    desc: 'Queries, indexes, and data modeling.',
  },
  {
    slug: 'testing',
    name: 'Testing',
    count: 410,
    desc: 'Unit, integration and end-to-end testing.',
  },
  {
    slug: 'performance',
    name: 'Performance',
    count: 299,
    desc: 'Optimizations, bundling, caching.',
  },
  {
    slug: 'security',
    name: 'Security',
    count: 188,
    desc: 'Auth, XSS, CORS, and best practices.',
  },
]

export default function Categories() {
  const [query, setQuery] = useState('')

  const filtered = SAMPLE_CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.slug.includes(query.toLowerCase()),
  )

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse topics and find posts, snippets, and experts.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <label htmlFor="cat-search" className="sr-only">
              Search categories
            </label>
            <input
              id="cat-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat) => (
            <article
              key={cat.slug}
              className="group bg-background border border-border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    to="/categories/$categoriesId"
                    params={{ categoriesId: cat.slug }}
                    className="inline-flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary font-semibold">
                      {cat.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-foreground">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                        {cat.desc}
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">
                    {cat.count.toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    posts
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 text-sm text-muted-foreground">
            No categories match “{query}”. Try a different search.
          </div>
        )}
      </div>
    </section>
  )
}
