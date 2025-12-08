import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTeams, createTeam } from '@/lib/api/teams'

export default function Teams() {
  const qc = useQueryClient()
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(50),
  })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const create = useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      createTeam(payload),
    onSuccess: () => qc.invalidateQueries(['teams']),
  })

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Teams</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Groups and communities you can join
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-background border border-border hover:bg-accent hover:text-accent-foreground transition"
          >
            Find team
          </Link>
        </div>

        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Team name"
            className="p-2 border rounded-md"
          />
          <div className="flex gap-2">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (optional)"
              className="p-2 border rounded-md flex-1"
            />
            <button
              onClick={() => {
                if (!name) return
                create.mutate({ name, description })
                setName('')
                setDescription('')
              }}
              className="px-3 py-1 rounded bg-primary text-white"
            >
              Create
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative bg-background border border-border rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full mb-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((t: any) => (
              <article
                key={t.id}
                className="bg-background border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {t.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.members ?? 0} members</span>
                  <Link
                    to={`/teams/${t.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
