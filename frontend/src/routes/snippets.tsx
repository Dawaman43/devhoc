import { Outlet, Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/snippets')({
  component: () => (
    <div className="h-[calc(100vh-4rem)] w-full">
      <div className="flex h-full">
        <aside className="w-64 border-r border-border p-3 hidden md:block">
          <div className="mb-2 text-xs font-semibold text-muted-foreground">
            Snippets
          </div>
          <nav className="flex flex-col gap-1 text-sm">
            <Link
              to="/snippets"
              activeProps={{ className: 'text-foreground' }}
              className="rounded px-2 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Overview
            </Link>
            <Link
              to="/snippets/new"
              className="rounded px-2 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              New Snippet
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  ),
})

export default Route
