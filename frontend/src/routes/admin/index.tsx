import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminHome,
})

function Card({ title, to }: { title: string; to: string }) {
  return (
    <Link
      to={to}
      className="block p-4 rounded-lg border hover:bg-muted transition-colors"
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">
        Manage {title.toLowerCase()}
      </div>
    </Link>
  )
}

function AdminHome() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Control users, posts, tags, reports, and settings.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Users" to="/admin/users" />
        <Card title="Posts" to="/admin/posts" />
        <Card title="Tags" to="/admin/tags" />
        <Card title="Reports" to="/admin/reports" />
        <Card title="Settings" to="/admin/settings" />
      </div>
    </div>
  )
}
