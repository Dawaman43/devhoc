import { useEffect, useState } from 'react'
import { searchUsers } from '@/lib/api/search'
import { getFollowersCount } from '@/lib/api/users'
import { Link } from '@tanstack/react-router'

type Dev = {
  id: string
  name: string
  role?: string
  avatar?: string | null
  followers?: number
}

function initials(name = '') {
  return name
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TopDevs() {
  const [devs, setDevs] = useState<Dev[]>([])
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await searchUsers('', { limit: 50 })
        const items = res.items ?? []

        const users: Dev[] = await Promise.all(
          items.map(async (u: any) => {
            let cnt = 0
            try {
              const c = await getFollowersCount(u.id)
              cnt = c.count ?? 0
            } catch (err) {}
            return {
              id: u.id,
              name: u.name || u.id,
              role: u.role,
              avatar: u.avatarUrl ?? null,
              followers: cnt,
            }
          }),
        )

        users.sort((a, b) => (b.followers || 0) - (a.followers || 0))
        if (!cancelled) setDevs(users)
      } catch (err) {
        console.error('Failed to load top devs', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Top Developers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              People to follow
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-background border border-border hover:bg-accent hover:text-accent-foreground transition"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative bg-background border border-border rounded-xl p-4 animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-muted mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full mb-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {devs.map((d) => (
              <article
                key={d.id}
                className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1"
              >
                <Link
                  to="/users/$userId"
                  params={{ userId: d.id }}
                  className="block p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-medium text-slate-700 dark:text-slate-100 overflow-hidden">
                      {d.avatar ? (
                        <img
                          src={d.avatar}
                          alt={d.name}
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <span>{initials(d.name)}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold line-clamp-2">
                        {d.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {d.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>{d.followers || 0} followers</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setFollowing((s) => ({ ...s, [d.id]: !s[d.id] }))
                        }}
                        className={`px-3 py-1 rounded ${following[d.id] ? 'bg-accent text-accent-foreground' : 'bg-background border border-border'}`}
                      >
                        {following[d.id] ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                </Link>
              </article>
            ))}

            {devs.length === 0 && (
              <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
                No developers found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
