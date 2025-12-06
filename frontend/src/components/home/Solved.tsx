import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { listPosts } from '@/lib/api/posts'

export default function SolvedProblems() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['solved-posts'],
    queryFn: listPosts,
  })

  // In a real implementation, you would filter for posts with accepted answers
  // For now, we'll just show recent posts
  const recentPosts = posts.slice(0, 3)

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Recent posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest questions and discussions from the community
            </p>
          </div>

          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-background border border-border hover:bg-accent hover:text-accent-foreground transition"
          >
            View all
          </Link>
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
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="relative bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1"
              >
                <Link
                  to="/posts/$postId"
                  params={{ postId: post.id }}
                  className="block p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {post.content}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>{post.authorName || 'Anonymous'}</span>
                      {post.tags && post.tags.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-muted/40">
                          {post.tags[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        {post.views || 0} views
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
            {recentPosts.length === 0 && (
              <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
                No posts yet. Be the first to create one!
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
