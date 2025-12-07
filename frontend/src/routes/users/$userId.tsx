import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PostsList } from '@/components/posts/PostsList'
import { FollowButton } from '@/components/profile/FollowButton'
import {
  getUser,
  getUserPosts,
  getUserStats,
  getFollowersCount,
  getFollowingCount,
} from '@/lib/api/users'

export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params, context: { queryClient } }) => {
    const { userId } = params
    // load each resource but do not throw if one of them fails
    let user = null
    let posts = null
    let stats = null
    let followers = null
    let following = null

    try {
      user = await queryClient.ensureQueryData({
        queryKey: ['user', userId],
        queryFn: () => getUser(userId),
      })
    } catch (err) {
      // swallow — component will render a friendly error
      // eslint-disable-next-line no-console
      console.error('Failed to load user', err)
    }

    try {
      posts = await queryClient.ensureQueryData({
        queryKey: ['userPosts', userId],
        queryFn: () => getUserPosts(userId),
      })
    } catch (err) {
      // ignore
      // eslint-disable-next-line no-console
      console.error('Failed to load user posts', err)
    }

    try {
      stats = await queryClient.ensureQueryData({
        queryKey: ['userStats', userId],
        queryFn: () => getUserStats(userId),
      })
    } catch (err) {
      // ignore
      // eslint-disable-next-line no-console
      console.error('Failed to load user stats', err)
    }

    try {
      followers = await queryClient.ensureQueryData({
        queryKey: ['followersCount', userId],
        queryFn: () => getFollowersCount(userId),
      })
    } catch (err) {
      // ignore
      // eslint-disable-next-line no-console
      console.error('Failed to load followers count', err)
    }

    try {
      following = await queryClient.ensureQueryData({
        queryKey: ['followingCount', userId],
        queryFn: () => getFollowingCount(userId),
      })
    } catch (err) {
      // ignore
      // eslint-disable-next-line no-console
      console.error('Failed to load following count', err)
    }

    return { user, posts, stats, followers, following }
  },
  component: UserDetailRoute,
})

function UserDetailRoute() {
  const { user, posts, stats, followers, following } = Route.useLoaderData()
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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name ?? 'User'} />
              ) : (
                <AvatarFallback>{(user?.name || 'U')[0]}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user?.name ?? 'User'}</h2>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Joined:{' '}
                {new Date(user?.createdAt ?? Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground text-right">
              <div className="font-medium">{stats?.postCount ?? 0}</div>
              <div className="text-xs">posts</div>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              <div className="font-medium">{followers?.count ?? 0}</div>
              <div className="text-xs">followers</div>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              <div className="font-medium">{following?.count ?? 0}</div>
              <div className="text-xs">following</div>
            </div>
            {user?.id && <FollowButton userId={user.id} />}
          </div>
        </div>
        {user?.role && (
          <div className="mt-4 text-sm text-muted-foreground">
            Role: {user.role}
          </div>
        )}
      </div>

      <div>
        <PostsList posts={posts ?? []} />
      </div>
    </div>
  )
}

export default Route
