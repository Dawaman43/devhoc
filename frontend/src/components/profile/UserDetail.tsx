import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PostsList } from '@/components/posts/PostsList'
import { FollowButton } from '@/components/profile/FollowButton'
import { Badge } from '@/components/ui/badge'

export type UserDetailProps = {
  user: any | null
  posts: any[] | null
  stats: any | null
  followers: any | null
  following: any | null
}

export default function UserDetail({
  user,
  posts,
  stats,
  followers,
  following,
}: UserDetailProps) {
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="text-lg font-semibold">Unable to load user</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There was a problem loading this profile. Check your network or try
            again.
          </p>
          <div className="mt-4">
            <button
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 md:size-20">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name ?? 'User'} />
              ) : (
                <AvatarFallback className="text-lg">
                  {(user?.name || 'U')[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-lg md:text-2xl font-semibold">
                {user?.name ?? 'User'}
              </h2>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  Joined{' '}
                  {new Date(user?.createdAt ?? Date.now()).toLocaleDateString()}
                </Badge>
                <Badge variant="default">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l2.9 6.26L21 9.27l-5 3.73L17.8 21 12 17.77 6.2 21 7 13l-5-3.73 6.1-1.01L12 2z" />
                  </svg>
                  {user?.reputation ?? 0}
                </Badge>
                {user?.role && <Badge variant="secondary">{user.role}</Badge>}
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="grid grid-cols-3 gap-2 bg-muted/10 rounded-md p-1">
              <div className="flex flex-col items-center px-3 py-2">
                <div className="text-sm font-semibold">
                  {stats?.postCount ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">posts</div>
              </div>
              <div className="flex flex-col items-center px-3 py-2">
                <div className="text-sm font-semibold">
                  {followers?.count ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">followers</div>
              </div>
              <div className="flex flex-col items-center px-3 py-2">
                <div className="text-sm font-semibold">
                  {following?.count ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">following</div>
              </div>
            </div>
            {user?.id && <FollowButton userId={user.id} />}
          </div>
        </div>
      </div>

      <div>
        <PostsList posts={posts ?? []} />
      </div>
    </div>
  )
}
