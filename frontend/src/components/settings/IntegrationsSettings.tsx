import React from 'react'

export default function IntegrationsSettings() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Integrations</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Connect external services to your account.
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">GitHub</div>
            <div className="text-xs text-muted-foreground">
              Sign in with GitHub to sync repos and avatars
            </div>
          </div>
          <a
            href="/api/auth/oauth/github"
            className="rounded-md border px-3 py-1 text-sm"
          >
            Connect
          </a>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Google</div>
            <div className="text-xs text-muted-foreground">
              Use Google for authentication
            </div>
          </div>
          <a
            href="/api/auth/oauth/google"
            className="rounded-md border px-3 py-1 text-sm"
          >
            Connect
          </a>
        </div>
      </div>
    </div>
  )
}
