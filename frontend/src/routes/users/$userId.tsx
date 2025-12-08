import { createFileRoute } from '@tanstack/react-router'

import UserDetail from '@/components/profile/UserDetail'
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
  component: (props) => {
    // wrapper that passes loader data into the presentational component
    const { user, posts, stats, followers, following } = Route.useLoaderData()
    return (
      <UserDetail
        user={user}
        posts={posts}
        stats={stats}
        followers={followers}
        following={following}
      />
    )
  },
})
// presentational UI moved to `UserDetail` component

export default Route
