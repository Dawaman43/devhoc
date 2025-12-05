import { createFileRoute, Link } from '@tanstack/react-router'

const demoSnippets = [
  { id: 'hello-js', title: 'Hello JavaScript', language: 'javascript' },
  { id: 'md-notes', title: 'Markdown Notes', language: 'markdown' },
  { id: 'html-preview', title: 'HTML Preview', language: 'html' },
]

export const Route = createFileRoute('/snippets/')({
  component: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Snippets</h1>
        <Link
          to="/snippets/new"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Create
        </Link>
      </div>
      <ul className="divide-y divide-border rounded-md border border-border">
        {demoSnippets.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between px-3 py-2"
          >
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-muted-foreground">{s.language}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/snippets/${s.id}`}
                className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
              >
                Open
              </Link>
              <Link
                to={`/snippets/${s.id}/editor`}
                className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ),
})

export default Route
