import React from 'react'
import { Link } from '@tanstack/react-router'

type Team = {
  id: string
  name: string
  description?: string
  members?: number
}

const DEMO_TEAMS: Team[] = [
  {
    id: 'devs-africa',
    name: 'Devs Africa',
    description: 'Community for African developers',
    members: 1245,
  },
  {
    id: 'open-source',
    name: 'Open Source',
    description: 'Collaborative OSS projects',
    members: 823,
  },
  {
    id: 'frontend',
    name: 'Frontend',
    description: 'UI/UX and frontend engineering',
    members: 612,
  },
]

export default function Teams() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_TEAMS.map((t) => (
            <article
              key={t.id}
              className="bg-background border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {t.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t.members} members</span>
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
      </div>
    </section>
  )
}
